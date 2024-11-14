import styles from "./Board.module.scss";
import useGameStore from "../../stores/gameStore";
import { useEffect } from "react";
import Checker from "../checker/Checker";
import { Checker as CheckerType } from "../../types/checker";

export default function Board() {
  const board = useGameStore((state) => state.board);
  const startGame = useGameStore((state) => state.startGame);
  const checkers = useGameStore((state) => state.checkers);
  useEffect(() => {
    startGame();
  }, []);

  function findChecker(row: number, cell: number): CheckerType | undefined {
    return checkers.find(
      (checker) =>
        checker.coordinats.row === row && checker.coordinats.cell === cell
    );
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
                        cell === "black" ? styles.blackCell : styles.whiteCell
                      } ${styles.cell}`}
                      key={cellIndex}
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
