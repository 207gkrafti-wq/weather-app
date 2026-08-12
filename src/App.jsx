import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import NowWeather from './NowWeather'
import NextTimeWeather from './nextTimeWeather';
import NextDayWeather from './NextDayWeather';

const WEATHER_CODES = {
  0: ['Ясно', '/day_icon/01d.svg', '/night_icon/01n.svg'],
  1: ['Преимущественно ясно', '/day_icon/02d.svg', '/night_icon/02n.svg'],
  2: ['Переменная облачность', '/day_icon/03d.svg', '/night_icon/03n.svg'],
  3: ['Пасмурно', '/day_icon/04d.svg', '/night_icon/04n.svg'],
  45: ['Туман', '/day_icon/50d.svg', '/night_icon/50n.svg'],
  48: ['Отлагающийся осаждающийся туман', '/day_icon/50d.svg', '/night_icon/50n.svg'],
  51: ['Лёгкая морось', '/day_icon/10d.svg', '/night_icon/10n.svg'],
  53: ['Умеренная морось', '/day_icon/10d.svg', '/night_icon/10n.svg'],
  55: ['Плотная морось', '/day_icon/09d.svg', '/night_icon/09n.svg'],
  61: ['Слабый дождь', '/day_icon/09d.svg', '/night_icon/09n.svg'],
  63: ['Умеренный дождь', '/day_icon/09d.svg', '/night_icon/09n.svg'],
  65: ['Сильный дождь', '/day_icon/09d.svg', '/night_icon/09n.svg'],
  71: ['Слабый снег', '/day_icon/13d.svg', '/night_icon/13n.svg'],
  73: ['Умеренный снег', '/day_icon/13d.svg', '/night_icon/13n.svg'],
  75: ['Сильный снег', '/day_icon/13d.svg', '/night_icon/13n.svg'],
  80: ['Слабый ливень', '/day_icon/09d.svg', '/night_icon/09n.svg'],
  81: ['Умеренный ливень', '/day_icon/09d.svg', '/night_icon/09n.svg'],
  82: ['Сильный ливень', '/day_icon/09d.svg', '/night_icon/09n.svg'],
  95: ['Гроза', '/day_icon/11d.svg', '/night_icon/11n.svg'],
};

const DAYS_WEEK = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

const MONTH = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']


