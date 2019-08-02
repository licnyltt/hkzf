import React from 'react'

import { Toast } from 'antd-mobile';

import classNames from 'classnames'

import { getCityListData, BASE_URL, API } from '../../utils'

import HouseItem from '../../components/HouseItem'

import NavBarPublic from '../../components/NavBar'

import styles from './index.module.scss'

import './index.scss'

const BMap = window.BMap

const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

export default class Map extends React.Component {

  state = {
    isShowHouseList: false,
    houseList: []
  }

  componentDidMount() {
    this.initMap()
  }

  async initMap() {

    const { label, value } = await getCityListData()

    let map = new BMap.Map("container");
    this.map = map
    // 创建地址解析器实例     
    const myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野    
    myGeo.getPoint(label, async point => {
      if ((point)) {
        map.centerAndZoom((point), 11);

        map.addOverlay(new BMap.Marker((point)));

        const top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
        const top_left_control = new BMap.ScaleControl();// 左上角，添加比例尺
        map.addControl(top_left_control);
        map.addControl(top_left_navigation);

        await this.renderOverlays(value)

      }
    },
      label);

    map.addEventListener('movestart', () => {
      this.setState({
        isShowHouseList: false
      })
    })
  }


  async renderOverlays(id) {
    Toast.loading('loading...', 0, null, false)
    let res = await API({
      url: `${BASE_URL}/area/map`,
      params: {
        id
      }
    });

    Toast.hide()

    // console.log('first', res)

    let grade = this.map.getZoom()

    let { nextGrade, type } = this.getTypeAndZoom(grade)


    res.data.body.forEach(item => {
      this.createOverlays(item, nextGrade, type)
    })
  }

  getTypeAndZoom(grade) {
    let nextGrade, type
    if (grade === 11) {
      nextGrade = 13
      type = 'circle'
    } else if (grade === 13) {
      nextGrade = 15
      type = 'circle'
    } else {
      type = 'rect'
    }
    return { nextGrade, type }
  }





  createOverlays(item, nextGrade, type) {
    if (type === 'circle') {
      this.createCircle(item, nextGrade)
    } else {
      this.createRect(item)
    }
  }



  createCircle(item, nextGrade) {
    // console.log(item, nextGrade, type)

    const position = new BMap.Point(item.coord.longitude, item.coord.latitude)
    const opts = {
      position: (position),    // 指定文本标注所在的地理位置
      offset: new BMap.Size(-35, -35)    //设置文本偏移量
    }

    const label = new BMap.Label("", opts);  // 创建文本标注对象

    label.setContent(`
            <div class=${styles.bubble}>
              <p class=${styles.name}>${item.label}</p>
              <p>${item.count}套</p>
            </div>
          `)

    label.setStyle(labelStyle);

    label.addEventListener('click', () => {

      // console.log(item, nextGrade, type)


      // 渲染
      this.renderOverlays(item.value)


      // 放大
      this.map.centerAndZoom(position, nextGrade)


      //加一个延时器是为了解决报错
      setTimeout(() => {
        // 清除覆盖物
        this.map.clearOverlays()
      }, 0);

    })

    this.map.addOverlay(label);

  }













  createRect(item) {
    // console.log(item, nextGrade, type)


    const position = new BMap.Point(item.coord.longitude, item.coord.latitude)
    const opts = {
      position: (position),    // 指定文本标注所在的地理位置
      offset: new BMap.Size(-50, -24)    //设置文本偏移量
    }



    const label = new BMap.Label("", opts);  // 创建文本标注对象



    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${item.label}</span>
        <span class="${styles.housenum}">${item.count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)

    label.setStyle(labelStyle);

    label.addEventListener('click', e => {

      //移动小区到地图可视区中心
      // console.log(e)
      const x = window.innerWidth / 2 - e.changedTouches[0].clientX
      const y = (window.innerHeight - 330 - 45) / 2 - e.changedTouches[0].clientY + 45

      this.map.panBy(x, y)

      this.getCommunityHouses(item.value)
    })

    this.map.addOverlay(label);
  }

  async getCommunityHouses(id) {
    Toast.loading('loading...', 0, null, false)
    let res = await API({
      url: `${BASE_URL}/houses`,
      params: {
        id
      }
    });
    Toast.hide()
    // console.log(res)
    this.setState({
      isShowHouseList: true,
      houseList: res.data.body.list
    })

  }

  renderHouseList() {
    return this.state.houseList.map(item => (
      <HouseItem
        key={item.houseCode}
        {...item}
        houseImg={`${BASE_URL}${item.houseImg}`}
        onClick={() => { this.props.history.push(`/details/${item.houseCode}`) }}
      //测试
      // style={...}
      ></HouseItem>
    ))
  }

  render() {
    return (
      <div className='map'>
        <NavBarPublic>
          地图找房
        </NavBarPublic>

        <div id='container'>
          {/* <div id={'container'}> */}

        </div>

        {/* 房源列表结构 */}
        {/* 如果要展示列表结构，只需要添加 styles.show 类名即可 */}

        {/* <div
          className={[
            styles.houseList,
            this.state.isShowHouseList ? styles.show : ''
          ].join(' ')}
        > */}

        <div
          className={classNames(styles.houseList, {
            [styles.show]: this.state.isShowHouseList
          })}
        >

          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">
              更多房源
            </a>
          </div>
          <div className={styles.houseItems}>{this.renderHouseList()}</div>
        </div>

      </div >
    )
  }

}