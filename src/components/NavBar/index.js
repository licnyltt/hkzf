import React from 'react'

import { NavBar } from 'antd-mobile';

import { withRouter } from "react-router";

import PropTypes from 'prop-types';

// import './index.scss'
import styles from './index.module.scss'

// console.log(styles)

function NavBarCom({ children, history }) {
  return (
    <NavBar
      id={styles.navBar}
      mode="light"
      icon={<i className='iconfont icon-back' />}
      onLeftClick={() => history.go(-1)}
    >
      {children}
    </NavBar>
  )
}

NavBarCom.prototypes = {
  children: PropTypes.string.isRequired
}

export default withRouter(NavBarCom)