import { Animated, Platform, Text, View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { MapMarker, Marker } from 'react-native-maps';
import { useAtom, useAtomValue } from 'jotai';
import { modalVisableAtom, selectedEventAtom } from 'atoms/index';
import { useVendorsAtom } from 'screens/vendors/atoms';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import { Vendor } from 'types/api-responses';
import TileModal from 'components/common/tiles/modal';
import { VendorModal } from 'components/vendors';
import { Pressable } from 'react-native-gesture-handler';

const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>): void => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

function usePrevious(value: any) {
  const ref = useRef<null | any>(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Map = () => {
  const selectedEvent = useAtomValue(selectedEventAtom);
  const [selectedMarker, setSelectedMarker] = useState<number>(0);

  const prevSelectedMarker = usePrevious(selectedMarker)
  const _map = useRef<MapView>(null);
  const _scrollView = useRef<ScrollView>(null);

  const [selectedItem, setSelectedItem] = useState<Vendor | undefined>(undefined);
  const [modalVisable, setModalVisable] = useAtom(modalVisableAtom);

  if (!selectedEvent) {
    return <Text>Please select an event</Text>
  }

  const vendorsAtom = useVendorsAtom(selectedEvent.resources.vendors.href);
  const { data: vendorsData, error: vendorsError, loading: vendorsLoading } = useAtomValue(vendorsAtom);

  let mapAnimation = useRef(new Animated.Value(0)).current;

  const animateMapToRegion = (index: number) => {
    if (index >= 0 && vendorsData && index < vendorsData.length) {
      const { coordinates } = vendorsData[index];
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
  };

  const debouncedAnimateMapToRegion = useCallback(debounce(animateMapToRegion, 300), [vendorsData]);

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / (CARD_WIDTH + 20));

    setSelectedMarker(index);
    debouncedAnimateMapToRegion(index);
  };

  const onTilePress = (item: Vendor, index: number) => {
    setSelectedMarker(index);
    debouncedAnimateMapToRegion(index);
    setSelectedItem(item);
    setModalVisable(true);
  }

  const onMarkerPress = (markerIndex: number) => {
    setSelectedMarker(markerIndex);
    let x = markerIndex * (CARD_WIDTH + 20);

    if (Platform.OS === 'ios') {
      x = x - SPACING_FOR_CARD_INSET;
    }

    if (_scrollView.current) {
      _scrollView.current.scrollTo({ x, y: 0, animated: true });
    }
  };


  if (!selectedEvent) {
    return <Text>Please select an event</Text>;
  }

  if (vendorsLoading) {
    return <Text>Loading vendors...</Text>;
  }

  if (vendorsError) {
    return <Text>Error: {vendorsError}</Text>; // Access error message property
  }

  if (!vendorsData) {
    return <Text>No vendors found for this event.</Text>;
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <MapView style={styles.map}
        showsMyLocationButton={true}
        loadingEnabled={true}
        ref={_map}
        pitchEnabled={false}
        initialRegion={{
          latitude: selectedEvent.coordinates.latitude,
          longitude: selectedEvent.coordinates.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {vendorsData.map((vendor, index) => {
          const isSelected = selectedMarker === index;
          const wasSelected = prevSelectedMarker === index;
          return (<Marker
            key={index}
            coordinate={{
              latitude: vendor.coordinates.latitude,
              longitude: vendor.coordinates.longitude,
            }}
            onPress={() => onMarkerPress(index)}
            // Re-render only the markers whose selection state has changed
            tracksViewChanges={isSelected || wasSelected}
          >
            {/* Custom view for the marker */}
            <View style={[styles.markerWrap]}>
              <View style={[styles.marker, isSelected && styles.markerSelected]} />
            </View>
          </Marker>
          );
        })}
      </MapView>
      <Animated.ScrollView
        ref={_scrollView}
        horizontal
        decelerationRate="fast"
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        onMomentumScrollEnd={onMomentumScrollEnd}
        snapToAlignment="center"
        style={styles.scrollView}
        contentInset={{ // iOS only
          top: 0,
          left: SPACING_FOR_CARD_INSET,
          bottom: 0,
          right: SPACING_FOR_CARD_INSET,
        }}
        contentContainerStyle={{
          paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: mapAnimation } } }],
          { useNativeDriver: true }
        )}
      >
        {vendorsData.map((vendor, index) => (
          <Pressable
            style={styles.card}
            onPress={() => onTilePress(vendor, index)}
            key={index}
          >
            <S3Image
              uri={vendor.thumbnail}
              style={styles.cardImage}
              contentFit="cover"
            />
            <View style={styles.textContent}>
              <Text numberOfLines={1} style={styles.cardtitle}>
                {vendor.name}
              </Text>
              <Text numberOfLines={1} style={styles.cardDescription}>
                {vendor.description}
              </Text>
            </View>
          </Pressable>
        ))}
      </Animated.ScrollView>

      <TileModal
        item={selectedItem}
        animationType="slide"
        children={null}
        transparent={true}
        visable={modalVisable}
        onRequestClose={() => setModalVisable(false)}
        RenderItem={({ item }: { item: Vendor }) => (
          <VendorModal item={item} />
        )}
      />
    </View>
  );
}

export default Map;
