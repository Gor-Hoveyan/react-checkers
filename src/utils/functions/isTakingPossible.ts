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

  if (checker.color !== turn || checker.isQueen) return [];

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
