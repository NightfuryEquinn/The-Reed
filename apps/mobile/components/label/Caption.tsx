import { Text } from "react-native";

export default function Caption({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <Text 
      style={{ fontFamily: "AlegreyaSans_100Thin" }}
      className={className}
    >
      { children }
    </Text>
  )
}