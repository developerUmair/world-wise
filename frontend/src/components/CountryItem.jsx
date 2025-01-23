import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
  return (
    <li className={styles.countryItem}>
      {/* <span>{country.emoji}</span> */}
      <span>{country.flagUrl ? (
                <img
                  src={country?.flagUrl}
                  style={{ width: "4rem" }}
                  className={styles.emoji}
                  alt={`${country?.country} flag`}
                />
              ) : (
                country.emoji
              )}</span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
