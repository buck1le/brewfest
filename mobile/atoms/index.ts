import { atom } from "jotai";

import { createResourceAtom } from "./resources";
import { EventResource } from "types/api-responses";

const selectedEventAtom = atom<EventResource | null>(null);

export {
  createResourceAtom,
  selectedEventAtom
};
