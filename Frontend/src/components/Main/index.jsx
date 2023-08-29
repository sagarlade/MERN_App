import styles from "./styles.module.css";
import ScreenRecordingApp from "../ScreenRecording/index";
const Main = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>Recording</h1>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <ScreenRecordingApp />
    </div>
  );
};

export default Main;


