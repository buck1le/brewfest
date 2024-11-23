import { Dimensions, StyleSheet } from 'react-native';

const viewHeight = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    height: viewHeight * 0.8,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
    alignItems: 'center',
    elevation: 5,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#DEDEDE',
    borderRadius: 2,
    marginBottom: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  carouselContainer: {
    alignItems: 'center',
    width: '100%',
    height: 200,
    marginBottom: width > 393 ? 30 : 0,
  },
  copyContainer: {
    width: '100%',
    alignItems: 'center',
  },
  itemTitle: {
    alignSelf: 'flex-start',
    fontSize: 38,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});

