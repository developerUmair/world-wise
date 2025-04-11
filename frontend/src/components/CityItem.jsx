import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";

const formatDate = (date) => 
  date 
    ? new Intl.DateTimeFormat("en", { 
        day: "numeric", 
        month: "long", 
        year: "numeric", 
      }).format(new Date(date))
    : null;



const CityItem = ({ city }) => {
  const { cityName, emoji, date, position, id, flagUrl } = city;
  const { currentCity } = useCities();

  console.log("cityItem", city);

  return (
    <li>
      <Link
        to={`${city.id}?lat=${position?.lat}&lng=${position?.lng}`}
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
      >
        <span className={styles.emoji}>
            <img
              src={flagUrl || emoji}
              className={styles.emoji}
              alt={`${cityName} flag`}
            />
          
        </span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button className={styles.deleteBtn}>&times;</button>
      </Link>
    </li>
  );
};

export default CityItem;
