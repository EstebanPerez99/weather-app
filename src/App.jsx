import React, { useEffect, useState } from "react";
import "./App.css";

const API = (zipcode) => {
  return `http://api.weatherapi.com/v1/forecast.json?key=7aaaaa82d82048fe9d2175553220405&q=${zipcode}&days=10&aqi=no&alerts=no`;
};

const ZIP_CHECK = 5;

export default function App() {
  const [zipCode, setZipCode] = useState("94040");
  const [weatherData, setWeatherData] = useState(null);
  const [avgMinTemp, setAvgMinTemp] = useState(null);
  const [avgMaxTemp, setAvgMaxTemp] = useState(null);

  useEffect(() => {
    console.log(weatherData);
  }, [weatherData]);

  const avg = (arrayOfDays, key) => {
    const values = arrayOfDays.map((item) => {
      return item.day[key];
    });
    let avarage = 0;
    values.forEach((item) => {
      avarage += item;
    });
    return avarage / values.length;
  };

  const apiCall = (url) => {
    fetch(url).then(async (response) => {
      const info = await response.json();
      setWeatherData(info);
      const avarageMinT = avg(info.forecast.forecastday, "mintemp_f");
      const avarageMaxT = avg(info.forecast.forecastday, "maxtemp_f");
      setAvgMinTemp(avarageMinT);
      setAvgMaxTemp(avarageMaxT);
    });
  };

  useEffect(() => {
    const stringApi = API(zipCode);
    apiCall(stringApi);
  }, []);

  const onChangeZipcode = (e) => {
    setZipCode(e.target.value);
    if (e.target.value.length === ZIP_CHECK) {
      apiCall(API(e.target.value));
    }
  };

  return (
    <div>
      <input type="text" onChange={onChangeZipcode} />
      <p>average Max Temp: {avgMaxTemp}</p>
      <p>average Min Temp: {avgMinTemp}</p>
      <table>
        <tr>
          <th>Day</th>
          <th>Humidity</th>
          <th>Max temp</th>
          <th>Min temp</th>
        </tr>
        {weatherData?.forecast?.forecastday.map((item) => (
          <tr key={item.date}>
            <td>{item.date}</td>
            <td>{item.day.avghumidity}</td>
            <td>{item.day.maxtemp_f}</td>
            <td>{item.day.mintemp_f}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
