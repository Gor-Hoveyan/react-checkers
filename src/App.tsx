import styles from "./App.module.scss";
import Board from "./components/board/Board";

function App() {
  return (
    <main className={styles.main}>
      <Board />
    </main>
  );
}

export default App;
