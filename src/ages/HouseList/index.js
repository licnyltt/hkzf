import React from 'react'

import { Flex } from 'antd-mobile';

import SearchHeader from '../../components/SearchHeader/'

import Filter from './components/Filter'

import styles from './index.module.scss'

export default class HouseList extends React.Component {

  render() {
    return (
      <div className={styles.root}>
        <Flex className={styles.listHeader}>
          <i className='iconfont icon-back' onClick={() => { this.props.history.go(-1) }}></i>
          <SearchHeader curCity='上海' className={styles.listSearch}></SearchHeader>
        </Flex>
        <Filter></Filter>
      </div >
    )
  }
}