// components/ManipulableImage.tsx
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

type ManipulableImageProps = {
  uri: string;
};

export default function ManipulableImage({ uri }: ManipulableImageProps) {
  // Valores compartilhados para animação
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Valores de "contexto" para salvar o estado inicial do gesto
  const savedScale = useSharedValue(1);
  const savedRotate = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Gesto de Pinça (Zoom)
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    });

  // Gesto de Rotação
  const rotateGesture = Gesture.Rotation()
    .onStart(() => {
      savedRotate.value = rotate.value;
    })
    .onUpdate((e) => {
      // e.rotation é em radianos, convertemos para graus
      rotate.value = savedRotate.value + e.rotation;
    });

  // Gesto de Mover (Pan)
  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    });

  // Combina os três gestos para que funcionem simultaneamente
  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    rotateGesture,
    panGesture
  );

  // Estilo animado que aplica as transformações
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${(rotate.value * 180) / Math.PI}deg` }, // Converte radianos para graus
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Image
          source={{ uri }}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Permite que ele flutue sobre a imagem de fundo
    width: 150,
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});