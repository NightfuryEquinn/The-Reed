import Card from "@/components/button/Card";
import { View } from "react-native";

export default function Practice() {
  return (
    <View className="m-10 flex-1 justify-between">
      <View className="gap-4">
        <Card disabled={true} source={require("../../assets/breathing.png")} title="Circular Breathing" />
        <Card disabled={true} source={require("../../assets/scale.png")} title="Scales" />
        <Card disabled={true} source={require("../../assets/tonal.png")} title="Tonal Exercises" />
      </View>
    </View>
  )
}