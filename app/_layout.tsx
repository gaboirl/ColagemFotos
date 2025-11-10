// app/_layout.tsx
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    // GestureHandler é necessário para as manipulações de imagem
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen 
          name="home" 
          options={{ title: 'Criar Colagem' }} 
        />
        <Stack.Screen 
          name="camera" 
          options={{ title: 'Tirar Foto', headerShown: false }} 
        />
        <Stack.Screen 
          name="collage" 
          options={{ title: 'Editar Colagem' }} 
        />
      </Stack>
    </GestureHandlerRootView>
  );
}