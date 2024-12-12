import React from "react";
import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import Spinner from "./Spinner";
import Message from "./Message";

const CityList = ({ cities, loading }) => {
  if (loading) return <Spinner />;

  if(!cities.length) return <Message message='Add your first city by clicking on the city on the map' />
  return (
    <ul className={styles.cityList}>
      {cities?.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
};

export default CityList;
