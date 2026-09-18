import { useEffect, useState } from 'react'
import zombieImg from './assets/zombie.jpg'
import './App.css'

function App() {
  const [qi, setQi] = useState(() => {
    return Number(localStorage.getItem("qi"))
  })
  const [qiEarned, setQiEarned] = useState(0)
  
  const [isReading, setIsReading] = useState(false)
  
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [lastSessionDuration, setLastSessionDuration] = useState(() => {
    return Number(localStorage.getItem("lastSessionDuration"))
  })
  
  const [word, setWord] = useState("")
  const [inventory, setInventory] = useState(() => {
    const savedInventory = localStorage.getItem("inventory")

    if (savedInventory === null) {
      return []
    }

    return JSON.parse(savedInventory)
  })

  const [activeSection, setActiveSection] = useState("reading")
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("history")

    if (savedHistory === null) {
      return []
    }

    return JSON.parse(savedHistory)
  })
  const [resourcesEarned, setResourcesEarned] = useState([])

  useEffect(() => {
  if (!isReading) {
    return
  }

  const interval = setInterval(() => {
    setElapsedSeconds(current => current + 1)
  }, 1000)

  return () => {
    clearInterval(interval)
  }
}, [isReading])

useEffect(() => {
  localStorage.setItem("qi", qi)
}, [qi])

useEffect(() => {
  localStorage.setItem("inventory", JSON.stringify(inventory))
}, [inventory])

useEffect(() => {
  localStorage.setItem("lastSessionDuration", lastSessionDuration)
}, [lastSessionDuration])

useEffect(() => {
  localStorage.setItem("history", JSON.stringify(history))
}, [history])



function formatTime(elapsedSeconds) {
  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  
}

function handleSessionToggle() {
  if (isReading) {
      setQi(current => current + Math.floor(elapsedSeconds / 5))
      setQiEarned(Math.floor(elapsedSeconds / 5))
      setLastSessionDuration(elapsedSeconds)
      const session = {
        duration: elapsedSeconds,
        qi: Math.floor(elapsedSeconds / 5),
        resources: resourcesEarned
      }

      setHistory([...history, session])
      setResourcesEarned([])
      setElapsedSeconds(0)

  } else {
    setQiEarned(0)
  }
    setIsReading(!isReading)
}

function normalizeWord(word) {
  if (word === "") {
    return ""
  }
  const lowerWord = word.toLowerCase()
  return lowerWord[0].toUpperCase() + lowerWord.slice(1)
}

function handleCollectWord() {
  
  if (!isReading) {
    return
  }

  const newResource = normalizeWord(word.trim())

  if (newResource === "") {
    setWord("")
    return 
  }

  setResourcesEarned([...resourcesEarned, newResource])

  const existingResource = inventory.find(
    resource => resource.name === newResource
  )

  if (existingResource) {
    const updatedInventory = inventory.map(resource => {
      if (resource.name === newResource) {
        return {
          ...resource,
          quantity: resource.quantity + 1
        }
      }

      return resource
    })

    setInventory(updatedInventory)
    setWord("")
    return
  }
  setInventory([...inventory,{ name: newResource, quantity: 1 }])
  setWord("")
}
  
  return (
    <>
      <nav>
        <button onClick={() => setActiveSection("reading")}>
          Lettura
        </button>

        <button onClick={() => setActiveSection("inventory")}>
          Inventario
        </button>

        <button onClick={() => setActiveSection("history")}>
          Storico
        </button>
      </nav>

      <header>
        <h1>
          READING COMPANION
        </h1>
        <p>
          {isReading ? 'Sessione di lettura in corso...' : 'Nessuna sessione di lettura in corso.'}
        </p>
        <h2>
          La mia creatura
        </h2>
        <div className="hero">
          <img src={zombieImg} className="base" width="170" height="179" alt="Zorak, la creatura del giocatore" />
        </div>
      </header>

      {activeSection === "reading" && (
        <section id="center">
            
          <div>
            <h3>Tempo di lettura</h3>
            <p>{formatTime(elapsedSeconds)}</p>
            <p>Ultima sessione: {formatTime(lastSessionDuration)}</p>
          </div>
          <div>
            <h3>Qi</h3>
            <p>
              {qi}
            </p>
            <h3>Ultima sessione</h3>
            <p>
              + {qiEarned} Qi
            </p>
            <input 
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
            <button
              type="button"
              onClick={handleCollectWord}
              disabled={!isReading}>
                Raccogli parola
            </button>
          </div>
          <button
            type="button"
            className="start"
            onClick={handleSessionToggle}
          >
            {isReading ? 'Termina Sessione' : 'Inizia Sessione'}
          </button>
            
        </section>
      )}
      
      {activeSection === "inventory" && (
        <div>
          <h2>Inventario</h2>
          {inventory.map(resource => (
            <p key={resource.name}>{resource.name} x {resource.quantity}</p>
          ))}
        </div>
      )}

      {activeSection === "history" && (
        <div>
        <h2>Storico</h2>

        {history.map((session, index) => (
          <div key={index}>
            <h3>Sessione {index + 1}</h3>
            <p>Durata: {formatTime(session.duration)}</p>
            <p>Qi: {session.qi}</p>
            <p>Risorse:</p>
             {session.resources.map((resource, index) => (
                <p key={index}>{resource}</p>
              ))}
          </div>
        ))}
      </div>
      )}

    </>
  )
}

export default App
