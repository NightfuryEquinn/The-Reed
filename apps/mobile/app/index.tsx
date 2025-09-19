import Action from "@/components/button/Action";
import Card from "@/components/button/Card";
import Body from "@/components/label/Body";
import Caption from "@/components/label/Caption";
import Title from "@/components/label/Title";
import { useRouter } from "expo-router";
import { Image, View } from "react-native";
import "../styles/global.css";
import IconAction from "@/components/button/IconAction";

export default function Index() {
  const router = useRouter()

  return (
    <View
      className="flex-1 items-center justify-center gap-2 bg-off-white"
    >
      <Image 
        source={require("../assets/logo.png")}
        className="w-60 h-60 mb-10 rounded-xl"
        resizeMode="cover"
      />
      <Title className="text-dark-grey text-4xl">The Reed</Title>
      <Body className="text-dark-grey text-xl mb-10">First-ever Bassoon AI</Body>
      <Caption className="text-dark-grey text-2xl mb-2">Your journey begins here</Caption>
      <Action text="Start" onPress={() => router.push("/(tabs)/dashboard")} />
    </View>
  );
}
