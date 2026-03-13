import { create } from "zustand";
import type { Element } from "../models/element";
import { useHistoryStore } from "./historyStore";

type BoardState = {
  elements: Element[];

  addElement: (element: Element) => void;
  setElements: (elements: Element[]) => void;

  undo: () => void;
  redo: () => void;
};

export const useBoardStore = create<BoardState>((set, get) => ({
  elements: [],

  addElement: (element) => {
    const elements = [...get().elements, element];

    useHistoryStore.getState().push(get().elements);

    set({ elements });
  },

  setElements: (elements) => set({ elements }),

  undo: () => {
    const current = get().elements;

    const previous = useHistoryStore.getState().undo(current);

    if (previous) {
      set({ elements: previous });
    }
  },

  redo: () => {
    const current = get().elements;

    const next = useHistoryStore.getState().redo(current);

    if (next) {
      set({ elements: next });
    }
  },
}));
