import useGameStore from "../../stores/gameStore";
import { Checker as CheckerType } from "../../types/checker";
import styles from "./Checker.module.scss";
import blackQueenUrl from "/src/assets/black-queen.svg?url";
import whiteQueenUrl from "/src/assets/white-queen.svg?url";

interface IProps {
  checker: CheckerType | undefined;
  /*rowIndex: number;
  cellIndex: number;*/
}

export default function Checker({ checker }: IProps) {
  const handleMove = useGameStore((state) => state.handleMove);
  function ondrop(e: React.DragEvent<HTMLSpanElement>) {
    const top = e.currentTarget.offsetTop - e.clientY + 20;
    const left = e.currentTarget.offsetLeft - e.clientX + 20;
    if (checker) {
      handleMove(checker.id, top, left);
    }
  }
  return (
    <>
      {checker && (
        <span
          draggable={true}
          onDragEnd={(e) => ondrop(e)}
          className={`${styles.checker} ${
            checker.color === "black"
              ? styles.blackChecker
              : styles.whiteChecker
          }`}
        >
          {checker.isQueen ? (
            checker.color === "black" ? (
              <img
                src={whiteQueenUrl}
                alt="Black Queen"
                className={styles.queenImg}
              />
            ) : (
              <img
                src={blackQueenUrl}
                alt="Black Queen"
                className={styles.queenImg}
              />
            )
          ) : (
            <span className={styles.checkerLine}></span>
          )}
        </span>
      )}
    </>
  );
}
