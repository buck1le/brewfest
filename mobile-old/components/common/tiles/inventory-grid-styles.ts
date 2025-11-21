import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  inventoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 5,
    gap: 10, // Adds spacing between items  
    marginBottom: 30
  },
  tileContainer: {
    width: '33%'
  }
});

export { styles };
