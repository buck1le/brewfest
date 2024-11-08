import { StyleSheet } from 'react-native';

const borderRadius = 6;

export const styles = StyleSheet.create({
  tileContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: borderRadius,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  vendorImage: {
    height: 130,
    width: 200,
    overflow: 'hidden',
    borderTopLeftRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
  },
  tilesColumContainer: {
    flexDirection: 'column',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  textContainer: {
    padding: 10,
  },
});
