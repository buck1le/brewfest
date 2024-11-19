import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import MapView, { Marker } from 'react-native-maps';
import { useAtomValue } from 'jotai';
import { selectedEventAtom } from 'atoms/index';
import { useVendorsAtom } from 'screens/vendors/atoms';


const Map = () => {
  const selectedEvent = useAtomValue(selectedEventAtom);

  if (!selectedEvent) {
    return <Text>Please select an event</Text>
  }

  const vendorsAtom = useVendorsAtom(selectedEvent.resources.vendors.href);
  const vendors = useAtomValue(vendorsAtom);


  return (
    <SafeAreaView style={styles.safeArea}>
      <MapView style={styles.map} initialRegion={{
        latitude: 30.52633718701628,
        longitude: -97.53902104398284,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}>
        {vendors.data && vendors.data.map((vendor, i) => (
          <Marker
            key={i}
            coordinate={{
              latitude: vendor.location.latitude,
              longitude: vendor.location.longitude,
            }}
            title={vendor.title}
            description={vendor.description}
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
}

export default Map;
