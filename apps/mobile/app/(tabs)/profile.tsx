import IconAction from "@/components/button/IconAction";
import Caption from "@/components/label/Caption";
import { idTokenStorage, tokenStorage, userStorage } from "@/repos/store";
import { signOut } from "aws-amplify/auth";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function Profile() {
  const router = useRouter()

  const appVersion = Constants.expoConfig?.version || '0.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode || '1'

  const handleLogout = async () => {
    await userStorage.removeUser()
    await tokenStorage.removeToken()
    await idTokenStorage.removeIdToken()

    await signOut()

    router.push('/')
  }

  return (
    <View className="m-10 flex-1 justify-between">
      <View className="gap-4">
        <IconAction disabled={true} source="user" title="Edit Profile" />
        <IconAction disabled={true} source="gear" title="Settings" />
        <IconAction disabled={true} source="dollar" title="Go Premium" />
        <IconAction source="sign-out" title="Logout" onPress={handleLogout} />
      </View>

      <Caption className="text-center text-2xl text-dark-grey">App Version (Build) - {appVersion} ({buildNumber})</Caption>
    </View>
  )
}