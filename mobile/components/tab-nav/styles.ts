import { StyleSheet, Platform } from 'react-native';

export const colors = {
  primary: '#f1b863',
  secondary: '#fff',
  blue: '#345384',
  grey: '#f5f5f5',
};


export const styles = StyleSheet.create({
  tabBackground: {
    backgroundColor: colors.blue,
    width: '100%',
    bottom: 0,
    position: 'absolute',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
      },
      android: {
        elevation: 5,
        height: 60,
      },
    }),
  },
  tabLabel: {
    ...Platform.select({
      android: {
        marginBottom: 10,
      },
    }),
  },
  leftHeader: {
    paddingLeft: 10,
    paddingTop: 30,
  },
  headerImage: {
    width: 70,
    height: 70,
    overflow: 'visible',
    resizeMode: 'contain', // this was the key to make it work on Android
  },
});
