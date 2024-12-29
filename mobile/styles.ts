import { StyleSheet, Platform } from 'react-native';

export const colors = {
  primary: '#f1b863',
  secondary: '#fff',
  grey: '#f5f5f5',
};


export const styles = StyleSheet.create({
  tabBackground: {
    backgroundColor: colors.secondary,
    width: '100%',
    bottom: 0,
    position: 'absolute',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.grey,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.5, shadowRadius: 3,
    ...Platform.select({
      ios: {
        height: 85,
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
