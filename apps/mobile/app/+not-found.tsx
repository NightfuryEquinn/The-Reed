import IconAction from "@/components/button/IconAction";
import Body from "@/components/label/Body";
import Title from "@/components/label/Title";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function NotFound() {
  const router = useRouter()

  return (
    <View className="flex-1 items-center justify-center gap-2">
      <Title className="text-dark-grey text-3xl">What the heck you doing here?</Title>
      <Body className="text-dark-grey text-xl">You're not supposed to be here</Body>
      <Body className="text-dark-grey text-xl">Begone, trespasser!</Body>

      <View className="flex-row mt-10 mx-32">
        <IconAction source="home" title="Go Back" onPress={() => router.dismissTo('/dashboard')} />
      </View>
    </View>
  )
}