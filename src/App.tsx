import styles from "./App.module.scss";
import Board from "./components/board/Board";
import GameControls from "./components/gameControls/GameControls";

function App() {
  return (
    <main className={styles.main}>
      <GameControls />
      <Board />
    </main>
  );
}

export default App;
