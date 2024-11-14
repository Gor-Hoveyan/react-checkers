import useGameStore from "../../stores/gameStore";
import { Checker as CheckerType } from "../../types/checker";
import styles from "./Checker.module.scss";

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
          <span className={styles.checkerLine}></span>
        </span>
      )}
    </>
  );
}
