import { Dimensions, SafeAreaView, View } from 'react-native';
import { useAtomValue } from 'jotai';

import { styles } from './styles';
import { eventsAtom } from './atoms';
import { EventCard } from 'components/home';

interface HomeProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

const Home = ({ navigation }: HomeProps) => {
  const events = useAtomValue(eventsAtom);

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
            {events &&
              events.map((event) => (
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
