// app/collage.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Button,
  Modal,
  Text,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';
import ManipulableImage from '../components/ManipulableImage'; 

const { width } = Dimensions.get('window');

type AddedImage = {
  id: string;
  uri: string;
};

export default function CollageScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const viewShotRef = useRef<ViewShot>(null);

  // --- CORREÇÃO 2: Verificação do parâmetro ---
  // Isso garante que mainImageUri é uma string e não 'undefined'
  const mainImageUri = (typeof params.mainImageUri === 'string') 
    ? params.mainImageUri 
    : undefined;

  const [addedImages, setAddedImages] = useState<AddedImage[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // 1. Adicionar novas imagens (stickers)
  const handleAddImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      setAddedImages((currentImages) => [
        ...currentImages,
        {
          id: Date.now().toString(), 
          uri: result.assets[0].uri,
        },
      ]);
    }
  };

  // 2. Salvar a colagem
  const handleSaveCollage = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de permissão para salvar na galeria.');
      return;
    }

    // --- CORREÇÃO 1: Definir e verificar o 'ref' ---
    // Copia o ref para uma variável local
    const ref = viewShotRef.current;

    // Verifica se o ref existe E se tem a função .capture
    if (!ref?.capture) {
      Alert.alert('Erro', 'Não foi possível capturar a imagem. Tente novamente.');
      setModalVisible(false);
      return;
    }
    // --- Fim da Correção 1 ---

    try {
      // Agora usamos a variável 'ref' que sabemos que não é nula
      const uri = await ref.capture(); 

      if (uri) {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Salvo!', 'Sua colagem foi salva na galeria.');
        setModalVisible(false);
        router.back();
      } else {
        throw new Error('Não foi possível capturar a imagem.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível salvar a colagem.');
      setModalVisible(false);
    }
  };

  // --- CORREÇÃO 2 (Continuação): Tratar o erro de URI ---
  // Se a URI não existir, mostre um erro em vez de travar o app
  if (!mainImageUri) {
    return (
      <View style={styles.errorContainer}>
        <Text>Erro: Imagem principal não encontrada.</Text>
        <Button title="Voltar" onPress={() => router.back()} />
      </View>
    );
  }

  // Se a URI existir, renderiza a tela de colagem
  return (
    <View style={styles.container}>
      <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
        <View style={styles.collageArea}>
          <Image
            source={{ uri: mainImageUri }} // Agora é seguro usar
            style={styles.mainImage}
            resizeMode="cover"
          />
          {addedImages.map((img) => (
            <ManipulableImage key={img.id} uri={img.uri} />
          ))}
        </View>
      </ViewShot>

      <View style={styles.controls}>
        <Button title="Adicionar Imagem" onPress={handleAddImage} />
        <Button title="Salvar Colagem" color="green" onPress={() => setModalVisible(true)} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Deseja mesmo salvar esta colagem?</Text>
            <View style={styles.modalButtons}>
              <Button title="Não" onPress={() => setModalVisible(false)} />
              <Button title="Sim, Salvar" onPress={handleSaveCollage} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// OS ESTILOS ESTÃO CORRETOS, APENAS ADICIONEI o 'errorContainer'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  collageArea: {
    width: width, 
    height: width, 
    backgroundColor: 'black',
    overflow: 'hidden', 
    position: 'relative', 
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  controls: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    width: '100%', 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});