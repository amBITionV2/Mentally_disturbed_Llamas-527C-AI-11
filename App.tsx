// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import OnboardingScreen from './src/screens/OnboardingScreen';
// import LoginScreen from './src/screens/LoginScreen';
// import HomeScreen from './src/screens/HomeScreen';
// import ChatScreen from './src/screens/ChatScreen';
// import JournalScreen from './src/screens/JournalScreen';
// import ToolsScreen from './src/screens/ToolsScreen';
// import ProfileScreen from './src/screens/ProfileScreen';
// import MoodCheckScreen from './src/screens/MoodCheckScreen';
// import WellnessScreen from './src/screens/WellnessScree';
// import BottomNav from './src/components/BottomNav';
// import MusicThemesScreen from './src/screens/MusicScreen';
// import TimerSliderScreen from './src/screens/SongPage';
// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// // Tab Navigator Component
// function TabNavigator() {
//   return (
//     <Tab.Navigator
//       tabBar={(props: any) => <BottomNav {...props} />}
//       screenOptions={{ headerShown: false }}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Chat" component={ChatScreen} />
//       <Tab.Screen name="Journal" component={JournalScreen} />
//       <Tab.Screen name="Tools" component={ToolsScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//     </Tab.Navigator>
//   );
// }

// function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Onboarding">
//         <Stack.Screen 
//           name="Onboarding" 
//           component={OnboardingScreen} 
//           options={{ headerShown: false }} 
//         />
//         <Stack.Screen 
//           name="Login" 
//           component={LoginScreen} 
//           options={{ headerShown: false }} 
//         />
//         <Stack.Screen 
//           name="Tabs" 
//           component={TabNavigator} 
//           options={{ headerShown: false }} 
//         />
//         {/* Additional screens accessible from main app */}
//         <Stack.Screen 
//           name="MoodCheck" 
//           component={MoodCheckScreen} 
//           options={{ headerShown: false }} 
//         />
//         <Stack.Screen 
//           name="Wellness" 
//           component={WellnessScreen} 
//           options={{ headerShown: false }} 
//         />
//         <Stack.Screen 
//           name="Relax" 
//           component={MusicThemesScreen} 
//           options={{ headerShown: false }} 
//         />
//         <Stack.Screen 
//           name="Song" 
//           component={TimerSliderScreen} 
//           options={{ headerShown: false }} 
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default App;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Linking from 'expo-linking';

// screens...
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import JournalScreen from './src/screens/JournalScreen';
import ToolsScreen from './src/screens/ToolsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MoodCheckScreen from './src/screens/MoodCheckScreen';
import WellnessScreen from './src/screens/WellnessScree';
import BottomNav from './src/components/BottomNav';
import MusicThemesScreen from './src/screens/MusicScreen';
import TimerSliderScreen from './src/screens/SongPage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Avatar Screen (new)
function AvatarScreen() {
  React.useEffect(() => {
    Linking.openURL("exp://1nlzobk-thenameismad-8082.exp.direct");
  }, []);
  return null;
}

// Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Tools" component={ToolsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">

        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />

        {/* Add Avatar screen here */}
        <Stack.Screen name="Avatar" component={AvatarScreen} options={{ headerShown: false }} />

        {/* Other screens */}
        <Stack.Screen name="MoodCheck" component={MoodCheckScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Wellness" component={WellnessScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Relax" component={MusicThemesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Song" component={TimerSliderScreen} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
