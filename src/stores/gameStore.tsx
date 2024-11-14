import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Board } from "../types/board";
import { Checker } from "../types/checker";

interface IStore {
  mode: "easy" | "medium" | "hard" | null;
  isOngoing: boolean;
  board: Board;
  checkers: Checker[];
  turn: "white" | "black" | null;
  handleMode: (mode: "easy" | "medium" | "hard" | null) => void;
  handleIsOngoing: (isOngoing: boolean) => void;
  handleTurn: (turn: "white" | "black" | null) => void;
  startGame: () => void;
}

const useGameStore = create<IStore>()(
  devtools(
    immer((set, get) => ({
      mode: null,
      isOngoing: false,
      board: [[]],
      checkers: [],
      turn: null,
      handleMode: (mode) => {
        set({ mode: mode });
      },
      handleIsOngoing: (isOngoing) => {
        set({ isOngoing: isOngoing });
      },
      handleTurn: (turn) => {
        set({ turn: turn });
      },
      startGame: () => {
        // Creating board
        const res: Board = [];
        for (let row = 0; row < 8; row++) {
          res[row] = [];
          for (let cell = 0; cell < 8; cell++) {
            if ((row + cell) % 2 === 1) {
              res[row][cell] = "black";
            } else {
              res[row][cell] = "white";
            }
          }
        }
        set({ board: res });

        // Creating Checkers

        for (let row = 0; row < 3; row++) {
          for (let cell = 0; cell < 8; cell++) {
            if (get().board[row][cell] === "black") {
              const checker: Checker = {
                color: "black",
                isQueen: false,
                coordinats: {
                  row: row,
                  cell: cell,
                },
              };
              set({ checkers: [...get().checkers, checker] });
            }
          }
        }
        for (let row = 7; row > 4; row--) {
          for (let cell = 0; cell < 8; cell++) {
            if (get().board[row][cell] === "black") {
              const checker: Checker = {
                color: "white",
                isQueen: false,
                coordinats: {
                  row: row,
                  cell: cell,
                },
              };
              set({ checkers: [...get().checkers, checker] });
            }
          }
        }
      },
    }))
  )
);

export default useGameStore;
