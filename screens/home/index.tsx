import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { styles } from './styles';
import { Button } from 'react-native';

const Home = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text >Welcome to React Native Web!</Text>
      <StatusBar style="auto" />
      <Button
        title="Go to Schedule"
        onPress={() => navigation.navigate('Main')}
      />
    </View>
  );
}

export default Home;
