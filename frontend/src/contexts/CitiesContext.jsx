import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});
  const getCountryCodeFromEmoji = (emoji) =>
    Array.from(emoji)
      .map((char) => String.fromCodePoint(char.codePointAt(0) - 0x1f1e6 + 65))
      .join("");

  async function fetchCities() {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/cities`);
      const data = await res.json();

      // Fetch flag URLs for all cities
      const citiesWithFlags = await Promise.all(
        data.map(async (city) => {
          const flagUrl = await fetchFlagUrl(city.emoji);
          return { ...city, flagUrl };
        })
      );

      setCities(citiesWithFlags);
    } catch (error) {
      alert("Something went wrong in fetching data");
    } finally {
      setLoading(false);
    }
  }

  async function getCity(id) {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      const flagUrl = await fetchFlagUrl(data.emoji);
      setCurrentCity({ ...data, flagUrl });
    } catch (error) {
      alert("Something went wrong in fetching city");
    } finally {
      setLoading(false);
    }
  }

  async function createCity(city) {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(city),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setCities(prevCities => [...prevCities, data]);
    } catch (error) {
      alert("Something went wrong in fetching city");
    } finally {
      setLoading(false);
    }
  }
  async function deleteCity(cityId) {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${cityId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to delete city");
      setCities(prevCities => prevCities.filter(city => city.id !== cityId));
    } catch (error) {
      alert("Something went wrong in deleting city city");
    } finally {
      setLoading(false);
    }
  }

  async function fetchFlagUrl(emoji) {
    try {
      const countryCode = getCountryCodeFromEmoji(emoji); // Convert emoji to country code
      const response = await fetch(
        `https://restcountries.com/v3.1/alpha/${countryCode}`
      );
      if (!response.ok) throw new Error("Failed to fetch flag");
      const data = await response.json();
      return data[0]?.flags?.svg || "";
    } catch (error) {
      console.error("Error fetching flag:", error);
      return ""; // Return an empty string in case of an error
    }
  }

  useEffect(() => {
    fetchCities();
  }, []);

  return (
    <CitiesContext.Provider value={{ cities, loading, getCity, currentCity, createCity, deleteCity }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined)
    throw new Error("useCities must be used within a CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
