// app/camera.tsx (Corrigido)
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
      <CameraView style={styles.camera} facing="back" ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
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
  // Estilo para o container do botão de permissão
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});