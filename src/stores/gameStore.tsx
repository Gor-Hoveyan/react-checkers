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
  draggedChecker: number | null;
  choosenCell: {
    row: number | null;
    cell: number | null;
  };
  handleMode: (mode: "easy" | "medium" | "hard" | null) => void;
  handleIsOngoing: (isOngoing: boolean) => void;
  handleTurn: (turn: "white" | "black" | null) => void;
  startGame: () => void;
  handleMove: (id: number, row: number, cell: number) => void;
  handleDraggedChecker: (id: number | null) => void;
  handleChoosenCell: (row: number, cell: number) => void;
}

const useGameStore = create<IStore>()(
  devtools(
    immer((set, get) => ({
      mode: null,
      isOngoing: false,
      board: [[]],
      checkers: [],
      turn: null,
      draggedChecker: null,
      choosenCell: { row: null, cell: null },
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
      handleMove: (id, row, cell) => {
        const res = structuredClone(get().checkers);
        const checker = res.find((checker) => checker.id === id);
        if (checker) {
          const boardClone = structuredClone(get().board);
          boardClone[checker.coordinats.row][checker.coordinats.cell].isEmpty =
            true;
          checker.coordinats.row = row;
          checker.coordinats.cell = cell;

          set({ checkers: res });
          set({ board: boardClone });

          // Changing turn

          if (checker.color === "white") {
            set({ turn: "black" });
          } else {
            set({ turn: "white" });
          }
        }

        // Transforming into queen (if necessary)
        if (checker?.color === "white" && checker.coordinats.row === 0) {
          checker.isQueen = true;
        } else if (checker?.color === "black" && checker.coordinats.row === 7) {
          checker.isQueen = true;
        }

        // Updating game state
      },
      handleDraggedChecker: (id) => {
        if (id) {
          set({ draggedChecker: id });
        } else {
          set({ draggedChecker: null });
        }
      },
      handleChoosenCell: (row, cell) => {
        if (row >= 0 && cell >= 0) {
          set({
            choosenCell: {
              row,
              cell,
            },
          });
        }
      },
    }))
  )
);

export default useGameStore;
