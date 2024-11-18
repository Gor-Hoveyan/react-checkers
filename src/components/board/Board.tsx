import styles from "./Board.module.scss";
import useGameStore from "../../stores/gameStore";
import { useEffect } from "react";
import Checker from "../checker/Checker";
import { Checker as CheckerType } from "../../types/checker";
import isMovePossible from "../../utils/functions/isMovePossible";
import { isTakingPossible } from "../../utils/functions/isTakingPossible";

export default function Board() {
  const board = useGameStore((state) => state.board);
  const startGame = useGameStore((state) => state.startGame);
  const checkers = useGameStore((state) => state.checkers);
  const draggedChecker = useGameStore((state) => state.draggedChecker);
  const handleMove = useGameStore((state) => state.handleMove);
  const turn = useGameStore((state) => state.turn);
  const choosenCell = useGameStore((state) => state.choosenCell);
  const handleChoosenCell = useGameStore((state) => state.handleChoosenCell);
  const handleMustTake = useGameStore((state) => state.handleMustTake);
  const mustTake = useGameStore((state) => state.mustTake);
  const handleTake = useGameStore((state) => state.handleTake);
  const handleTurn = useGameStore((state) => state.handleTurn);

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    handleMustTake(isTakingPossible(turn, board, checkers));
  }, [turn, checkers.length]);

  function findChecker(row: number, cell: number): CheckerType | undefined {
    return checkers.find(
      (checker) =>
        checker.coordinates.row === row && checker.coordinates.cell === cell
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
      row === checker?.coordinates.row &&
      cell === checker?.coordinates.cell
    ) {
      e.currentTarget.style.backgroundColor = "rgba(57, 128, 220)";
    } else if (
      checker &&
      isMovePossible(checker, row, cell, turn, board) &&
      turn === checker.color
    ) {
      e.currentTarget.style.backgroundColor = "rgba(0, 255, 0, 0.8)";
    } else {
      e.currentTarget.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
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

    if (choosenCell.row !== null && choosenCell.cell !== null && checker) {
      if (
        isMovePossible(
          checker,
          choosenCell.row,
          choosenCell.cell,
          turn,
          board
        ) &&
        !mustTake?.length
      ) {
        handleMove(checker.id, choosenCell.row, choosenCell.cell);
      } else {
        handleTake(checker?.id, choosenCell.row, choosenCell.cell);
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
                      } ${styles.cell} ${
                        cell.isHighlighted && styles.highlightedCell
                      }`}
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
