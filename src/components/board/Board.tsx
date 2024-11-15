import styles from "./Board.module.scss";
import useGameStore from "../../stores/gameStore";
import { useEffect } from "react";
import Checker from "../checker/Checker";
import { Checker as CheckerType } from "../../types/checker";
import isMovePossible from "../../utils/functions/isMovePossible";

export default function Board() {
  const board = useGameStore((state) => state.board);
  const startGame = useGameStore((state) => state.startGame);
  const checkers = useGameStore((state) => state.checkers);
  const draggedChecker = useGameStore((state) => state.draggedChecker);
  const handleMove = useGameStore((state) => state.handleMove);
  const turn = useGameStore((state) => state.turn);
  const choosenCell = useGameStore((state) => state.choosenCell);
  const handleChoosenCell = useGameStore((state) => state.handleChoosenCell);

  useEffect(() => {
    startGame();
  }, []);

  function findChecker(row: number, cell: number): CheckerType | undefined {
    return checkers.find(
      (checker) =>
        checker.coordinats.row === row && checker.coordinats.cell === cell
    );
  }

  function onDragOver(
    e: React.DragEvent<HTMLSpanElement>,
    row: number,
    cell: number
  ) {
    const checker = checkers.find((elem) => elem.id === draggedChecker);
    if (choosenCell.row !== row && choosenCell.cell !== cell) {
      handleChoosenCell(row, cell);
    }
    if (
      checker &&
      isMovePossible(checker, row, cell, turn, board) &&
      turn === checker.color
    ) {
      e.currentTarget.style.backgroundColor = "green";
    } else {
      e.currentTarget.style.backgroundColor = "red";
    }
  }
  function onDragLeave(
    e: React.DragEvent<HTMLSpanElement>,
    color: "white" | "black"
  ) {
    if (color === "black") {
      e.currentTarget.style.backgroundColor = "rgb(122, 58, 12)";
    } else if (color === "white") {
      e.currentTarget.style.backgroundColor = "rgb(194, 131, 87)";
    }
  }

  function onDragEnd() {
    const checker = checkers.find((elem) => elem.id === draggedChecker);
    if (choosenCell.row && choosenCell.cell) {
      if (
        checker &&
        isMovePossible(checker, choosenCell.row, choosenCell.cell, turn, board)
      ) {
        handleMove(checker.id, choosenCell.row, choosenCell.cell);
      }
    }
  }

  return (
    <section className={styles.table}>
      {board
        ? board.map((row, rowIndex) => {
            return (
              <section key={rowIndex} className={styles.row}>
                {row.map((cell, cellIndex) => {
                  return (
                    <span
                      className={`${
                        cell.color === "black"
                          ? styles.blackCell
                          : styles.whiteCell
                      } ${styles.cell}`}
                      key={cellIndex}
                      onDragOver={(e) => onDragOver(e, rowIndex, cellIndex)}
                      onDragLeave={(e) => onDragLeave(e, cell.color)}
                      onDragEnd={() => onDragEnd()}
                    >
                      {findChecker(rowIndex, cellIndex) ? (
                        <Checker checker={findChecker(rowIndex, cellIndex)} />
                      ) : (
                        ""
                      )}
                    </span>
                  );
                })}
              </section>
            );
          })
        : ""}
    </section>
  );
}
