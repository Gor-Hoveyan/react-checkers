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
  handleMove: (id: number, top: number, left: number) => void;
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
                id: Math.floor(Math.random() * 100000),
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
                id: Math.floor(Math.random() * 100000),
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
      handleMove: (id, top, left) => {
        const res = structuredClone(get().checkers);
        const checker = res.find((checker) => checker.id === id);
        if (checker && !checker.isQueen) {
          if (
            ((Math.round(top / 50) === 1 && checker.color === "white") ||
              (Math.round(top / 50) === -1 && checker.color === "black")) &&
            (Math.round(left / 50) === 1 || Math.round(left / 50) === -1)
          ) {
            if (checker.color === "white") {
              checker.coordinats.row--;
            } else if (checker.color === "black") {
              checker.coordinats.row++;
            }
            if (Math.round(left / 50) === -1) {
              checker.coordinats.cell++;
            } else {
              checker.coordinats.cell--;
            }
          }
        }
        set({ checkers: res });
      },
    }))
  )
);

export default useGameStore;
