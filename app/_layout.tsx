import '../global.css';

import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ConvexProvider, ConvexReactClient, useMutation } from 'convex/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { loadSession } from '../src/lib/auth';
import { useAuthStore } from '../src/stores/authStore';
import { api } from '../convex/_generated/api';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert:  true,
    shouldPlaySound:  true,
    shouldSetBadge:   true,
    shouldShowBanner: true,
    shouldShowList:   true,
  }),
});

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL ?? '');
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60, retry: 2 },
  },
});

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const { setUser, setToken, setLoading, user } = useAuthStore();
  const updatePushToken = useMutation(api.users.updatePushToken);

  useEffect(() => {
    loadSession()
      .then((session) => {
        if (session) {
          setToken(session.token);
          setUser(session.user);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false))
      .finally(() => SplashScreen.hideAsync());
  }, []);

  // Register for push notifications once the user is known
  useEffect(() => {
    if (!user) return;

    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      // Android requires a notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name:       'Default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      await updatePushToken({ userId: user._id, pushToken: token });
    })().catch(() => {});
  }, [user?._id]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConvexProvider client={convex}>
        <QueryClientProvider client={queryClient}>
          <AuthBootstrap>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(app)" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </AuthBootstrap>
        </QueryClientProvider>
      </ConvexProvider>
    </GestureHandlerRootView>
  );
}
