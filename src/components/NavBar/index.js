import React from 'react'

import { NavBar } from 'antd-mobile';

import { withRouter } from "react-router";

import PropTypes from 'prop-types';

// import './index.scss'
import styles from './index.module.scss'

// console.log(styles)

function NavBarCom({ children, history, className, rightContent }) {
  return (
    <NavBar
      className={[styles.navBar, className].join(' ')}
      mode="light"
      icon={<i className='iconfont icon-back' />}
      onLeftClick={() => {
        console.log(111)

        history.go(-1)
      }}
      rightContent={rightContent}
    >
      {children}
    </NavBar>
  )
}

NavBarCom.prototypes = {
  children: PropTypes.string.isRequired,
  id: PropTypes.string
}

export default withRouter(NavBarCom)