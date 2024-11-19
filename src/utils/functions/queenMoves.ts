import { Board } from "../../types/board";
import { Checker } from "../../types/checker";
import { Coordinates } from "../../types/coordinates";

export default function getPossibleMoves(
  checker: Checker,
  turn: "white" | "black" | null,
  board: Board
): Omit<Coordinates, "id">[] {
  const res: Omit<Coordinates, "id">[] = [];
  if (turn !== checker.color || !checker.isQueen) {
    return [];
  }

  // Directions: top-left, top-right, bottom-left, bottom-right
  const directions = [
    { row: -1, cell: -1 },
    { row: -1, cell: 1 },
    { row: 1, cell: -1 },
    { row: 1, cell: 1 },
  ];

  for (const dir of directions) {
    let row = checker.coordinates.row;
    let cell = checker.coordinates.cell;

    while (true) {
      row += dir.row;
      cell += dir.cell;

      // Check bounds
      if (
        row < 0 ||
        row >= board.length ||
        cell < 0 ||
        cell >= board[0].length
      ) {
        break;
      }

      // Check if the square is empty
      const square = board[row][cell];
      if (square.isEmpty) {
        res.push({ row, cell });
      } else {
        break;
      }
    }
  }

  return res;
}
