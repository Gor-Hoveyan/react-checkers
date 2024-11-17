import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Board } from "../types/board";
import { Checker } from "../types/checker";
import { Coordinates } from "../types/coordinates";

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
  mustTake: Coordinates[] | null;
  handleMode: (mode: "easy" | "medium" | "hard" | null) => void;
  handleIsOngoing: (isOngoing: boolean) => void;
  handleTurn: (turn: "white" | "black" | null) => void;
  startGame: () => void;
  handleMove: (id: number, row: number, cell: number) => void;
  handleTake: (id: number, row: number, cell: number) => void;
  handleDraggedChecker: (id: number | null) => void;
  handleChoosenCell: (row: number, cell: number) => void;
  handleMustTake: (coordinates: Coordinates[] | null) => void;
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
      mustTake: null,
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
            res[row][cell] = {
              isEmpty: true,
              color: "white",
              isHighlighted: false,
            };
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
                coordinates: {
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
                coordinates: {
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
        if (!get().mustTake?.length) {
          const res = structuredClone(get().checkers);
          const checker = res.find((checker) => checker.id === id);
          if (checker) {
            const boardClone = structuredClone(get().board);
            boardClone[checker.coordinates.row][
              checker.coordinates.cell
            ].isEmpty = true;
            boardClone[row][cell].isEmpty = false;
            checker.coordinates.row = row;
            checker.coordinates.cell = cell;

            // Update game state

            set({ checkers: res });
            set({ board: boardClone });
            set({ draggedChecker: null });

            // Changing turn

            if (checker.color === "white") {
              set({ turn: "black" });
            } else {
              set({ turn: "white" });
            }
          }

          // Transforming into queen (if necessary)
          if (checker?.color === "white" && checker.coordinates.row === 0) {
            checker.isQueen = true;
          } else if (
            checker?.color === "black" &&
            checker.coordinates.row === 7
          ) {
            checker.isQueen = true;
          }
        }
      },
      handleTake: (id, row, cell) => {
        let checkersClone = structuredClone(get().checkers);
        const boardClone = structuredClone(get().board);
        let mustTakeClone = structuredClone(get().mustTake);
        const checker = checkersClone.find((elem) => elem.id === id);
        const coordinates = mustTakeClone?.find(
          (elem) => elem.row === row && elem.cell === cell
        );
        if (coordinates.id && checker) {
          const takenChecker = checkersClone.find(
            (elem) => elem.id === coordinates.id
          );
          if (takenChecker) {
            boardClone[takenChecker.coordinates.row][
              takenChecker.coordinates.cell
            ].isEmpty = true;
            boardClone[checker.coordinates.row][
              checker.coordinates.cell
            ].isEmpty = true;
            boardClone[row][cell].isEmpty = false;
            checkersClone = checkersClone.filter(
              (elem) => elem.id !== coordinates.id
            );
            checker.coordinates.row = row;
            checker.coordinates.cell = cell;

            mustTakeClone?.map((coord) => {
              boardClone[coord.row][coord.cell].isHighlighted = false;
              console.log(boardClone[coord.row][coord.cell].isHighlighted);
            });

            set({ board: boardClone });
            set({ checkers: checkersClone });
            set({ mustTake: null });
            if (get().turn === "black") {
              set({ turn: "white" });
            } else {
              set({ turn: "black" });
            }
          }
        }
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
      handleMustTake: (coordinates) => {
        set({ mustTake: coordinates });
        const boardClone = structuredClone(get().board);
        coordinates?.map((coord) => {
          boardClone[coord.row][coord.cell].isHighlighted = true;
        });
        set({ board: boardClone });
      },
    }))
  )
);

export default useGameStore;
