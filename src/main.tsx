import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from "antd"
import 'antd/dist/reset.css';
import App from './App'
import './index.css'
import 'virtual:uno.css'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#6100FF",
        borderRadius: 2
      }
    }}
  >
    <App />
  </ConfigProvider>
  // </React.StrictMode>,
)
