import { View } from 'react-native';
import { Dropdown as ElementDropdown } from 'react-native-element-dropdown';

interface DropdownProps {
  role: string;
  setRole: (role: string) => void;
}

export default function Dropdown({ role, setRole }: DropdownProps) {
  return (
    <View className="w-full">
      <ElementDropdown
        style={{
          backgroundColor: '#e7e3df',
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 12,
        }}
        containerStyle={{
          borderRadius: 12,
          shadowColor: 'transparent',
        }}
        placeholderStyle={{
          fontSize: 20,
          lineHeight: 28,
          color: '#2b2827',
          fontFamily: 'AlegreyaSans_400Regular',
        }}
        itemTextStyle={{
          fontSize: 20,
          lineHeight: 28,
          color: '#2b2827',
          fontFamily: 'AlegreyaSans_400Regular',
        }}
        selectedTextStyle={{
          fontSize: 20,
          lineHeight: 28,
          color: '#2b2827',
          fontFamily: 'AlegreyaSans_400Regular',
        }}
        labelField="label"
        valueField="value"
        data={[
          { label: 'Bassoonist', value: 'bassoonist' },
          { label: 'Mentor', value: 'mentor' },
        ]}
        placeholder="Create as ..."
        value={role}
        onChange={(item) => setRole(item.value)}
      />

    </View>
  )
}