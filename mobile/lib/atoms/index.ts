import { atom } from "jotai";
import { Event } from "types/api-responses";

const selectedEventAtom = atom<Event | null>(null);

export {
  selectedEventAtom,
};
