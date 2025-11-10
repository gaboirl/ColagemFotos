// app/camera.tsx
import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  if (!permission) {
    return <View />;
  }

  // Lógica de permissão corrigida com um botão
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ textAlign: 'center', marginBottom: 10 }}>
          Precisamos da sua permissão para usar a câmera.
        </Text>
        <Button onPress={requestPermission} title="Dar Permissão" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          router.push({
            pathname: '/collage',
            params: { mainImageUri: photo.uri },
          });
        } else {
          Alert.alert('Erro', 'Não foi possível capturar a foto.');
        }
      } catch (e) {
        console.error(e);
        Alert.alert('Erro', 'Ocorreu um erro ao tirar a foto.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. A Câmera agora preenche o container */}
      <CameraView style={StyleSheet.absoluteFill} facing="back" ref={cameraRef} />

      {/* 2. O botão fica em uma View separada por cima */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // O estilo 'camera' foi removido
  buttonContainer: {
    flex: 1, // Faz o container de botões preencher a tela
    justifyContent: 'flex-end', // Joga o conteúdo para o final (baixo)
    alignItems: 'center', // Centraliza o botão
    backgroundColor: 'transparent', // Garante que esta View seja transparente
    marginBottom: 50,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: '#ccc',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});