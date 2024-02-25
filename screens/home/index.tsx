import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { styles } from './styles';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text >Welcome to React Native Web!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

export default HomeScreen;
