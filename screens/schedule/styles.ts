import { StyleSheet, Dimensions } from "react-native";
import { colors } from "global_styles";

const screenHeight = Dimensions.get("window").height;

export const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: colors.secondary,
    flex: 1,
  },
  imageContainer: {
    flex: 1,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  time: {
    fontSize: 18,
    color: "#888",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: screenHeight * 0.4,
    marginBottom: 16,
    borderRadius: 8,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  listContainer: {
    gap: 10,
    paddingHorizontal: 20,
    height: '100%',
  },
});
