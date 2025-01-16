import { Dimensions, StyleSheet } from 'react-native';

export const borderRadius = 6;

const width = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  tileContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: borderRadius,
    width: width - 20,
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
    paddingBottom: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    padding: 10,
    flexShrink: 1,
  },
});
