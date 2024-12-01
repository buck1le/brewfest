import { Animated, Dimensions, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Callout, MapMarker, Marker } from 'react-native-maps';
import { styles, CARD_WIDTH } from './styles';
import { useAtomValue } from 'jotai';
import { Image } from 'expo-image';
import { selectedEventAtom } from 'atoms/index';
import { useVendorsAtom } from 'screens/vendors/atoms';
import { useRef, useState } from 'react';
import { ScrollView } from 'react-native';

const { width } = Dimensions.get("window");

const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
const SCROLL_ZOOM_LEVEL = 0.01;
const ANIMATINO_DURATION = 350;


const Map = () => {
  const selectedEvent = useAtomValue(selectedEventAtom);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);

  const _map = useRef<MapView>(null);
  const _scrollView = useRef<ScrollView>(null);
  const markerRefs = useRef<{ [key: number]: MapMarker | null }>({});

  const vendorsAtom = useVendorsAtom(selectedEvent?.resources.vendors.href);
  const vendors = useAtomValue(vendorsAtom);

  let mapAnimation = new Animated.Value(0);

  const onScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            x: mapAnimation,
          }
        },
      },
    ],
    {
      useNativeDriver: true,
      listener: (event) => {
        const scrollX = event.nativeEvent.contentOffset.x;
        const index = Math.floor((scrollX + CARD_WIDTH / 2) / CARD_WIDTH);

        setSelectedMarker(index);

        if (index >= 0 && vendors.data && index < vendors.data.length) {
          const { coordinate } = vendors.data[index];

          _map.current?.animateToRegion(
            {
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
              latitudeDelta: SCROLL_ZOOM_LEVEL,
              longitudeDelta: SCROLL_ZOOM_LEVEL,
            },
            ANIMATINO_DURATION
          );
        }
      }
    }
  );

  const onMarkerPress = (mapEventData) => {
    const markerID = mapEventData._targetInst.return.key;

    let x = (markerID * CARD_WIDTH) + (markerID * 20);
    if (Platform.OS === 'ios') {
      x = x - SPACING_FOR_CARD_INSET;
    }

    if (!_scrollView.current) {
      return;
    }

    _scrollView.current.scrollTo({ x: x, y: 0, animated: true });
  }

  if (!selectedEvent) {
    return <Text>Please select an event</Text>
  }

  if (!vendors.data) {
    return <Text>Error: {vendors.error}</Text>
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <MapView style={styles.map}
        showsMyLocationButton={false}
        loadingEnabled={true}
        ref={_map}
        pitchEnabled={false}
        initialRegion={{
          latitude: selectedEvent.coordinate.latitude,
          longitude: selectedEvent.coordinate.longitude,
          latitudeDelta: selectedEvent.coordinate.latitudeDelta,
          longitudeDelta: selectedEvent.coordinate.longitudeDelta,
        }}
      >
        {vendors.data && vendors.data.map((vendor, i) => {
          return (
            <Marker
              key={i}
              ref={ref => markerRefs.current[i] = ref}
              tracksViewChanges={false}
              coordinate={{
                latitude: vendor.coordinate.latitude,
                longitude: vendor.coordinate.longitude,
              }}
              onPress={(e) => onMarkerPress(e)}
              pinColor={selectedMarker === i ? 'red' : 'blue'}
              flat={true}
            >
            </Marker>
          )
        })}
      </MapView>
      <ScrollView
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        height={50}
        style={styles.chipsScrollView}
        contentInset={{ // iOS only
          top: 0,
          left: 0,
          bottom: 0,
          right: 20
        }}
        contentContainerStyle={{
          paddingRight: Platform.OS === 'android' ? 20 : 0
        }}
      >
      </ScrollView>
      <Animated.ScrollView
        ref={_scrollView}
        horizontal
        pagingEnabled
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        style={styles.scrollView}
        contentInset={{
          top: 0,
          left: SPACING_FOR_CARD_INSET,
          bottom: 0,
          right: SPACING_FOR_CARD_INSET
        }}
        contentContainerStyle={{
          paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0
        }}
        onScroll={onScroll}
      >
        {vendors.data?.map((marker, index) => (
          <View style={styles.card} key={index}>
            <Image
              source={marker.image.url}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.textContent}>
              <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
              <Text numberOfLines={1} style={styles.cardDescription}>{marker.description}</Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

export default Map;
