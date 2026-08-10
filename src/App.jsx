import { useState } from 'react'
import './App.css'

function App() {


  return (
    <>
      <header className="header">
          <div className="header__logo">
            <img src="" alt="" className="header--logo" />
          </div>
          <div className="header__search">
            <input type="text" name="" id="" className="header--search" placeholder='Поиск города' />
            
          </div>
      </header>
      <main className="main">
        <div className="main__weather__now">

        </div>
        <div className="main__weather__next__time">

        </div>
        <div className="main__weather__next__day">

        </div>
      </main>
    </>
  )
}

export default App
