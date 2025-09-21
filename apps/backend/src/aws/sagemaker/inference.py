# inference.py
import io
import json
import base64
import tempfile
import os

import boto3
import numpy as np
import soundfile as sf
import librosa

s3 = boto3.client("s3")

def model_fn(model_dir):
    """
    No heavy model required for analysis — return a lightweight config object.
    """
    return {"model_dir": model_dir}

def _download_from_s3(s3_uri):
    # s3_uri like s3://bucket/key
    _, _, path = s3_uri.partition("s3://")
    bucket, _, key = path.partition("/")
    obj = s3.get_object(Bucket=bucket, Key=key)
    return obj["Body"].read()

def input_fn(request_body, request_content_type):
    """
    Accept JSON with s3_uri or raw bytes audio payload.
    Return raw audio bytes.
    """
    if request_content_type == "application/json":
        j = json.loads(request_body)
        if "s3_uri" in j:
            return _download_from_s3(j["s3_uri"])
        elif "audio_base64" in j:
            return base64.b64decode(j["audio_base64"])
        else:
            raise ValueError("JSON must contain s3_uri or audio_base64")
    elif request_content_type.startswith("audio/") or request_content_type == "application/octet-stream":
        # request_body is bytes
        return request_body
    else:
        raise ValueError(f"Unsupported content type: {request_content_type}")

def _load_audio(audio_bytes, sr_target=22050):
    # soundfile can read raw bytes via BytesIO
    bio = io.BytesIO(audio_bytes)
    try:
        y, sr = sf.read(bio, dtype="float32")
    except Exception:
        # fallback to librosa (audioread) if soundfile fails
        bio.seek(0)
        y, sr = librosa.load(bio, sr=sr_target, mono=True)
    if y.ndim > 1:
        y = np.mean(y, axis=1)
    # resample if needed
    if sr != sr_target:
        y = librosa.resample(y, orig_sr=sr, target_sr=sr_target)
        sr = sr_target
    return y, sr

def _estimate_pitch(y, sr):
    # Use piptrack to find predominant pitch per frame, then take median of non-zero pitches
    pitches, mags = librosa.piptrack(y=y, sr=sr)
    pitch_values = []
    for i in range(pitches.shape[1]):
        index = mags[:, i].argmax()
        pitch = pitches[index, i]
        if pitch > 0:
            pitch_values.append(pitch)
    if len(pitch_values) == 0:
        return None, None
    pitch_arr = np.array(pitch_values)
    return float(np.median(pitch_arr)), float(np.std(pitch_arr))

def predict_fn(input_bytes, model):
    # load audio
    y, sr = _load_audio(input_bytes)
    if y.size == 0:
        raise ValueError("Empty audio")
    duration = float(len(y)/sr)
    rms_frames = librosa.feature.rms(y=y)[0]
    rms = float(np.mean(rms_frames))
    rms_db = 20.0 * np.log10(rms + 1e-9)
    peak = float(np.max(np.abs(y)))
    dynamic_range_db = 20.0 * np.log10((peak + 1e-9) / (rms + 1e-9))
    spectral_centroid = float(np.mean(librosa.feature.spectral_centroid(y=y, sr=sr)))
    spectral_bandwidth = float(np.mean(librosa.feature.spectral_bandwidth(y=y, sr=sr)))
    zcr = float(np.mean(librosa.feature.zero_crossing_rate(y)))
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
    # Onset stability (variance of onset strength)
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    onset_std = float(np.std(onset_env)) if onset_env.size > 0 else 0.0
    # pitch
    pitch_median_hz, pitch_std_hz = _estimate_pitch(y, sr)

    # Simple noise-floor and SNR estimate
    frame_rms = rms_frames
    noise_floor = float(np.percentile(frame_rms, 10)) + 1e-9
    snr_db = 20.0 * np.log10((rms + 1e-9) / noise_floor)

    metrics = {
        "duration_sec": duration,
        "sample_rate": sr,
        "rms": rms,
        "rms_db": rms_db,
        "peak": peak,
        "dynamic_range_db": dynamic_range_db,
        "spectral_centroid_hz": spectral_centroid,
        "spectral_bandwidth_hz": spectral_bandwidth,
        "zero_crossing_rate": zcr,
        "tempo_bpm": float(tempo),
        "onset_std": onset_std,
        "pitch_median_hz": pitch_median_hz,
        "pitch_std_hz": pitch_std_hz,
        "snr_db": snr_db
    }

    # generate human-friendly feedback
    feedback = []
    if rms_db < -30:
        feedback.append("Recording is quiet — increase input gain or sing/play closer to the microphone.")
    if snr_db < 10:
        feedback.append("Background noise is high — record in a quieter environment or use noise reduction.")
    if dynamic_range_db < 10:
        feedback.append("Dynamics are compressed — try adding more expressive volume variation.")
    if onset_std > 0.1:
        feedback.append("Timing / rhythm feels uneven — practice with a metronome to improve tempo consistency.")
    if pitch_median_hz is not None and pitch_std_hz is not None and pitch_std_hz > 30:
        feedback.append("Pitch varies a lot — work on steady pitch control or intonation.")
    if spectral_centroid > 4000:
        feedback.append("Tone is bright/harsh — consider playing/singing warmer or adjust EQ.")
    if len(feedback) == 0:
        feedback.append("Recording looks good — clear signal and stable performance. Keep it up!")

    return {"metrics": metrics, "feedback": feedback}

def output_fn(prediction, accept):
    return json.dumps(prediction), "application/json"
