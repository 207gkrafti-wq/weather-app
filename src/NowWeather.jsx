import './NowWeather.css'

function NowWeather({ weather }) {

    if (!weather) {
        return <div className="loading">Загрузка погоды...</div>;
    }
    return (<>
            <section className="main__now-weather__block-icon">
                <img src={weather.icon} alt="" className="main__now-weather-icon" />
            </section>
            <section className="main__now-weather__block-info">
                <p className="city">{weather.city}</p>
                <p className="temperature">{weather.temp}</p>
                <p className="date">{weather.time}</p>
                <p className="condition">{weather.weatherCode}</p>
                <p className="feeling">Ощущяется как {weather.feelsLike}</p>
                <p className="humidity">Влажность {weather.humidity}</p>
                <p className="speed-direct">{weather.windSpeed} | {weather.windDirection}</p>
            </section>
    </>)
}

export default NowWeather;