import { User } from "@/types/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
  user: User | null;
  mode: "seller" | "buyer";
  searching: boolean;
  updateUser: (user: User) => void;
  updateMode: (mode: "seller" | "buyer") => void;
  clearStore: () => void;
  setSearchState: (search: boolean) => void;
}
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      mode: "buyer",
      searching: false,
      updateUser: (user) => set({ user }),
      clearStore: () => set({ user: null }),
      updateMode: (mode) => set({ mode }),
      setSearchState: (search) => set({ searching: search }),
    }),
    { name: "userStore", storage: createJSONStorage(() => localStorage) }
  )
);
