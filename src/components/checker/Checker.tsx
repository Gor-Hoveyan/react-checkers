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
  const handleDraggedChecker = useGameStore(
    (state) => state.handleDraggedChecker
  );

  function onDrag(id: number) {
    handleDraggedChecker(id);
  }
  return (
    <>
      {checker && (
        <span
          draggable={true}
          onDrag={() => onDrag(checker.id)}
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
