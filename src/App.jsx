import { useState } from 'react'
import './App.css'
import NowWeather from './NowWeather'

const WEATHER_CODES = {
  0: 'Ясно',
  1: 'Преимущественно ясно',
  2: 'Переменная облачность',
  3: 'Пасмурно',
  45: 'Туман',
  48: 'Отлагающийся осаждающийся туман',
  51: 'Лёгкая морось',
  53: 'Умеренная морось',
  55: 'Плотная морось',
  61: 'Слабый дождь',
  63: 'Умеренный дождь',
  65: 'Сильный дождь',
  71: 'Слабый снег',
  73: 'Умеренный снег',
  75: 'Сильный снег',
  80: 'Слабый ливень',
  81: 'Умеренный ливень',
  82: 'Сильный ливень',
  95: 'Гроза',
};

function App() {

  function getWeatherCode(code){
    return WEATHER_CODES[code]
  }

  async function getNowWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=42.885&longitude=47.620&current=temperature_2m,apparent_temperature,weather_code&timezone=auto&_t=${Date.now()}`;

    const response = await fetch(url, { cache: 'no-store' });
    const data = await response.json();
    console.log(data)
  }
  getNowWeather()
  return (
    <>
      <header className="header">
        <div className="header__logo">
          <img src="" alt="logo" className="header__logo-img" />
        </div>
        <div className="header__search">
          <input
            type="text"
            name=""
            id=""
            className="header__search-input"
            placeholder="Поиск города"
          />
          <button className="header__search-button"></button>
        </div>
      </header>

      <main className="main">
        <div className="main__now-weather">
          <NowWeather />
        </div>
        <div className="main__next-time-weather"></div>
        <div className="main__next-day-weather"></div>
      </main>

    </>
  )
}

export default App
