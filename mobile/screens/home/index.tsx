import { SafeAreaView, Text, View } from 'react-native';
import { useAtomValue, useSetAtom } from 'jotai';

import TouchableImage from 'components/common/touchable-image';
import { styles } from './styles';
import { selectedEventAtom } from 'atoms/index';
import { useEventsAtom } from './atoms';
import { Event } from 'types/api-responses';
import { Suspense } from 'react';

interface HomeProps {
  navigation: any;
}

const ROOT_RESOURCE = `/events`;

const Home = ({ navigation }: HomeProps) => {
  const eventsAtom = useEventsAtom(ROOT_RESOURCE);
  const events = useAtomValue(eventsAtom);
  const setSelectedEvent = useSetAtom(selectedEventAtom);

  if (events.loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handlePress = (event: Event) => {
    setSelectedEvent(event);
    navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={{
          flexDirection: 'column',
          gap: 50,
          marginTop: 50,
        }}
        >
          <Suspense fallback={<Text>Loading...</Text>}>
            {events.data &&
              events.data.map((event) => (
                <TouchableImage
                  key={event.id}
                  onPress={() => handlePress(event)}
                  image={event.thumbnail}
                  style={{
                    width: 300,
                    height: 300,
                    marginBottom: 10,
                  }}
                />
              ))
            }
          </Suspense>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Home;
