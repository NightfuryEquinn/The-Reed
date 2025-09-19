import { Text } from "react-native";

export default function Body({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <Text 
      style={{ fontFamily: "AlegreyaSans_400Regular" }}
      className={className}
    >
      { children }
    </Text>
  )
}