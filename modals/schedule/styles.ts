import { StyleSheet, Dimensions } from "react-native";
import { colors } from "global_styles";

const viewPortWidth = Dimensions.get('window').width;
const viewPortHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.primary,
  },
  pager: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    height: 300,
    marginBottom: 16,
    borderRadius: 8,
  },
});
