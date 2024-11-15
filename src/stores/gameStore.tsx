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
            res[row][cell] = { isEmpty: true, color: "white" };
            if ((row + cell) % 2 === 1) {
              res[row][cell].color = "black";
            }
          }
        }

        set({ board: res });

        // Creating white Checkers

        for (let row = 0; row < 3; row++) {
          for (let cell = 0; cell < 8; cell++) {
            if (get().board[row][cell].color === "black") {
              const boardClone = structuredClone(get().board);
              boardClone[row][cell].isEmpty = false;
              set({ board: boardClone });
              const checker: Checker = {
                color: "black",
                isQueen: false,
                id: Math.floor(Math.random() * 1000000),
                coordinats: {
                  row: row,
                  cell: cell,
                },
              };
              set({ checkers: [...get().checkers, checker] });
            }
          }
        }
        // Creating black checkers
        for (let row = 7; row > 4; row--) {
          for (let cell = 0; cell < 8; cell++) {
            if (get().board[row][cell].color === "black") {
              const boardClone = structuredClone(get().board);
              boardClone[row][cell].isEmpty = false;
              set({ board: boardClone });
              const checker: Checker = {
                color: "white",
                isQueen: false,
                id: Math.floor(Math.random() * 1000000),
                coordinats: {
                  row: row,
                  cell: cell,
                },
              };
              set({ checkers: [...get().checkers, checker] });
            }
          }
        }

        // Starting game
        set({ isOngoing: true });
        set({ turn: "white" });
      },
      handleMove: (id, top, left) => {
        const res = structuredClone(get().checkers);
        const checker = res.find((checker) => checker.id === id);
        // Changing checker's coordinats
        if (checker && !checker.isQueen) {
          if (
            ((Math.round(top / 50) === 1 && checker.color === "white") ||
              (Math.round(top / 50) === -1 && checker.color === "black")) &&
            (Math.round(left / 50) === 1 || Math.round(left / 50) === -1)
          ) {
            if (checker.color === "white") {
              if (
                get().board[checker.coordinats.row - 1][checker.coordinats.cell]
              ) {
                checker.coordinats.row--;
              }
            } else if (checker.color === "black") {
              if (
                get().board[checker.coordinats.row + 1][checker.coordinats.cell]
              ) {
                checker.coordinats.row++;
              }
            }
            if (Math.round(left / 50) === -1) {
              if (
                get().board[checker.coordinats.row][checker.coordinats.cell + 1]
              ) {
                checker.coordinats.cell++;
              }
            } else {
              if (
                get().board[checker.coordinats.row][checker.coordinats.cell - 1]
              ) {
                checker.coordinats.cell--;
              }
            }
          }
        }
        // Transforming into queen (if necessary)
        if (checker?.color === "white" && checker.coordinats.row === 0) {
          checker.isQueen = true;
        } else if (checker?.color === "black" && checker.coordinats.row === 7) {
          checker.isQueen = true;
        }

        // Updating game state

        if (
          checker &&
          get().board[checker.coordinats.row][checker.coordinats.cell].color ===
            "black" &&
          get().board[checker.coordinats.row][checker.coordinats.cell]
            .isEmpty &&
          get().turn === checker.color
        ) {
          const boardClone = structuredClone(get().board);
          boardClone[checker.coordinats.row][checker.coordinats.cell].isEmpty =
            false;
          const unmodifiedChecker = get().checkers.find(
            (item) => item.id === checker.id
          );
          if (unmodifiedChecker) {
            boardClone[unmodifiedChecker.coordinats.row][
              unmodifiedChecker.coordinats.cell
            ].isEmpty = true;
          }
          set({ checkers: res });
          set({ board: boardClone });

          // Changing turn

          if (checker.color === "white") {
            set({ turn: "black" });
          } else {
            set({ turn: "white" });
          }
        }
      },
    }))
  )
);

export default useGameStore;
