// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const navigate = useNavigate()
  const { createCity, loading } = useCities();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [lat, lng] = useUrlPosition();
  const [cityLoading, setCityLoading] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [flag, setFlag] = useState(null);
  const [error, setError] = useState("");

  console.log(date && date.toLocaleDateString("en-US", { timeZone: "UTC" }));

  const fetchCity = async () => {
    if (!lat || !lng) return;
    try {
      setCityLoading(true);
      setError("");
      const response = await fetch(
        `${BASE_URL}?latitude=${lat}&longitude=${lng}`
      );

      const data = await response.json();

      if (!data.countryCode) {
        throw new Error(
          "That doesn't seem to city. Click somewhere else on the map.😉"
        );
      }
      setCityName(data.city || data.locality);
      setCountry(data.countryName);
      setEmoji(data.countryCode);
      console.log(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setCityLoading(false);
    }
  };

  async function fetchFlagUrl(countryCode) {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/alpha/${countryCode}`
      );
      if (!response.ok) throw new Error("Failed to fetch flag");

      const data = await response.json();
      setFlag(data[0]?.flags?.svg || "");
    } catch (error) {
      console.error("Error fetching flag:", error);
      return ""; // Return empty string in case of an error
    }
  }

  useEffect(() => {
    if (lat && lng) {
      fetchCity();
    }
  }, [lat, lng]);

  useEffect(() => {
    if (emoji) {
      fetchFlagUrl(emoji);
    }
  }, [emoji]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCity = {
      cityName,
      country,
      emoji: flag,
      date,
      notes,
      postition: {
        lat,
        lng,
      },
    };

    await createCity(newCity)
    navigate("/app/cities")
  };

  if (cityLoading) return <Spinner />;
  if (!lat || !lng) return <Message message="Click on the map to add a city" />;
  if (error) return <Message message={error} />;

  return (
  <form className={`${styles.form} ${loading ? styles.loading : ""}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <img src={flag} className={styles.flag} alt={`${cityName} flag`} />
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