if (!localStorage.getItem('cityName')) {
  const json = JSON.stringify({ lat: '42.885', lon: '47.620', name: 'Каспийск' })
  localStorage.setItem('cityName', json)
}
function App() {

  const [value, setValue] = useState('')
  const [local, setLocal] = useState({ lat: '', lon: '', name: '' })
  const [dataCity, setDataCity] = useState([])
  const [weatherData, setWeatherData] = useState({ now: null, nextTime: null, nextDay: null });

  function getWeatherCode(code) {
    return WEATHER_CODES[code]
  }

  useEffect(() => {
    async function parseCity() {
      const respons = await fetch('/russian-cities.json')
      const data = await respons.json()
      setDataCity(data);
    }
    parseCity()

  }, [])

  function getDate(date) {
    return `${DAYS_WEEK[new Date(date).getDay()]}, ${MONTH[new Date(date).getMonth()]} ${new Date(date).getDate()}`
  }

  function setCity() {
    if (localStorage.getItem('cityName') && local.lat != '' && local.lon != '') {
      const json = JSON.stringify({ lat: local.lat, lon: local.lon, name: local.name })
      localStorage.setItem('cityName', json)
      parseNowWeather().then((data) => setWeatherData((prev) => ({ ...prev, now: data })));
      parseNextTimeWeather().then((data) => setWeatherData((prev) => ({ ...prev, nextTime: data })));
      parseNextDaysWeather().then((data) => setWeatherData((prev) => ({ ...prev, nextDay: data })));
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
        time: getDate(curr.time.replace('T', ' ').split(' ')[0]),     // "2026-08-10 15:30"
        temp: `${Math.round(curr.temperature_2m)}°C`,                 // "29°C"
        feelsLike: `${Math.round(curr.apparent_temperature)}°C`,      // "31°C"
        humidity: `${curr.relative_humidity_2m}%`,                    // "65%"
        windSpeed: `${curr.wind_speed_10m} км/ч`,                     // "5.4 км/ч"
        windDirection: getWindDirectionName(curr.wind_direction_10m), // "Юго-Восточный (ЮВ)"
        weatherCode: getWeatherCode(curr.weather_code)[0],            // Ясно
        icon: getIcon(
          curr.time.replace('T', ' ').split(' ')[1],
          daily.sunset[0].replace('T', ' ').split(' ')[1],
          daily.sunrise[0].replace('T', ' ').split(' ')[1],
          curr.weather_code
        )
      }

      console.log(weatherNowData)
      return weatherNowData;

    } catch (error) {
      console.error(error)
    }
  }, [])



  // Парсем погоду на 24 часа
  const parseNextTimeWeather = useCallback(async () => {
    const lat = JSON.parse(localStorage.getItem('cityName')).lat
    const lon = JSON.parse(localStorage.getItem('cityName')).lon

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code&daily=sunrise,sunset&forecast_hours=24&timezone=auto`;

    try {
      const response = await fetch(url, { cache: 'no-store' });
      const data = await response.json();

      const { time, temperature_2m, weather_code } = data.hourly;
      const sunrise = data.daily.sunrise[0].split('T')[1]; // "05:08"
      const sunset = data.daily.sunset[0].split('T')[1];   // "19:22"

      const forecast24h = time.map((timeStr, index) => {
        const hour = timeStr.split('T')[1]; // "2026-08-11", "15:00"

        return {
          time: hour,                                  // "15:00"
          temp: `${Math.round(temperature_2m[index])}°C`, // "29°C"
          icon: getIcon(
            hour,
            sunset,
            sunrise,
            weather_code[index]
          )
        };
      });

      console.log(forecast24h);
      return forecast24h;

    } catch (error) {
      console.error(error)
    }
  }, [])

  // Парсем погоду на 7 дней
  const parseNextDaysWeather = useCallback(async () => {
    const lat = JSON.parse(localStorage.getItem('cityName')).lat
    const lon = JSON.parse(localStorage.getItem('cityName')).lon

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=weather_code&daily=temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto`;

    try {
      const response = await fetch(url, { cache: 'no-store' });
      const data = await response.json();

      const { time: dailyTime, temperature_2m_max, temperature_2m_min } = data.daily;
      const { time: hourlyTime, weather_code: hourlyCodes } = data.hourly;

      const forecast7Days = dailyTime.map((dateStr, dayIndex) => {
        // Ищем индекс для 12:00 текущего дня (День)
        const dayCodeIndex = hourlyTime.findIndex(t => t === `${dateStr}T12:00`);
        // Ищем индекс для 00:00 текущего дня (Ночь)
        const nightCodeIndex = hourlyTime.findIndex(t => t === `${dateStr}T00:00`);

        // Получаем коды погоды (если за полночь нет данных — берем 03:00)
        const dayCode = dayCodeIndex !== -1 ? hourlyCodes[dayCodeIndex] : hourlyCodes[dayIndex * 24 + 12];
        const nightCode = nightCodeIndex !== -1 ? hourlyCodes[nightCodeIndex] : hourlyCodes[dayIndex * 24 + 2];

        const dayCodeData = getWeatherCode(dayCode);     // ['Ясно', '/day_icon/...', '/night_icon/...']
        const nightCodeData = getWeatherCode(nightCode);

        return {
          date: getDate(dateStr),                                 // "Ср, Август 12"
          maxTemp: `${Math.round(temperature_2m_max[dayIndex])}°C`, // "28°C"
          minTemp: `${Math.round(temperature_2m_min[dayIndex])}°C`, // "19°C"
          dayIcon: dayCodeData[1],                                // Дневная иконка в 12:00
          nightIcon: nightCodeData[2],                            // Ночная иконка в 00:00
          dayCondition: dayCodeData[0],                           // Описание погоды днем
          nightCondition: nightCodeData[0]                        // Описание погоды ночью
        };
      });

      console.log('Точный прогноз на 7 дней:', forecast7Days);
      return forecast7Days;

    } catch (error) {
      console.error('Ошибка при загрузке 7-дневного прогноза:', error);
      return null;
    }
  }, [])


  useEffect(() => {
    parseNowWeather().then((data) => setWeatherData((prev) => ({ ...prev, now: data })));
    parseNextTimeWeather().then((data) => setWeatherData((prev) => ({ ...prev, nextTime: data })));
    parseNextDaysWeather().then((data) => setWeatherData((prev) => ({ ...prev, nextDay: data })));
  }, [parseNowWeather, parseNextTimeWeather, parseNextDaysWeather]);

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
          <img src="/logo.svg" alt="logo" className="header__logo-img" />
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
            weather={weatherData.now}
          />
        </div>
        <div className="name-block">
          <h2 className="">
            Погода на 24 часа
          </h2>
        </div>
        <div className="main__next-time-weather">
          <NextTimeWeather
            weather={weatherData.nextTime}
          />
        </div>
        <div className="name-block">
          <h2 className="">
            Погода на 7 дней
          </h2>
        </div>
        <div className="main__next-day-weather">
          <NextDayWeather
            weather={weatherData.nextDay}
          />
        </div>
      </main>

    </>
  )
}

export default App
