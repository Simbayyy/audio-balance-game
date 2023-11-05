import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { Page } from './components/Page.tsx';

window.addEventListener("DOMContentLoaded", function () {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <Theme>
        <Page />
      </Theme>
    </React.StrictMode>,
  )
  })