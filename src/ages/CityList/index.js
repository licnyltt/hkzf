import React from 'react'

import { List } from 'react-virtualized';

import axios from 'axios'

import { NavBar } from 'antd-mobile';

import { getCityListData } from '../../utils/index'

import './index.scss'


// List data as an array of strings
// const list = [
//   'Brian Vaughn'
//   // And so on...
// ];

// const list = Array.from(new Array(10000).map((item, index) => `${index}------dsadad`))
const list = Array.from(new Array(10000)).map((item, index) => `${index}-----asdasd`)

function rowRenderer({
  key,         // Unique key within array of rows
  index,       // Index of row within collection
  isScrolling, // The List is currently being scrolled
  isVisible,   // This row is visible within the List (eg it is not an overscanned row)
  style        // Style object to be applied to row (to position it)
}) {
  return (
    <div
      key={key}
      style={style}
    >
      {list[index]}-------{isScrolling + ""}-------{isVisible + ""}
    </div>
  )
}

const formatCityList = list => {
  const cityList = {}
  list.forEach(item => {
    const firstLetter = item.short.substr(0, 1)
    if (cityList[firstLetter]) {
      cityList[firstLetter].push(item)
    } else {
      cityList[firstLetter] = [item]
    }
  });

  const cityIndex = Object.keys(cityList).sort()
  // console.log(cityIndex)
  return {
    cityList,
    cityIndex
  }
}

export default class CityList extends React.Component {

  state = {
    cityList: {},
    cityIndex: []
  }

  getCityList = async () => {

    const res = await axios({
      method: 'get',
      url: 'http://localhost:8080/area/city?level=1',
    });
    const { cityList, cityIndex } = formatCityList(res.data.body)
    // console.log(cityList, cityIndex)

    const resHot = await axios({
      method: 'get',
      url: 'http://localhost:8080/area/hot',
    });
    cityIndex.unshift('hot')
    cityList['hot'] = resHot.data.body
    // console.log(cityList, cityIndex)


    //使用promise解决回调问题
    const curCity = await getCityListData()
    cityIndex.unshift('#')
    cityList['#'] = [curCity]
    // console.log(cityList, cityIndex)
    this.setState({
      cityList,
      cityIndex
    })

    // // 使用回调函数的形式
    // const curCity = getCityListData(
    //   async result => {
    //     // console.log(result.name)
    //     const { data: { body: { label, value } } } = await axios({
    //       method: 'get',
    //       url: 'http://localhost:8080/area/info',
    //       data: {
    //         name: result
    //       }
    //     });
    //     console.log(label, value)
    //     localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
    //     return { label, value }
    //   }
    // )

    // cityIndex.unshift('#')
    // cityList['#'] = [curCity]
    // console.log(cityList, cityIndex)
    // this.setState({
    //   cityList,
    //   cityIndex
    // })
  }

  componentDidMount() {
    this.getCityList()
  }

  render() {
    return (
      <div className='citylist'>
        <NavBar
          className='navbar'
          mode="light"
          icon={<i className='iconfont icon-back' />}
          onLeftClick={() => console.log('onLeftClick')}
        >城市选择</NavBar>

        <List
          width={300}
          height={300}
          rowCount={list.length}
          rowHeight={20}
          rowRenderer={rowRenderer}
        />
      </div>
    )
  }
}