import { create } from "zustand";

type UiState = {
  preloaderDone: boolean;
  setPreloaderDone: (done: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  preloaderDone: false,
  setPreloaderDone: (done) => set({ preloaderDone: done }),
}));
