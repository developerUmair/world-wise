import { useEffect, useState } from "react";
import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

const getCountryCodeFromEmoji = (emoji) =>
  Array.from(emoji)
    .map((char) => String.fromCodePoint(char.codePointAt(0) - 0x1f1e6 + 65))
    .join("");

const CityItem = ({ city }) => {
  const { cityName, emoji, date } = city;
  const [flagUrl, setFlagUrl] = useState("");

  useEffect(() => {
    async function fetchFlag() {
      try {
        const countryCode = getCountryCodeFromEmoji(emoji); // Convert emoji to country code
        const response = await fetch(
          `https://restcountries.com/v3.1/alpha/${countryCode}`
        );
        if (!response.ok) throw new Error("Failed to fetch flag");
        const data = await response.json();
        const flag = data[0]?.flags?.svg || ""; 
        setFlagUrl(flag); 
      } catch (error) {
        console.error("Error fetching flag:", error);
      }
    }

    fetchFlag(); // Call the fetch function
  }, [emoji]);

  return (
    <Link className={styles.cityItem} to={`cities/${city.id}`}>
      <span className={styles.emoji}>
        {flagUrl ? (
          <img
            src={flagUrl}
            className={styles.emoji}
            alt={`${cityName} flag`}
          />
        ) : (
          emoji
        )}
      </span>
      <h3 className={styles.name}>{cityName}</h3>
      <time className={styles.date}>({formatDate(date)})</time>
      <button className={styles.deleteBtn}>&times;</button>
    </Link>
  );
};

export default CityItem;
