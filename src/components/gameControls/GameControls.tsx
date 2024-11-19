import styles from "./GameControls.module.scss";
import useGameStore from "../../stores/gameStore";

export default function GameControls() {
  const handleIsOngoing = useGameStore((state) => state.handleIsOngoing);
  const startGame = useGameStore((state) => state.startGame);
  const turn = useGameStore((state) => state.turn);

  function start() {
    startGame();
    handleIsOngoing(true);
  }
  return (
    <section className={styles.gameControls}>
      <button onClick={() => start()} className={styles.start}>
        Start/Restart
      </button>
      {turn ? (
        <section className={styles.turn}>
          <p>
            <span
              className={`${styles.checker} ${
                turn === "black" ? styles.blackChecker : styles.whiteChecker
              }`}
            >
              <span className={styles.checkerLine}></span>
            </span>{" "}
          </p>
        </section>
      ) : (
        ""
      )}
    </section>
  );
}
