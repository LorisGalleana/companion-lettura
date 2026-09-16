
import zombieImg from './assets/zombie.jpg'
import './App.css'

function App() {

  return (
    <>
      <header>
        <h1>
          READING COMPANION
        </h1>
        <h2>
          La mia creatura
        </h2>
        <div className="hero">
          <img src={zombieImg} className="base" width="170" height="179" alt="Zorak, la creatura del giocatore" />
        </div>
      </header>
      <section id="center">
        
        <div>
          <h3>Tempo di lettura</h3>
          <p>
            0 minuti
          </p>
        </div>
        <div>
          <h3>Risorse</h3>
          <p>
            0
          </p>
        </div>
        <button
          type="button"
          className="start"
        >
           Inizia Sessione 
        </button>
      </section>

      

      
    </>
  )
}

export default App
