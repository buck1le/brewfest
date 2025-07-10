import { StyleSheet, Dimensions, Platform } from "react-native";
import { colors } from "global_styles";

const { width } = Dimensions.get("window");

export const screenHeight = Dimensions.get('window').height;
export const CARD_HEIGHT = 220;
export const SCROLL_ZOOM_LEVEL = 0.006;
export const CARD_WIDTH = width * 0.8;
export const ANIMATINO_DURATION = 350;
export const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    width: 140,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#4da2ab',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    borderColor: '#007a87',
    borderWidth: 0.5,
  },
  amount: {
    flex: 1,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 16,
    borderColor: 'transparent',
    borderTopColor: '#4da2ab',
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 16,
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    alignSelf: 'center',
    marginTop: -0.5,
  },

  searchBox: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: "row",
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  chipsScrollView: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 80,
    paddingHorizontal: 10
  },
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection: "row",
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollView: {
    position: "absolute",
    flexDirection: "row",
    bottom: 80,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    // padding: 10, // <-- REMOVED: Padding is now handled by textContent for better control
    elevation: 5, // A subtle elevation for Android
    backgroundColor: "#FFF",
    borderRadius: 15, // <-- INCREASED: A slightly rounder corner looks more modern
    marginHorizontal: 10,
    // A softer, more professional shadow for iOS
    shadowColor: "#000",
    shadowRadius: 8, // <-- INCREASED: Diffuses the shadow
    shadowOpacity: 0.15, // <-- DECREASED: Makes the shadow much more subtle
    shadowOffset: { width: 0, height: 4 }, // A gentle offset
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 2,
    paddingHorizontal: 15, // Added more horizontal padding
    paddingVertical: 2, // Adjusted vertical padding
    justifyContent: 'center', // Vertically centers the text content
  },
  cardtitle: {
    fontSize: 16, // <-- INCREASED: Makes the title more prominent
    fontWeight: "bold",
    marginBottom: 4, // Added space between title and description
    color: '#333', // A dark gray is often softer than pure black
  },
  cardDescription: {
    fontSize: 13, // <-- INCREASED: For better readability
    color: "#666", // A lighter gray to de-emphasize from the title
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  marker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'blue', // Your unselected color
    borderWidth: 2,
    borderColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  markerSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red', // Your selected color
  },
  button: {
    alignItems: 'center',
    marginTop: 5
  },
  signIn: {
    width: '100%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },
  textSign: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});
