// app/home.tsx
import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

export default function HomeScreen() {
  const router = useRouter();

  // 1. Lógica para abrir a câmera
  const handleTakePhoto = async () => {
    // Pedir permissão para a câmera
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à câmera para tirar a foto.');
      return;
    }
    // Navegar para a tela da câmera
    router.push('/camera');
  };

  // 2. Lógica para escolher da galeria
  const handleChooseFromGallery = async () => {
    // Pedir permissão para a galeria
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à galeria para escolher a foto.');
      return;
    }

    // Abrir o seletor de imagens
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      // Se o usuário escolheu uma imagem, navega para a tela de colagem
      // passando a URI da imagem como parâmetro
      router.push({
        pathname: '/collage',
        params: { mainImageUri: result.assets[0].uri },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Tirar Foto Agora" onPress={handleTakePhoto} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Escolher da Galeria" onPress={handleChooseFromGallery} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
});