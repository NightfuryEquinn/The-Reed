import FontAwesome from "@expo/vector-icons/FontAwesome";
import { TouchableOpacity, View } from "react-native";
import Title from "../label/Title";

interface IconActionProps {
  source: keyof typeof FontAwesome.glyphMap;
  title: string;
  onPress?: () => void;
}

export default function IconAction({ source, title, onPress }: IconActionProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      className="w-full px-8 py-4 bg-dark-grey rounded-xl"
      onPress={onPress}
    >
      <View className="flex-row items-center gap-10">
        <FontAwesome className="w-10" name={source} size={40} color="white" />
        <Title className="text-off-white text-2xl">
          { title }
        </Title>
      </View>
    </TouchableOpacity>
  )
}