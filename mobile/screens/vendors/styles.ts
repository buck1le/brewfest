import { StyleSheet } from "react-native";
import { colors } from "global_styles";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 80,
  },
  content: {
    flex: 1,
  }
});
