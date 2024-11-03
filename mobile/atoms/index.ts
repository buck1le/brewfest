import { atom } from "jotai";

import { createResourceAtom } from "./resources";
import { Event } from "types/api-responses";

const selectedEventAtom = atom<Event | null>(null);

export {
  createResourceAtom,
  selectedEventAtom
};
