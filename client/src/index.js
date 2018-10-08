import React from 'react'
import ReactDOM from 'react-dom'
// https://github.com/facebookincubator/create-react-app/issues/914
import 'babel-polyfill'
import { Provider } from 'react-redux'
import store from './store'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import './index.css'

ReactDOM.render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('root'))
registerServiceWorker()
