import './NextDayWeather.css'

function NextDayWeather({ weather }) {
    if (!weather) return <div className="loading">Загрузка...</div>;

    const result = weather.map((day, index) => {
        return (<div className="main__next-day-weather__block" key={index}>
            <section className="main__next-day-weather__block-date">
                <p className="day-date">{day.date}</p>
            </section>
            <section className="main__next-day-weather__block-day-info">
                <img src={day.dayIcon} alt={day.dayCondition} title={`Днем: ${day.dayCondition}`} />
                <span className="max-temp">{day.maxTemp}</span>
            </section>
            <section className="main__next-day-weather__block-night-info">
                <img src={day.nightIcon} alt={day.nightCondition} title={`Ночью: ${day.nightCondition}`} />
                <span className="min-temp">{day.minTemp}</span>
            </section>
        </div>)
    })

    return (<>
        { result }
    </>);
}

export default NextDayWeather;