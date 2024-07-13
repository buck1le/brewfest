import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text, View } from 'react-native';
import { styles } from './styles';
import Button from "common/button";

interface HomeProps {
  navigation: any;
}

const Home = ({ navigation }: HomeProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text >Welcome to React Native Web!</Text>
        <StatusBar style="auto" />
        <Button
          onPress={() => navigation.navigate('Main')}
        >
          <Text>
            Hello there
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

export default Home;
