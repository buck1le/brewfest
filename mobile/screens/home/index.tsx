import { Dimensions, SafeAreaView, Text, View } from 'react-native';
import { useAtomValue } from 'jotai';

import { styles } from './styles';
import { useEventsAtom } from './atoms';
import { Suspense } from 'react';
import { EventCard } from 'components/home';

interface HomeProps {
  navigation: any;
}

const ROOT_RESOURCE = `/events`;

const { width } = Dimensions.get('window');

const Home = ({ navigation }: HomeProps) => {
  const eventsAtom = useEventsAtom(ROOT_RESOURCE);
  const events = useAtomValue(eventsAtom);

  if (events.loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const numberOfEvents = events.data ? events.data.length : 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 30,
        }}
        >
          <Text style={{
            fontSize: 30,
            marginBottom: 20,
            color: '#211A0A',
          }}>
            Choose an Event Location
          </Text>
          <Suspense fallback={<Text>Loading...</Text>}>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '100%',
              gap: 10,
            }}>
              {events.data &&
                events.data.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    width={(width / numberOfEvents) * 0.9}
                    navigation={navigation}
                  />
                ))
              }
            </View>
          </Suspense>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Home;
