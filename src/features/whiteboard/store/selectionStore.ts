import { create } from "zustand";

type SelectionState = {
  selectedIds: string[];
  setSelection: (ids: string[]) => void;
  addToSelection: (id: string) => void;
  clearSelection: () => void;
};

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedIds: [],

  setSelection: (ids) => set({ selectedIds: ids }),

  addToSelection: (id) =>
    set((state) => ({
      selectedIds: [...state.selectedIds, id],
    })),

  clearSelection: () => set({ selectedIds: [] }),
}));