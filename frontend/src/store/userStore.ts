import { User } from "@/types/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
  user: User | null;
  mode: "seller" | "buyer";
  updateUser: (user: User) => void;
  updateMode: (mode: "seller" | "buyer") => void;
  clearStore: () => void;
}
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      mode: "buyer",
      updateUser: (user) => set({ user }),
      clearStore: () => set({ user: null }),
      updateMode: (mode) => set({ mode }),
    }),
    { name: "userStore", storage: createJSONStorage(() => localStorage) }
  )
);
