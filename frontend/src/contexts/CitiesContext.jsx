import { createContext, useContext, useEffect, useReducer } from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  loading: false,
  currentCity: {},
  error: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        loading: true,
      };
    case "cities/fetched":
      return {
        ...state,
        cities: action.payload,
        loading: false,
      };

    case "city/fetched":
      return {
        ...state,
        currentCity: action.payload,
        loading: false,
      };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        loading: false,
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        loading: false,
        currentCity: {},
      };

    case "rejected":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, loading, currentCity, error } = state;

  const getCountryCodeFromEmoji = (emoji) =>
    Array.from(emoji)
      .map((char) => String.fromCodePoint(char.codePointAt(0) - 0x1f1e6 + 65))
      .join("");

  async function fetchCities() {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`);
      const data = await res.json();

      // Fetch flag URLs for all cities
      const citiesWithFlags = await Promise.all(
        data.map(async (city) => {
          const flagUrl = await fetchFlagUrl(city.emoji);
          return { ...city, flagUrl };
        })
      );
      dispatch({
        type: "cities/fetched",
        payload: citiesWithFlags,
      });
      // setCities(citiesWithFlags);
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "Something went wrong in fetching data",
      });
    }
  }

  async function getCity(id) {
    if(id === currentCity.id) return;

    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      const flagUrl = await fetchFlagUrl(data.emoji);
      dispatch({
        type: "city/fetched",
        payload: { ...data, flagUrl },
      });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "Something went wrong in fetching city",
      });
    }
  }

  async function createCity(city) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(city),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({
        type: "city/created",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "Something went wrong in creating city",
      });
    }
  }
  async function deleteCity(cityId) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${cityId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to delete city");
      dispatch({
        type: "city/deleted",
        payload: cityId,
      });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: "Something went wrong in deleting data",
      });
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
    <CitiesContext.Provider
      value={{ cities, loading, getCity, currentCity, createCity, deleteCity, error }}
    >
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
