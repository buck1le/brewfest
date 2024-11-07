import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tileContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tilesColumContainer: {
    flexDirection: 'column',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});
