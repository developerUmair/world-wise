import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([{}]);
  const [loading, setLoading] = useState(false);

  async function fetchCities() {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/cities`);
      const data = await res.json();
      setCities(data);
    } catch (error) {
      alert("Something went wrong in fetching data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCities();
  }, []);

  return (
    <CitiesContext.Provider value={{ cities, loading }}>
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
