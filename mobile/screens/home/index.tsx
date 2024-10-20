import { SafeAreaView, Text, View } from 'react-native';
import { useAtomValue } from 'jotai';

import TouchableImage from 'common/touchable-image';
import { styles } from './styles';
import { useEventsAtom } from './atoms';

interface HomeProps {
  navigation: any;
}

const Home = ({ navigation }: HomeProps) => {
  const eventsAtom = useEventsAtom('/events');
  const events = useAtomValue(eventsAtom);

  console.log(events);

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
          <TouchableImage
            onPress={() => navigation.navigate('Main')}
            image={require('assets/WWBF-KATYImage.png')}
            style={{
              width: 200,
              height: 200,
              marginBottom: 10,
            }}
          />
          <TouchableImage
            onPress={() => navigation.navigate('Main')}
            image={require('assets/WWBF-PflugervilleImage.png')}
            style={{
              width: 200,
              height: 200,
              marginBottom: 10,
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Home;
