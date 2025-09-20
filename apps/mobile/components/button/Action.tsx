import { TouchableOpacity } from "react-native";
import Body from "../label/Body";

interface ActionProps {
  text: string;
  disabled?: boolean;
  onPress?: () => void;
}

export default function Action({ text, onPress, disabled }: ActionProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      className={`flex-1 px-5 py-1.5 bg-dark-grey rounded-xl ${disabled ? "opacity-50" : ""}`}
      onPress={onPress}
      disabled={disabled}
    >
      <Body className="text-off-white text-2xl text-center">
        { text }
      </Body>
    </TouchableOpacity>
  )
}