import { createContext, useState, useEffect, useContext } from "react";

const CitiesContext = createContext();
const URL = "http://localhost:8000";

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch {
        alert("there was an error loading data..");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch {
      alert("there was an error loading data..");
    } finally {
      setIsLoading(false);
    }
  }
  async function createCity(city) {
    try {
      setIsLoading(true);
      const res = await fetch(`${URL}/cities/`, {
        method: "Post",
        body: JSON.stringify(city),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setCities((cities) => [...cities, data]);
    } catch {
      alert("there was an error loading data..");
    } finally {
      setIsLoading(false);
    }
  }
  async function delCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${URL}/cities/${id}`, {
        method: "delete",
      });

      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      alert("there was an error deleting the city..");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, currentCity, getCity, createCity, delCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CiiesContext was used outside the provider");
  return context;
}

export { CitiesProvider, useCities };
