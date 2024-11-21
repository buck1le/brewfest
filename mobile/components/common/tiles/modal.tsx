import React, { useRef } from 'react';
import { View, Text, Pressable, Modal, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BaseTileProps } from '.';

import { styles } from './modal-styles';
import { useAtomValue, useSetAtom } from 'jotai';
import { modalVisableAtom } from 'atoms/index';
import { useImagesAtom } from './atoms';
import { Image } from 'expo-image';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';

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
  const progress = useSharedValue<number>(0);

  const imageUrls = item?.resources.images.map(image => image.url);

  const imagesAtom = useImagesAtom(imageUrls);
  const images = useAtomValue(imagesAtom);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

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
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.dragIndicator} />
              <Text style={styles.modalText}>{item?.title}</Text>
              <Carousel
                ref={ref}
                width={width}
                height={width / 2}
                data={item?.resources.images}
                loop
                renderItem={({ item }) => (
                  <View
                    style={{
                      flex: 1,
                      borderWidth: 1,
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

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={onRequestClose}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
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
