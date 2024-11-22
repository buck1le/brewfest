import { StyleSheet } from 'react-native';

export const borderRadius = 6;

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
  tileContainerHightlight: {
    borderWidth: 2,
    borderColor: 'red',
  },
  vendorImage: {
    height: 130,
    width: 200,
    overflow: 'hidden',
    borderTopLeftRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
  },
  tilesColumContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  textContainer: {
    padding: 10,
    flexShrink: 1,
  },
});
