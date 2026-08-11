import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import NowWeather from './NowWeather'
import { nanoid } from 'nanoid';

const WEATHER_CODES = {
  0: ['Ясно', './assets/day_icon/01d.svg', './assets/night_icon/01n.svg'],
  1: ['Преимущественно ясно', './assets/day_icon/02d.svg', './assets/night_icon/02n.svg'],
  2: ['Переменная облачность', './assets/day_icon/03d.svg', './assets/night_icon/03n.svg'],
  3: ['Пасмурно', './assets/day_icon/04d.svg', './assets/night_icon/04n.svg'],
  45: ['Туман', './assets/day_icon/50d.svg', './assets/night_icon/50n.svg'],
  48: ['Отлагающийся осаждающийся туман', './assets/day_icon/50d.svg', './assets/night_icon/50n.svg'],
  51: ['Лёгкая морось', './assets/day_icon/10d.svg', './assets/night_icon/10n.svg'],
  53: ['Умеренная морось', './assets/day_icon/10d.svg', './assets/night_icon/10n.svg'],
  55: ['Плотная морось', './assets/day_icon/09d.svg', './assets/night_icon/09n.svg'],
  61: ['Слабый дождь', './assets/day_icon/09d.svg', './assets/night_icon/09n.svg'],
  63: ['Умеренный дождь', './assets/day_icon/09d.svg', './assets/night_icon/09n.svg'],
  65: ['Сильный дождь', './assets/day_icon/09d.svg', './assets/night_icon/09n.svg'],
  71: ['Слабый снег', './assets/day_icon/13d.svg', './assets/night_icon/13n.svg'],
  73: ['Умеренный снег', './assets/day_icon/13d.svg', './assets/night_icon/13n.svg'],
  75: ['Сильный снег', './assets/day_icon/13d.svg', './assets/night_icon/13n.svg'],
  80: ['Слабый ливень', './assets/day_icon/09d.svg', './assets/night_icon/09n.svg'],
  81: ['Умеренный ливень', './assets/day_icon/09d.svg', './assets/night_icon/09n.svg'],
  82: ['Сильный ливень', './assets/day_icon/09d.svg', './assets/night_icon/09n.svg'],
  95: ['Гроза', './assets/day_icon/11d.svg', './assets/night_icon/11n.svg'],
};

if (!localStorage.getItem('cityName')) {
  const json = JSON.stringify({ lat: '42.885', lon: '47.620', name: 'Каспийск' })
  localStorage.setItem('cityName', json)
}
function App() {

  const [value, setValue] = useState('')
  const [local, setLocal] = useState({ lat: '', lon: '', name: '' })
  const [dataCity, setDataCity] = useState([])

  function getWeatherCode(code) {
    return WEATHER_CODES[code]
  }

  useEffect(() => {
    async function parseCity() {
      const respons = await fetch('/public/russian-cities.json')
      const data = await respons.json()
      setDataCity(data);
    }
    parseCity()

  }, [])

  function setCity() {
    if (localStorage.getItem('cityName') && local.lat != 0 && local.lon != 0) {
      const json = JSON.stringify({ lat: local.lat, lon: local.lon, name: local.name })
      localStorage.setItem('cityName', json)
    }
    setValue('')
  }


  function getWindDirectionName(degrees) {
    const directions = ['Северный (С)', 'Северо-Восточный (СВ)', 'Восточный (В)', 'Юго-Восточный (ЮВ)', 'Южный (Ю)', 'Юго-Западный (ЮЗ)', 'Западный (З)', 'Северо-Западный (СЗ)'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }



  // Получаем иконку погоды
  function getIcon(time, maxTime, minTime, code) {
    const codeIcon = getWeatherCode(code)
    if (minTime <= time && time <= maxTime) {
      return codeIcon[1]
    } else {
      return codeIcon[2]
    }
  }


  // Парсем данные текущей погоды
  const parseNowWeather = useCallback(async () => {
    const lat = JSON.parse(localStorage.getItem('cityName')).lat
    const lon = JSON.parse(localStorage.getItem('cityName')).lon
    const name = JSON.parse(localStorage.getItem('cityName')).name

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,weather_code&daily=sunrise,sunset&forecast_days=1&timezone=auto`;

    try {
      const response = await fetch(url, { cache: 'no-store' });
      const data = await response.json();

      const curr = data.current;
      const daily = data.daily;

      const weatherNowData = {
        city: name,
        time: curr.time.replace('T', ' '),                            // "2026-08-10 15:30"
        temp: `${Math.round(curr.temperature_2m)}°C`,                 // "29°C"
        feelsLike: `${Math.round(curr.apparent_temperature)}°C`,      // "31°C"
        humidity: `${curr.relative_humidity_2m}%`,                    // "65%"
        windSpeed: `${curr.wind_speed_10m} км/ч`,                     // "5.4 км/ч"
        windDirection: getWindDirectionName(curr.wind_direction_10m), // "Юго-Восточный (ЮВ)"
        weatherCode: getWeatherCode(curr.weather_code)[0],               // Ясно
        icon: getIcon(
          curr.time.replace('T', ' ').split(' ')[1],
          daily.sunrise[0].replace('T', ' ').split(' ')[1],
          daily.sunset[0].replace('T', ' ').split(' ')[1],
          curr.weather_code
        )
      }

      console.log(weatherNowData)
      return weatherNowData;

    } catch (error) {
      console.error(error)
    }
  }, [])



  const listCity = dataCity
    .filter((elem) => elem.name.toLowerCase().includes(value.toLowerCase()) && value)
    .map((elem, index) => {
      return (
        <li className='header__search-city-list-li'
          key={index}
          onClick={() => {
            setLocal({ lat: elem.coords.lat, lon: elem.coords.lon, name: elem.name })
            setValue(elem.name)
          }}
        >
          {elem.name}
        </li>
      )
    })
  // console.log(local)
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
            value={value}
            onChange={(e) => { setValue(e.target.value) }}
          />
          {value ?
            <ul className='header__search-city-list-ul'>
              {listCity}
            </ul>
            :
            ''
          }
          <button
            className="header__search-button"
            onClick={setCity}
          ></button>
        </div>
      </header>

      <main className="main">
        <div className="main__now-weather">
          <NowWeather
            parseNowWeather={parseNowWeather()}
          />
        </div>
        <div className="main__next-time-weather"></div>
        <div className="main__next-day-weather"></div>
      </main>

    </>
  )
}

export default App
