import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';


class CustomCallout extends React.Component<any, any> {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.bubble}>
          <View style={styles.amount}>{this.props.children}</View>
        </View>
        <View style={styles.arrowBorder} />
        <View style={styles.arrow} />
      </View>
    );
  }
}

const Map = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <MapView style={styles.map}>
        <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }}></Marker>
      </MapView>
    </SafeAreaView>
  );
}

export default Map;
