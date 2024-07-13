import { Text } from 'react-native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';

const Vendors = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Text>Vendors</Text>
      <Text>Vendors will be listed here.</Text>
    </SafeAreaView>);
}

export default Vendors;
