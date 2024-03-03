import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1B863',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBackground: {
    backgroundColor: '#fff',
    width: '100%',
    bottom: 0,
    position: 'absolute',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
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
    paddingLeft: 20,
    paddingTop: 20,
  },
  headerImage: {
    width: 60,
    height: 60,
    overflow: 'visible',
  },
});

