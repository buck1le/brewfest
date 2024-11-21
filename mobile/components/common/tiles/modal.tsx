import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Modal, Dimensions } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BaseTileProps } from '.';

import { styles } from './modal-styles';
import { useAtomValue, useSetAtom } from 'jotai';
import { modalVisableAtom } from 'atoms/index';
import { useImagesAtom } from './atoms';
import { Image } from 'expo-image';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

interface TileModalProps<T extends BaseTileProps> {
  item: T | null;
  visable: boolean;
  animationType: 'slide' | 'fade' | 'none';
  transparent: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

const width = Dimensions.get("window").width;

const TileModal = <T extends BaseTileProps>({
  item,
  visable,
  animationType,
  transparent,
  children,
  onRequestClose,
}: TileModalProps<T>) => {
  const setModalVisable = useSetAtom(modalVisableAtom);
  const ref = useRef<ICarouselInstance>(null);
  const imageUrls = item?.resources.images.map(image => image.url);
  const imagesAtom = useImagesAtom(imageUrls);
  const images = useAtomValue(imagesAtom);
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

  if (images.loading) {
    console.log('Loading images');
    return <Text>Loading...</Text>
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal
          visible={visable}
          animationType={animationType}
          style={styles.modal}
          transparent={transparent}
          statusBarTranslucent
          onShow={() => setModalVisable(true)}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.centeredView}>
              <PanGestureHandler onGestureEvent={panGestureHandler}>
                <Animated.View style={[styles.modalView, animatedStyle]}>
                  <View style={styles.modalView}>
                    <View style={styles.dragIndicator} />
                    <Carousel
                      ref={ref}
                      width={width}
                      height={width / 2}
                      data={item?.resources.images}
                      loop
                      autoPlay
                      autoPlayInterval={3000}
                      renderItem={({ item }) => (
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            source={{ uri: item.url }}
                            style={{
                              width: width,
                              height: width / 2,
                            }}
                          />
                        </View>
                      )}
                    />
                    <Text style={styles.modalText}>{item?.title}</Text>
                  </View>
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
