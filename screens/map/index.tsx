import React from 'react';
import { Text } from 'react-native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';


const Map = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Text>Map</Text>
    </SafeAreaView>
  );
}


export default Map;
