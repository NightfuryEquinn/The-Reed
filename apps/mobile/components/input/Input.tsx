import { TextInput, View } from "react-native";
import Body from "../label/Body";

interface TextInputProps {
  placeholder: string;
  example: string;
  onChangeText?: (text: string) => void;
}

export default function Input({ placeholder, example, onChangeText }: TextInputProps) {
  return (
    <View className="w-full gap-1.5">
      <Body className="text-dark-grey text-xl">{placeholder}</Body>
      <TextInput
        style={{ fontFamily: 'AlegreyaSans_400Regular' }}
        className="bg-off-grey rounded-xl px-6 py-3 text-xl"
        placeholder={example}
        secureTextEntry={placeholder === "Password" || placeholder === "Confirm Password"}
        onChangeText={onChangeText}
        autoCapitalize="none"
      />
    </View>
  )
}