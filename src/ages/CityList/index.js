import React from 'react'

import { List, AutoSizer } from 'react-virtualized';

import axios from 'axios'

import { Toast } from 'antd-mobile';

import { getCityListData, setCity } from '../../utils/index'

import NavBarCom from '../../components/NavBar'

import './index.scss'

//索引标题高度
const TITLE_HEIGHT = 36
//城市名字高度
const NAME_HEIGHT = 50
// 有房源的城市
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

const formatCityList = list => {
  // 把数据存在对象中
  // { a: [{}, {}]; b: [{}, {}] }
  const cityList = {}
  list.forEach(item => {
    const firstLetter = item.short.substr(0, 1)
    if (cityList[firstLetter]) {
      cityList[firstLetter].push(item)
    } else {
      cityList[firstLetter] = [item]
    }
  });
  // 把城市首字母从a-Z排序放到一个数组中
  const cityIndex = Object.keys(cityList).sort()
  // console.log(cityIndex)
  return {
    cityList,
    cityIndex,
  }
}

const formatCityIndex = letter => {
  switch (letter) {
    case '#':
      return '当前定位';
    case 'hot':
      return '热门城市';
    default:
      return letter.toUpperCase()
  }
}


export default class CityList extends React.Component {

  state = {
    cityList: {},
    cityIndex: [],
    active: 0,
  }

  cityListComponent = React.createRef()

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
    // console.log(curCity)

    cityIndex.unshift('#')
    cityList['#'] = [curCity]
    // console.log(cityList, cityIndex)
    this.setState({
      cityList,
      cityIndex,
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

  async componentDidMount() {
    await this.getCityList()
    // console.log(this.cityListComponent)
    this.cityListComponent.current.measureAllRows()
  }

  rowRenderer = ({
    index,       // Index of row
    isScrolling, // The List is currently being scrolled
    isVisible,   // This row is visible within the List (eg it is not an overscanned row)
    key,         // Unique key within array of rendered rows
    parent,      // Reference to the parent List (instance)
    style        // Style object to be applied to row (to position it);
    // This must be passed through to the rendered row element.
  }) => {
    const { cityIndex, cityList } = this.state
    const letter = cityIndex[index]
    // 获取指定字母索引下的城市列表数据
    // console.log(cityList[letter])
    return (
      <div
        key={key}
        style={style}
        className='city'
      >
        <div className='title'>{formatCityIndex(letter)}</div>
        {cityList[letter].map((item, index) => (
          <div
            className='name'
            key={item.value}
            onClick={() => {
              this.changeCity(item)
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }


  changeCity = ({ label, value }) => {
    console.log(label, value)
    if (HOUSE_CITY.indexOf(label) === -1) {
      Toast.info('该城市暂无房源数据', 1, null, false);
    } else {
      setCity({ label, value })
      this.props.history.go(-1)
    }
  }

  // 获取每一行高度方法
  getRowHeight = ({ index }) => {
    const { cityList, cityIndex } = this.state
    return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
  }

  // 渲染右侧索引列表方法
  renderCityIndex = () => {
    const { cityIndex, active } = this.state
    return cityIndex.map((item, index) => (
      <li
        key={item}
        className="city-index-item"
        onClick={() => {
          this.cityListComponent.current.scrollToRow(index)
        }
        }
      >
        <span
          className={active === index ? 'index-active' : 0}
        >
          {item === 'hot' ? '热' : item}
        </span>
      </li >
    ))
  }
  // 获取list组件中渲染行的信息
  onRowsRendered = ({ startIndex }) => {
    // console.log(startIndex)
    this.setState({
      active: startIndex
    })
  }

  render() {
    return (
      <div className='citylist'>
        <NavBarCom>
          城市选择
        </NavBarCom>
        {/* 城市列表 */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={this.cityListComponent}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              width={width}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment='start'
            />
          )}
        </AutoSizer>
        {/* 右侧索引列表 */}
        <ul className='city-index'>{this.renderCityIndex()}</ul>
      </div>
    )
  }
}