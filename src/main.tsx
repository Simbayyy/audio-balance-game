import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import AudioPlayer from './components/AudioPlayer.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AudioPlayer />
  </React.StrictMode>,
)
