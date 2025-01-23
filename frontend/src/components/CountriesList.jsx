import React from "react";
import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

const CountryList = () => {
  const { cities, loading } = useCities();

  if (loading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on the city on the map" />
    );

  const countries = cities.reduce(
    (arr, city) =>
      arr.some((el) => el.country === city.country)
        ? arr
        : [...arr, { country: city.country, emoji: city.emoji, flagUrl: city.flagUrl }],
    []
  );

  console.log(countries);

  return (
    <ul className={styles.countryList}>
      {countries?.map((country) => (
        <CountryItem country={country} key={country} />
      ))}
    </ul>
  );
};

export default CountryList;
