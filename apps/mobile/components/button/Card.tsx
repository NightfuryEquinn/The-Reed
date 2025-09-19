import { Image, ImageSourcePropType, TouchableOpacity, View } from "react-native";
import Title from "../label/Title";

interface CardProps {
  source: ImageSourcePropType;
  title: string;
  onPress?: () => void;
}

export default function Card({ source, title, onPress }: CardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      className="w-full px-8 py-4 bg-dark-grey-brown rounded-xl"
      onPress={onPress}
    >
      <View className="flex-row items-center gap-10">
        <Image 
          source={source}
          className="w-10 h-10"
          resizeMode="cover"
        />
        <Title className="text-2xl text-off-grey">{title}</Title>
      </View>
    </TouchableOpacity>
  )
}