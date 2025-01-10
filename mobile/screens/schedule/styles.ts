import { Dimensions, StyleSheet } from "react-native";
import { colors } from "global_styles";

export const borderRadius = 6;

const width = Dimensions.get('window').width;


export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventList: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 80,
    alignItems: 'center',
  },
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
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 80,
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  skeletonContainer: {
    marginTop: 30,
    gap: 10,
  },
  textContainer: {
    padding: 10,
    flexShrink: 1,
  },
});
