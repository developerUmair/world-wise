import React from "react";
import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

const CityList = () => {
  const { cities, loading } = useCities();

  if (loading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on the city on the map" />
    );
  return (
    <ul className={styles.cityList}>
      {cities?.map((city, index) => (
        <CityItem city={city} key={index} />
      ))}
    </ul>
  );
};

export default CityList;
