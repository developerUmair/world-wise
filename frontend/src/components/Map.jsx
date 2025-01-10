import React from "react";
import styles from "./Map.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const Map = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const lat = searchParams.get("lat") || "0";
  const lng = searchParams.get("lng") || "0";

  const navigate = useNavigate();
  return (
    <div
      className={styles.mapContainer}
      onClick={() => navigate("form")}
    >
      <h1>Map</h1>
      <h2>
        Position: {lat}, {lng}
      </h2>
      <button
        onClick={(event) => {
          // event.stopPropagation();
          setSearchParams({ lat: "222", lng: "1111" });
        }}
      >
        Change Position
      </button>
    </div>
  );
};

export default Map;
