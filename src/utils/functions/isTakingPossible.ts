import { Board } from "../../types/board";
import { Checker } from "../../types/checker";
import { Coordinates } from "../../types/coordinates";

export function isTakingPossible(
  turn: "white" | "black" | null,
  board: Board,
  checkers: Checker[]
): Coordinates[] {
  if (!turn) return [];

  const directions = [
    { row: 1, cell: 1 },
    { row: 1, cell: -1 },
    { row: -1, cell: 1 },
    { row: -1, cell: -1 },
  ];

  const isValidMove = (row: number, cell: number) =>
    row >= 0 && cell >= 0 && row < board.length && cell < board[row].length;

  const res: Coordinates[] = [];

  checkers.forEach((checker) => {
    if (checker.color !== turn || checker.isQueen) return;

    directions.forEach((dir) => {
      const nearRow = checker.coordinates.row + dir.row;
      const nearCell = checker.coordinates.cell + dir.cell;
      const jumpRow = nearRow + dir.row;
      const jumpCell = nearCell + dir.cell;

      if (
        isValidMove(nearRow, nearCell) &&
        isValidMove(jumpRow, jumpCell) &&
        board[nearRow][nearCell] &&
        !board[nearRow][nearCell].isEmpty
      ) {
        const nearChecker = checkers.find(
          (elem) =>
            elem.coordinates.row === nearRow &&
            elem.coordinates.cell === nearCell
        );

        if (nearChecker && nearChecker.color !== checker.color) {
          if (board[jumpRow][jumpCell]?.isEmpty) {
            res.push({ row: jumpRow, cell: jumpCell, id: nearChecker.id });
          }
        }
      }
    });
  });

  return res;
}

export function isDoubleTakingPossible(
  turn: "white" | "black" | null,
  board: Board,
  checkers: Checker[],
  id: number
): Coordinates[] {
  if (!turn) return [];
  const checker = checkers.find((elem) => elem.id === id);
  if (!checker) return [];
  const directions = [
    { row: 1, cell: 1 },
    { row: 1, cell: -1 },
    { row: -1, cell: 1 },
    { row: -1, cell: -1 },
  ];

  const isValidMove = (row: number, cell: number) =>
    row >= 0 && cell >= 0 && row < board.length && cell < board[row].length;

  const res: Coordinates[] = [];

  if (checker.color !== turn) return [];

  directions.forEach((dir) => {
    const nearRow = checker.coordinates.row + dir.row;
    const nearCell = checker.coordinates.cell + dir.cell;
    const jumpRow = nearRow + dir.row;
    const jumpCell = nearCell + dir.cell;

    if (
      isValidMove(nearRow, nearCell) &&
      isValidMove(jumpRow, jumpCell) &&
      board[nearRow][nearCell] &&
      !board[nearRow][nearCell].isEmpty
    ) {
      const nearChecker = checkers.find(
        (elem) =>
          elem.coordinates.row === nearRow && elem.coordinates.cell === nearCell
      );

      if (nearChecker && nearChecker.color !== checker.color) {
        if (board[jumpRow][jumpCell]?.isEmpty) {
          res.push({ row: jumpRow, cell: jumpCell, id: nearChecker.id });
        }
      }
    }
  });

  return res;
}

export function isQueenTakingPossible(
  turn: "white" | "black" | null,
  board: Board,
  checkers: Checker[],
  currentCheckerId?: number
): Coordinates[] {
  if (!turn) return [];

  const directions = [
    { row: 1, cell: 1 },
    { row: 1, cell: -1 },
    { row: -1, cell: 1 },
    { row: -1, cell: -1 },
  ];

  const isValidMove = (row: number, cell: number) =>
    row >= 0 && cell >= 0 && row < board.length && cell < board[row].length;

  const result: Coordinates[] = [];
  const startingChecker = currentCheckerId
    ? checkers.find((c) => c.id === currentCheckerId)
    : null;

  const candidates = startingChecker ? [startingChecker] : checkers;

  candidates.forEach((checker) => {
    if (checker.color !== turn) return;

    directions.forEach((dir) => {
      let currentRow = checker.coordinates.row;
      let currentCell = checker.coordinates.cell;

      let jumpedChecker: Checker | null = null;
      let moveCount = 0;

      while (true) {
        const nextRow = currentRow + dir.row;
        const nextCell = currentCell + dir.cell;

        if (!isValidMove(nextRow, nextCell)) break;

        const occupiedChecker = checkers.find(
          (elem) =>
            elem.coordinates.row === nextRow &&
            elem.coordinates.cell === nextCell
        );

        if (occupiedChecker) {
          // If it's the same color, stop searching
          if (occupiedChecker.color === checker.color) break;

          // Only one piece can be jumped over
          if (jumpedChecker) break;

          jumpedChecker = occupiedChecker;
        } else {
          // If empty and a piece was jumped, record the capture
          if (jumpedChecker) {
            result.push({
              row: nextRow,
              cell: nextCell,
              id: jumpedChecker.id,
            });

            // If double-taking is possible, recursively check
            const nextCheckers = checkers.filter(
              (c) => c.id !== jumpedChecker?.id
            );
            const nextBoard = JSON.parse(JSON.stringify(board));
            nextBoard[jumpedChecker.coordinates.row][
              jumpedChecker.coordinates.cell
            ].isEmpty = true;

            const additionalMoves = isQueenTakingPossible(
              turn,
              nextBoard,
              nextCheckers,
              checker.id
            );
            result.push(...additionalMoves);

            // Stop further movement if it's a regular checker
            if (!checker.isQueen) break;
          }

          // Stop for regular checkers after the first step
          if (!checker.isQueen && moveCount > 0) break;
        }

        currentRow = nextRow;
        currentCell = nextCell;
        moveCount++;

        // Queens continue in the same direction; checkers do not
        if (!checker.isQueen) break;
      }
    });
  });

  return result;
}
