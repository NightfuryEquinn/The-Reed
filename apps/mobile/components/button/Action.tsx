import { TouchableOpacity } from "react-native";
import Body from "../label/Body";

interface ActionProps {
  text: string;
  onPress?: () => void;
}

export default function Action({ text, onPress }: ActionProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      className="px-5 py-1.5 bg-dark-grey rounded-xl"
      onPress={onPress}
    >
      <Body className="text-off-white text-2xl">
        { text }
      </Body>
    </TouchableOpacity>
  )
}