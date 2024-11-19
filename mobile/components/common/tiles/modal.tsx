import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BaseTileProps } from '.';

import { styles } from './modal-styles';
import { useSetAtom } from 'jotai';
import { modalVisableAtom } from 'atoms/index';

interface TileModalProps<T extends BaseTileProps> {
  item: T | null;
  visable: boolean;
  animationType: 'slide' | 'fade' | 'none';
  transparent: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

const TileModal = <T extends BaseTileProps>({
  item,
  visable,
  animationType,
  transparent,
  children,
  onRequestClose,
}: TileModalProps<T>) => {
  const setModalVisable = useSetAtom(modalVisableAtom);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Modal
          visible={visable}
          animationType={animationType}
          style={styles.modal}
          transparent={transparent}
          statusBarTranslucent
          onShow={() => {
            console.log('modal shown')
            setModalVisable(true)
          }}
        >
          <View style={styles.modalView}>
            <View style={styles.dragIndicator} />
            <Text style={styles.modalText}>{item?.title}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={onRequestClose}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
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
