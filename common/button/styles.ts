import {StyleSheet} from 'react-native';
import {colors} from 'global_styles';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  leftHeader: {
    marginLeft: 10,
  },
});

