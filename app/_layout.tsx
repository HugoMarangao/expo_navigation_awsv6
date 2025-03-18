import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import awsconfig from '../src/aws-exports';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    console.log('Configuring Amplify with AsyncStorage for session persistence');
    Amplify.configure({
      ...awsconfig,
      storage: AsyncStorage,
    });

    async function checkUser() {
      try {
        const user = await getCurrentUser();
        console.log('getCurrentUser returned:', user);
        setIsUserLoggedIn(!!user);
      } catch (err) {
        console.error('Error in getCurrentUser:', err);
        setIsUserLoggedIn(false);
      } finally {
        console.log('Hiding SplashScreen after checkUser');
        SplashScreen.hideAsync();
      }
    }

    checkUser();

    const unsubscribe = Hub.listen('auth', (data) => {
      const { event } = data.payload;
      console.log('Auth event received:', event);
      if (event === 'signedIn') {
        console.log('User signed in event received');
        setIsUserLoggedIn(true);
      } else if (event === 'signedOut') {
        console.log('User signed out event received');
        setIsUserLoggedIn(false);
      }
    });

    return () => {
      console.log('Removing auth listener');
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('Fonts loaded:', loaded, 'User logged state:', isUserLoggedIn);
    if (loaded && isUserLoggedIn !== null) {
      console.log('Hiding SplashScreen from second effect');
      SplashScreen.hideAsync();
      // Redireciona conforme o estado do usuário
      if (isUserLoggedIn) {
        console.log('User is logged in, redirecting to tabs');
        router.replace('/(tabs)');
      } else {
        console.log('No user logged in, redirecting to login');
        router.replace('/(login)');
      }
    }
  }, [loaded, isUserLoggedIn]);

  if (!loaded || isUserLoggedIn === null) {
    console.log('Loading fonts or user state not determined, rendering null');
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Note que removemos initialRouteName, pois o redirecionamento é feito via router.replace */}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title:'Home' }} />
        <Stack.Screen name="(account)" options={{ headerShown: false, title:'profile' }} />
        <Stack.Screen name="(login)" options={{ headerShown: false ,title: 'Login do Usuário'}} />
        <Stack.Screen name="(product)/[id]" options={{ headerShown: true, title: 'Detalhes do Produto' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
