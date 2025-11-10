// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // Redireciona da rota base para a home
  return <Redirect href="/home" />;
}