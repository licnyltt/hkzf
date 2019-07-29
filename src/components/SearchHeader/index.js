import React from 'react'

import { withRouter } from 'react-router-dom'

import PropTypes from 'prop-types'

import { Flex } from 'antd-mobile';



import styles from './index.module.scss'

function SearchHeader({ history, curCity, className }) {
  return (
    <Flex className={[styles.root, className].join(' ')}>
      <Flex className={styles.searchLeft}>
        <div className={styles.location} onClick={() => history.push('/citylist')}>
          <span>{curCity}</span>

          <i className='iconfont icon-arrow'></i>
        </div>
        <div className={styles.searchForm} onClick={() => history.push('/search')}>
          <i className='iconfont icon-seach'></i>
          <span>请输入小区或地址</span>
        </div>
      </Flex>
      <i className='iconfont icon-map' onClick={() => history.push('/map')} ></i>
    </Flex>
  )
}

SearchHeader.defaultProps = {
  className: ''
}

SearchHeader.prototypes = {
  className: PropTypes.string,
  curCity: PropTypes.string.isRequired
}

export default withRouter(SearchHeader)