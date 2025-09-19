import IconAction from "@/components/button/IconAction";
import Title from "@/components/label/Title";
import { View } from "react-native";
import Constants from "expo-constants";
import Caption from "@/components/label/Caption";

export default function Profile() {
  const appVersion = Constants.expoConfig?.version || '0.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode || '1'

  return (
    <View className="m-10 flex-1 justify-between">
      <View className="gap-4">
        <IconAction source="user" title="Edit Profile" />
        <IconAction source="gear" title="Settings" />
      </View>

      <Caption className="text-center text-2xl text-dark-grey">App Version (Build) - {appVersion} ({buildNumber})</Caption>
    </View>
  )
}