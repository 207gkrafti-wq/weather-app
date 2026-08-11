import './NextTimeWeather.css'

function NextTimeWeather({ weather }) {
    
    if (!weather) {
        return <div className="loading">Загрузка погоды...</div>;
    }
    const result = weather.map((elem, index) => {
        return (<div className="main__next-time-weather__block" key={index}>
            <section className="main__next-time-weather__block-icon">
                <img src={elem.icon} alt="" className="main__next-time-weather-icon" />
            </section>
            <section className="main__next-time-weather__block-info">
                <p className="temperature">{elem.temp}</p>
                <p className="time">{elem.time}</p>
            </section>
        </div>)
    })

    return (<>
        {result}
    </>)
}

export default NextTimeWeather;