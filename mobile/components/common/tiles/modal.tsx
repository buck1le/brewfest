import React, { useEffect } from 'react';
import { View, Modal } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './modal-styles';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

interface TileModalProps<T extends object> {
  item: T | undefined;
  visable: boolean;
  animationType: 'slide' | 'fade' | 'none';
  transparent: boolean;
  children: React.ReactNode;
  RenderItem: React.ComponentType<{ item: T }>;
  onRequestClose: () => void;
}

const TileModal = <T extends object>({
  item,
  visable,
  animationType,
  RenderItem,
  transparent,
  children,
  onRequestClose,
}: TileModalProps<T>) => {
  const translateY = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    if (visable) {
      translateY.value = 0;
    }
  }, [visable]);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      translateY.value = 0;
    },
    onActive: (event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    },
    onEnd: (event) => {
      if (event.translationY > 100) {
        runOnJS(onRequestClose)();
      } else {
        translateY.value = withSpring(0);
      }
    },
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal
          visible={visable}
          animationType={animationType}
          style={styles.modal}
          transparent={transparent}
          statusBarTranslucent
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.centeredView}>
              <PanGestureHandler onGestureEvent={panGestureHandler}>
                <Animated.View style={[styles.modalView, animatedStyle]}>
                  <View style={styles.dragIndicator} />
                  {item && <RenderItem item={item} />}
                </Animated.View>
              </PanGestureHandler>
            </View>
          </GestureHandlerRootView>
        </Modal>
        <View style={{
          gap: 10,
        }}>
          {children}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default TileModal;
