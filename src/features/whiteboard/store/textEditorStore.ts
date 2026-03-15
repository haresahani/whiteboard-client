import { create } from "zustand";

type TextEditorState = {
  isEditing: boolean;
  x: number;
  y: number;
  value: string;

  startEditing: (x: number, y: number, initial?: string) => void;
  stopEditing: () => void;
  setValue: (text: string) => void;
};

export const useTextEditorStore = create<TextEditorState>((set) => ({
  isEditing: false,
  x: 0,
  y: 0,
  value: "",

  startEditing: (x, y, initial = "") =>
    set({
      isEditing: true,
      x,
      y,
      value: initial,
    }),

  stopEditing: () =>
    set({
      isEditing: false,
      value: "",
    }),
  setValue: (text) => set({ value: text }),
}));
