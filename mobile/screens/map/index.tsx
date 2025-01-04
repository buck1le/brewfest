import { Animated, Platform, Text, View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { MapMarker, Marker } from 'react-native-maps';
import { useAtomValue } from 'jotai';
import { Image } from 'expo-image';
import { selectedEventAtom } from 'atoms/index';
import { useVendorsAtom } from 'screens/vendors/atoms';
import { useRef, useState } from 'react';
import { ScrollView } from 'react-native';

import {
  styles,
  CARD_WIDTH,
  ANIMATINO_DURATION,
  SCROLL_ZOOM_LEVEL,
  SPACING_FOR_CARD_INSET
} from './styles';
import { colors } from 'global_styles';
import S3Image from 'components/common/image';

const Map = () => {
  const selectedEvent = useAtomValue(selectedEventAtom);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);

  const _map = useRef<MapView>(null);
  const _scrollView = useRef<ScrollView>(null);
  const markerRefs = useRef<{ [key: number]: MapMarker | null }>({});

  if (!selectedEvent) {
    return <Text>Please select an event</Text>
  }
  
  const vendorsAtom = useVendorsAtom(selectedEvent.resources.vendors.href);
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
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollX = event.nativeEvent.contentOffset.x;
        const index = Math.floor((scrollX + CARD_WIDTH / 2) / CARD_WIDTH);

        setSelectedMarker(index);

        if (index >= 0 && vendors.data && index < vendors.data.length) {
          const { coordinates } = vendors.data[index];

          _map.current?.animateToRegion(
            {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: SCROLL_ZOOM_LEVEL,
              longitudeDelta: SCROLL_ZOOM_LEVEL,
            },
            ANIMATINO_DURATION
          );
        }
      }
    }
  );

  const onMarkerPress = (mapEventData: any) => {
    console.log(typeof mapEventData)

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
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <MapView style={styles.map}
        showsMyLocationButton={false}
        loadingEnabled={true}
        ref={_map}
        pitchEnabled={false}
        initialRegion={{
          latitude: selectedEvent.coordinates.latitude,
          longitude: selectedEvent.coordinates.longitude,
          latitudeDelta: 3,
          longitudeDelta: 3,
        }}
      >
        {vendors.data && vendors.data.map((vendor, i) => {
          return (
            <Marker
              key={i}
              ref={ref => markerRefs.current[i] = ref}
              tracksViewChanges={false}
              coordinate={{
                latitude: vendor.coordinates.latitude,
                longitude: vendor.coordinates.longitude,
              }}
              onPress={(e) => onMarkerPress(e)}
              pinColor={selectedMarker === i ? 'red' : 'blue'}
            >
            </Marker>
          )
        })}
      </MapView>
      <ScrollView
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
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
        scrollEnabled={false}
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
            <S3Image
              source={{ uri: marker.thumbnail }}
              style={styles.cardImage}
              contentFit='cover'
            />
            <View style={styles.textContent}>
              <Text numberOfLines={1} style={styles.cardtitle}>{marker.name}</Text>
              <Text numberOfLines={1} style={styles.cardDescription}>{marker.description}</Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

export default Map;
