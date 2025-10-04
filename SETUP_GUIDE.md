# Mental Health App Setup Guide

## Overview
This React Native mental health app features a stack navigator with a nested bottom tab navigator, using @react-navigation/native and @react-navigation/bottom-tabs. The app includes screens for onboarding, login, home, chat, journal, tools, and profile.

## Navigation Structure

### Stack Navigator (Main)
- **Onboarding** → **Login** → **Tabs** (Tab Navigator)
- **Chat** and **Journal** are also available as separate stack screens for direct navigation

### Tab Navigator (Nested)
- **Home** - Main dashboard with mood tracking and stats
- **Chat** - AI Therapist (Rancho) chat interface
- **Journal** - Mood and wellness tracking with calendar
- **Tools** - Mental health tools and resources
- **Profile** - User settings and account management

## Dependencies

### Required Dependencies
```json
{
  "@expo/vector-icons": "^15.0.2",
  "@react-native-async-storage/async-storage": "^2.2.0",
  "@react-navigation/native": "^7.1.17",
  "@react-navigation/native-stack": "^7.3.26",
  "@react-navigation/bottom-tabs": "^7.1.17",
  "axios": "^1.12.2",
  "expo": "~54.0.10",
  "expo-camera": "~17.0.8",
  "expo-font": "~12.0.10",
  "expo-linear-gradient": "~15.0.7",
  "expo-status-bar": "~3.0.8",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "react-native-gesture-handler": "~2.28.0",
  "react-native-reanimated": "~4.1.1",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-screens": "~4.16.0",
  "react-native-svg": "^15.13.0"
}
```

### Missing Dependencies to Install
```bash
npm install @react-navigation/bottom-tabs expo-font
```

## Font Setup (Space Grotesk)

### 1. Install Expo Font
```bash
npx expo install expo-font
```

### 2. Download Space Grotesk Fonts
Download the following font files and place them in `assets/fonts/`:
- `SpaceGrotesk-Regular.ttf`
- `SpaceGrotesk-Medium.ttf`
- `SpaceGrotesk-SemiBold.ttf`
- `SpaceGrotesk-Bold.ttf`

### 3. Update app.json
```json
{
  "expo": {
    "fonts": [
      {
        "SpaceGrotesk": "./assets/fonts/SpaceGrotesk-Regular.ttf"
      },
      {
        "SpaceGrotesk-Medium": "./assets/fonts/SpaceGrotesk-Medium.ttf"
      },
      {
        "SpaceGrotesk-SemiBold": "./assets/fonts/SpaceGrotesk-SemiBold.ttf"
      },
      {
        "SpaceGrotesk-Bold": "./assets/fonts/SpaceGrotesk-Bold.ttf"
      }
    ]
  }
}
```

### 4. Load Fonts in App.tsx
```typescript
import * as Font from 'expo-font';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'SpaceGrotesk': require('./assets/fonts/SpaceGrotesk-Regular.ttf'),
        'SpaceGrotesk-Medium': require('./assets/fonts/SpaceGrotesk-Medium.ttf'),
        'SpaceGrotesk-SemiBold': require('./assets/fonts/SpaceGrotesk-SemiBold.ttf'),
        'SpaceGrotesk-Bold': require('./assets/fonts/SpaceGrotesk-Bold.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />; // or your loading component
  }

  // ... rest of your app
}
```

## Color Scheme

### Primary Colors
- **Primary**: `#13ecec` (Cyan)
- **Background Light**: `#f6f8f8` (Light Gray)
- **Background Dark**: `#102222` (Dark Teal)

### Usage in Components
All components support dark mode using `useColorScheme()` hook:
```javascript
const isDarkMode = useColorScheme() === 'dark';
```

## Testing Instructions

### 1. Start the Development Server
```bash
npm start
# or
expo start
```

### 2. Test Navigation Flow
1. **Onboarding Screen** should load first
2. Tap "Get Started" → should navigate to **Login Screen**
3. Enter any email/password → should navigate to **Tabs** (Home screen)
4. Test bottom navigation between all 5 tabs:
   - **Home** - Check mood tracker, stats, and action buttons
   - **Chat** - Test message input, quick replies, camera button
   - **Journal** - Test calendar navigation and journal entries
   - **Tools** - Test tool cards and navigation
   - **Profile** - Test settings toggles and options

### 3. Test Dark Mode
- Toggle device dark mode in settings
- Verify all screens adapt to dark/light themes
- Check that colors, text, and backgrounds change appropriately

### 4. Test Direct Navigation
- From Home screen, tap "Chat with Rancho" → should navigate to Chat
- From Home screen, tap "Log Mood" → should navigate to Journal
- From Tools screen, tap "Mood Tracker" → should navigate to Journal

### 5. Test Responsiveness
- Test on different screen sizes (phone, tablet)
- Verify layouts adapt properly
- Check that text remains readable

## Key Features Verified

### ✅ Navigation
- Stack navigator with proper flow: Onboarding → Login → Tabs
- Bottom tab navigator with 5 tabs (Home, Chat, Journal, Tools, Profile)
- Direct navigation between screens
- Back button functionality in Chat screen

### ✅ UI Components
- **BottomNav**: Highlights active tab with primary color (#13ecec)
- **Header**: Back button and title with dark mode support
- **ChatBubble**: User and AI message bubbles with proper styling
- **ChatScreen**: Message input, quick replies, camera button alert

### ✅ Dark Mode Support
- All screens use `useColorScheme()` hook
- Proper color switching between light and dark themes
- Space Grotesk font family applied throughout

### ✅ Functionality
- Message state management in ChatScreen
- Auto-scroll to bottom when new messages added
- Quick reply buttons for common responses
- Camera button shows alert (ready for image picker integration)
- Settings toggles in Profile screen

## Troubleshooting

### Common Issues
1. **Font not loading**: Ensure font files are in correct directory and app.json is updated
2. **Navigation errors**: Check that all screen components are properly imported
3. **Dark mode not working**: Verify `useColorScheme()` is imported and used correctly
4. **Bottom nav not highlighting**: Check that `activeTab` prop is passed correctly

### Performance Tips
- Use `React.memo()` for components that don't need frequent re-renders
- Implement proper state management for complex data
- Consider using `useCallback()` for event handlers in lists

## Next Steps
1. Implement real authentication with backend
2. Add image picker functionality for camera button
3. Integrate real AI chat API for Rancho responses
4. Add data persistence with AsyncStorage
5. Implement push notifications
6. Add more mental health tools and exercises
