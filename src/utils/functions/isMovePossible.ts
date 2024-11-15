import { Board } from "../../types/board";
import { Checker } from "../../types/checker";

export default function isMovePossible(
  checker: Checker,
  row: number,
  cell: number,
  turn: "white" | "black" | null,
  board: Board
): boolean {
  let res = false;
  if (
    !checker?.isQueen &&
    board[row][cell].isEmpty &&
    board[row][cell].color === "black" &&
    checker?.color === turn
  ) {
    if (
      checker?.color === "white" &&
      checker.coordinats.row - 1 === row &&
      (checker.coordinats.cell - 1 === cell ||
        checker.coordinats.cell + 1 === cell)
    ) {
      res = true;
    }
    if (
      checker?.color === "black" &&
      checker.coordinats.row + 1 === row &&
      (checker.coordinats.cell - 1 === cell ||
        checker.coordinats.cell + 1 === cell)
    ) {
      res = true;
    }
  }
  return res;
}
