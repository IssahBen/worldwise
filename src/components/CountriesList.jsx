import CountryItem from "./CountryItem";
import styles from "./CountriesList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../context/CitiesContext";
function CountriesList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);

  if (!cities.length)
    return (
      <Message message="Add Your first city by clicking on  a city on the map" />
    );
  return (
    <ul className={styles.countriesList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountriesList;
