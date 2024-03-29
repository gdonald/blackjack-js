import React from 'react'
import ReactDOM from 'react-dom/client'
import Game from './components/Game'
import ForkMe from './components/ForkMe'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Game key='g'></Game>
    <ForkMe></ForkMe>
  </React.StrictMode>
)
