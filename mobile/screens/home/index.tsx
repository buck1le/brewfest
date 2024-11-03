import { SafeAreaView, Text, View } from 'react-native';
import { useAtomValue, useSetAtom } from 'jotai';

import TouchableImage from 'components/common/touchable-image';
import { styles } from './styles';
import { selectedEventAtom } from 'atoms/index';
import { useEventsAtom } from './atoms';
import { HOST } from 'lib/request';
import { Event } from 'types/api-responses';

interface HomeProps {
  navigation: any;
}

const ROOT_RESOURCE = `${HOST}/events`;

const Home = ({ navigation }: HomeProps) => {
  const eventsAtom = useEventsAtom(ROOT_RESOURCE);
  const events = useAtomValue(eventsAtom);
  const setSelectedEvent = useSetAtom(selectedEventAtom);

  console.log(events);

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
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
          }}
        >
          Welcome to the WWBF
        </Text>
        <Text
          style={{
            fontSize: 18,
          }}
        >
          Please select a location
        </Text>
        <View style={{
          flexDirection: 'column',
          gap: 50,
          marginTop: 50,
        }}
        >
          {events.data &&
            events.data.map((event) => (
              <TouchableImage
                key={event.id}
                onPress={() => handlePress(event)}
                image={event.image}
                style={{
                  width: 200,
                  height: 200,
                  marginBottom: 10,
                }}
              />
            ))
          }
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Home;
