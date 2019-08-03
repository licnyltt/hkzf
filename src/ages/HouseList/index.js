import React from 'react'

import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized';

import { Flex, Toast } from 'antd-mobile';

// 导入顶部搜索导航栏组件
import SearchHeader from '../../components/SearchHeader/'

import HouseItem from '../../components/HouseItem'

import Sticky from '../../components/Sticky'

import NoHouse from '../../components/NoHouse'

import Filter from './components/Filter'

import { getCityListData, BASE_URL, API } from '../../utils'

import styles from './index.module.scss'

const HOUSE_ITEM_HEIGHT = 120

export default class HouseList extends React.Component {

  state = {
    list: [],
    count: 0,
    isLoaded: false
  }

  filters = {}

  // 初始化数据，防止在 render 渲染时报错
  label = '上海'
  value = ''

  async componentDidMount() {
    const { label, value } = await getCityListData()
    this.label = label
    this.value = value
    this.searchHouseList()
  }

  onFilter = (filters) => {
    // console.log(filters)
    this.filters = filters
    this.searchHouseList()
    window.scrollTo(0, 0)
  }

  searchHouseList = async (start = 1,
    end = 20) => {
    this.setState({
      isLoaded: false
    })
    Toast.loading("loadind...", 0, null, false)
    const res = await API({
      url: `${BASE_URL}/houses`,
      params: {
        cityId: this.value,
        ...this.filters,
        start,
        end
      }
    })
    Toast.hide()
    // console.log(res)
    const { list, count } = res.data.body

    if (count > 0) {
      Toast.info(`共找到${count}套房源`, 1, null, false)
    }

    this.setState({
      list,
      count,
      isLoaded: true
    })

  }

  rowRenderer = ({
    index,
    key,
    style
  }) => {
    const { list } = this.state
    const item = list[index]

    if (!item) {
      return (
        <div
          key={key}
          style={style}
        >
          <p
            className={styles.loading}
          >

          </p>

        </div>
      )
    }

    return (
      <HouseItem
        key={key}
        style={style}
        {...item}
        houseImg={`${BASE_URL}${item.houseImg}`}
        onClick={() => this.props.history.push(`/details/${item.houseCode}`)}
      >
      </HouseItem>
    )
  }

  isRowLoaded = ({ index }) => {
    return !!this.state.list[index];
  }

  loadMoreRows = ({ startIndex, stopIndex }) => {
    // console.log(startIndex, stopIndex)
    return new Promise(async resolve => {
      const { value } = await getCityListData()
      const res = await API({
        url: `${BASE_URL}/houses`,
        params: {
          cityId: value,
          ...this.filters,
          start: startIndex + 1,
          end: stopIndex + 1
        }
      })
      // console.log(res)
      // 注意：拿到最新的数据后，要追加数据，而不是覆盖现有数据！
      const { count, list } = res.data.body
      this.setState({
        list: [...this.state.list, ...list],
        count: count
      })
      resolve()
    })
  }

  renderHouseList() {
    const { count, isLoaded } = this.state

    if (isLoaded && count === 0) {
      return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>
    }

    return <InfiniteLoader
      isRowLoaded={this.isRowLoaded}
      loadMoreRows={this.loadMoreRows}
      rowCount={count}
      minimumBatchSize={21}
    >
      {({ onRowsRendered, registerChild }) => (
        <WindowScroller>
          {({ height, isScrolling, scrollTop }) => (
            < AutoSizer >
              {({ width }) => (
                <List
                  autoHeight
                  width={width}
                  height={height}
                  rowHeight={HOUSE_ITEM_HEIGHT}
                  rowCount={count}
                  rowRenderer={this.rowRenderer}
                  isScrolling={isScrolling}
                  scrollTop={scrollTop}

                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                />
              )
              }
            </AutoSizer >
          )}
        </WindowScroller>
      )}
    </InfiniteLoader>
  }

  render() {
    return (

      <div
        className={styles.root}
      >
        {/* 顶部搜索导航栏 */}
        < Flex className={styles.listHeader} >
          <i className='iconfont icon-back' onClick={() => { this.props.history.go(-1) }}></i>
          <SearchHeader curCity={this.label} className={styles.listSearch}></SearchHeader>
        </Flex >

        <Sticky height={40}>
          {/* 条件筛选栏组件 */}
          < Filter onFilter={this.onFilter} ></Filter >
        </Sticky>


        {/* 房源列表 */}
        <div className={styles.HouseList}>
          {this.renderHouseList()}
        </div>


      </div >
    )
  }
}