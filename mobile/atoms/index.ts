import { atom } from "jotai";

import { createResourceAtom } from "./resources";
import { ShowEvent } from "types/api-responses";

const selectedEventAtom = atom<ShowEvent | null>(null);

const modalVisableAtom= atom<boolean>(false);

export {
  createResourceAtom,
  selectedEventAtom,
  modalVisableAtom
};
