import {StyleSheet} from 'react-native';
import {Platform} from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    flexDirection: 'row',
  },
  tabLabel: {
    fontSize: 12,
  },
  button: {
    margin: 1,
    padding: 10,
    borderRadius: 18,
    width: 85,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
    }),
  },
});
