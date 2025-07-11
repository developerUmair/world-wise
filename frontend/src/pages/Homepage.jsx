import { Link, useNavigate } from "react-router-dom";
import styles from "./Homepage.module.css";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/FakeAuthContext";

export default function Homepage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (isAuthenticated) {
      navigate("/app");
      return;
    }
    navigate("/login");
  };
  return (
    <main className={styles.homepage}>
      <Navbar />
      <section>
        <h1>
          You travel the world.
          <br />
          WorldWise keeps track of your adventures.
        </h1>
        <h2>
          A world map that tracks your footsteps into every city you can think
          of. Never forget your wonderful experiences, and show your friends how
          you have wandered the world.
        </h2>
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate();
          }}
          className="cta"
        >
          Start tracking now
        </Link>
      </section>
    </main>
  );
}
