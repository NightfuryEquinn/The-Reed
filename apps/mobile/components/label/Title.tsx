import { Text } from "react-native";

export default function Title({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <Text 
      style={{ fontFamily: "AlegreyaSans_700Bold" }}
      className={className}
    >
      { children }
    </Text>
  )
}