import { atom } from "jotai";

import { createResourceAtom } from "./resources";
import { Event } from "types/api-responses";

const selectedEventAtom = atom<Event | null>(null);

const modalVisableAtom= atom<boolean>(false);

export {
  createResourceAtom,
  selectedEventAtom,
  modalVisableAtom
};
