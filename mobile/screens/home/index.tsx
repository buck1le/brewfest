import { Dimensions, SafeAreaView, Text, View } from 'react-native';
import { useAtomValue } from 'jotai';

import { styles } from './styles';
import { useEventsAtom } from './atoms';
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
          <View style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            gap: 10,
          }}>
            {events.data &&
              events.data.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  width={width * 0.8}
                  navigation={navigation}
                />
              ))
            }
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Home;
