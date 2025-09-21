import Action from "@/components/button/Action";
import Card from "@/components/button/Card";
import Title from "@/components/label/Title";
import { audioMutations } from "@/repos/audio";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";

export default function Dashboard() {
  const router = useRouter();
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

          Alert.alert("Audio uploaded successfully");
        },
        onError: (error: any) => {
          console.error("Audio upload failed", error);

          Alert.alert("Audio upload failed", error.message);
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
    <View className="m-10 flex-1 gap-10">
      <View className="gap-4">
        <Title className="text-2xl text-dark-grey">Upload Audio</Title>
        <View className="flex-row">
          <Action
            text={loading ? "Uploading..." : "Select & Upload Audio"}
            disabled={loading}
            onPress={handleUpload}
          />
        </View>
      </View>

      <View className="gap-4">
        <Title className="text-2xl text-dark-grey">Quick Actions</Title>
        <Card source={require("../../assets/history.png")} title="History" onPress={() => router.push("/history")} />
        <Card disabled={true} source={require("../../assets/generate.png")} title="Generate" />
        <Card disabled={true} source={require("../../assets/bookmark.png")} title="Bookmark" />
      </View>
    </View>
  )
}