import React from 'react'
import ReactDom from 'react-dom'
import App from './App'
// import 'antd-mobile/dist/antd-mobile.css';
import './assets/fonts/iconfont.css'
import './index.scss'

//导入组件库样式
import 'react-virtualized/styles.css'

ReactDom.render(<App></App>, document.getElementById('root'))
