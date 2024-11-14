import styles from "./Board.module.scss";
import useGameStore from "../../stores/gameStore";
import { useEffect } from "react";

export default function Board() {
  const board = useGameStore((state) => state.board);
  const startGame = useGameStore((state) => state.startGame);
  const checkers = useGameStore((state) => state.checkers);
  useEffect(() => {
    startGame();
  }, []);

  function findChecker(row: number, cell: number) {
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
                        <span
                          className={`${styles.checker} ${
                            findChecker(rowIndex, cellIndex)?.color === "black"
                              ? styles.blackChecker
                              : styles.whiteChecker
                          }`}
                        >
                          <span className={styles.checkerLine}></span>
                        </span>
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
