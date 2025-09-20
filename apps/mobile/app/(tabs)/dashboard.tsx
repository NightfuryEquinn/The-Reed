import Title from "@/components/label/Title";
import Action from "@/components/button/Action";
import { View, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { audioControllerUpload } from "@the-reed/swag";
import { audioMutations } from "@/repos/audio";

export default function Dashboard() {
  const [loading, setLoading] = useState(false)

  const upload = audioMutations.useUpload()

  const handleUpload = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (res.canceled) return;

      const asset = res.assets?.[0];
      if (!asset) return;

      const file: any = {
        uri: asset.uri,
        name: asset.name ?? `audio.${asset.mimeType?.split("/")[1] || "m4a"}`,
        type: asset.mimeType || "audio/m4a",
      };

      setLoading(true);

      upload.mutate({ file }, {
        onSuccess: () => {
          console.log("Audio uploaded successfully");
        },
        onError: (error: any) => {
          console.error("Audio upload failed", error);
        },
        onSettled: () => {
          setLoading(false);
        }
      });
    } catch (error: any) {
      console.error("Audio upload failed", error);
      setLoading(false);
    }
  };

  return (
    <View className="m-10 flex-1 justify-between">
      <View className="gap-4">
        <Title>Upload Audio</Title>
        <View className="flex-row">
          <Action
            text={loading ? "Uploading..." : "Select & Upload Audio"}
            disabled={loading}
            onPress={handleUpload}
          />
        </View>
      </View>
    </View>
  )
}