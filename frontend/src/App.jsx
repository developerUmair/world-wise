import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import AppLayout from "./pages/AppLayout";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import CountryList from "./components/CountriesList";

const BASE_URL = "http://localhost:8000";
const App = () => {
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
    const timer = setTimeout(() => {
      fetchCities();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="product" element={<Product />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="app" element={<AppLayout />}>
          <Route index element={<CityList cities={cities} loading={loading} />} />
          <Route path="cities" element={<CityList cities={cities} loading={loading} />} />
          <Route path="countries" element={<CountryList cities={cities} loading={loading} />} />
          <Route path="form" element={<h2>Form</h2>} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
