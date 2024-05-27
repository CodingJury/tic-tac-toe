import { atom } from "recoil";

export const socketAtom = atom({
  key: "socketAtom",
  default: null as WebSocket | null
})

export const usernameAtom = atom({
  key: "usernameAtom",
  default: "" as string
})

export const gameAtom = atom({
  key: "gameAtom",
  default: {
    piece: null as "X" | "O" | null,
    board: ["","","","","","","","",""] as string[],
    start: false,
    wonBy: null as "X" | "O" | null
  }
})