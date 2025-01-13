import { selectedEventAtom } from "atoms/index";
import { useAtom, useAtomValue } from "jotai";
import { SafeAreaView, Text } from "react-native";
import { useBrewsAtom } from "./atoms";

const Brews = () => {
  const selectedEvent = useAtomValue(selectedEventAtom);

  if (!selectedEvent) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Please select an event</Text>
      </SafeAreaView>
    )
  }

  const brewsAtom = useBrewsAtom(selectedEvent.resources.brews.href);
  const brews = useAtom(brewsAtom);
}
