import { SafeAreaView, Text, View } from 'react-native';
import { useAtomValue } from 'jotai';

import TouchableImage from 'common/touchable-image';
import { styles } from './styles';
import { useEventsAtom } from './atoms';
import { HOST } from 'lib/request';

interface HomeProps {
  navigation: any;
}

const ROOT_RESOURCE = `${HOST}/events`;

const Home = ({ navigation }: HomeProps) => {
  const eventsAtom = useEventsAtom(ROOT_RESOURCE);
  const events = useAtomValue(eventsAtom);

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
                onPress={() => navigation.navigate('Main')}
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
