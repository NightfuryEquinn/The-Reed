import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      animation: 'shift',
      tabBarActiveTintColor: '#2b2827',
      tabBarStyle: {
        height: 100,
        paddingTop: 6,
      },
      tabBarLabelStyle: {
        marginTop: 2,
        fontSize: 12,
        fontFamily: 'AlegreyaSans_700Bold',
      },
      headerTitleStyle: {
        fontSize: 24,
        fontFamily: 'AlegreyaSans_700Bold',
      },
      headerBackground: () => <View />,
    }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'DASHBOARD',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'PRACTICE',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
