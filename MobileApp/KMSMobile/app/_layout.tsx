import React, { useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import SplashTyping from '../components/SplashTyping';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);

  const [loaded] = useFonts({
    'CabinetGrotesk-Regular': require('../assets/fonts/CabinetGrotesk-Regular.ttf'),
    'CabinetGrotesk-Bold': require('../assets/fonts/CabinetGrotesk-Bold.ttf'),
    'CabinetGrotesk-Black': require('../assets/fonts/CabinetGrotesk-Black.ttf'),
  });

  if (!loaded) {
    return null;
  }

  if (showSplash) {
    return <SplashTyping onDone={() => setShowSplash(false)} />;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" backgroundColor="#000" />
    </ThemeProvider>
  );
}
