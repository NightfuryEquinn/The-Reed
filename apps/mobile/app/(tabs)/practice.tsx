import Card from "@/components/button/Card";
import { View } from "react-native";

export default function Practice() {
  return (
    <View className="m-10 flex-1 justify-between">
      <View className="gap-4">
        <Card source={require("../../assets/breathing.png")} title="Circular Breathing" />
        <Card source={require("../../assets/scale.png")} title="Scales" />
        <Card source={require("../../assets/tonal.png")} title="Tonal Exercises" />
      </View>
    </View>
  )
}