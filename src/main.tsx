import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import '@radix-ui/themes/styles.css';
import AudioPlayer from './components/AudioPlayer.tsx'
import { Theme } from '@radix-ui/themes';

window.addEventListener("DOMContentLoaded", function () {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Theme>
        <AudioPlayer />
      </Theme>
    </React.StrictMode>,
  )
  })