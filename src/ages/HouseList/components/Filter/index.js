import React from 'react'

// 引入动画组件库
import { Spring } from 'react-spring/renderprops'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

import axios from 'axios'
import { getCityListData, API, BASE_URL } from '../../../../utils'

// 标题高亮数据
const titleSelectedStatus = {
  // false 表示不亮；true 表示高亮
  area: false,
  mode: false,
  price: false,
  more: false
}

// 选中值对象：用来设置每一次的选中值
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

export default class Filter extends React.Component {

  state = {
    // 选中值对象：用来设置每一次的选中值
    selectedValues,

    // 所有筛选条件数据
    filtersData: {},

    // 标题高亮数据
    titleSelectedStatus,

    // 表示展示对话框的类型（ 有可能展示 FilterPicker 组件，有可能展示 FilterMore 组件 ）
    openType: ''
  }

  componentDidMount() {
    // 获取所有筛选条件数据
    this.getFiltersData()

    this.htmlBody = document.body
  }

  // 获取所有筛选条件数据方法封装
  async getFiltersData() {

    const { value } = await getCityListData()
    // console.log(value)

    const res = await axios({
      // const res = await API({
      // url: `${BASE_URL}/houses/condition`,
      url: 'http://localhost:8080/houses/condition',
      params: {
        id: value
      }
    })

    // console.log(res)

    this.setState({
      filtersData: res.data.body
    })

  }

  // 渲染前面三个菜单对应的组件：
  renderFilterPicker() {
    const { filtersData: { area, subway, rentType, price }, selectedValues, openType } = this.state
    if (this.state.openType !== 'more' && this.state.openType !== '') {

      let data
      let cols = 1
      let defaultValue = selectedValues[openType]
      switch (this.state.openType) {
        case 'area':
          data = [area, subway]
          cols = 3
          break
        case 'mode':
          data = rentType
          break
        case 'price':
          data = price
          break;
        default:
          break
      }

      return <FilterPicker
        key={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        defaultValue={defaultValue}
        type={openType}
      />
    }
    return null
  }

  // 切换标题高亮
  // 参数 type 表示：当前点击菜单的类型
  changeTitleSelected = type => {

    this.htmlBody.className = 'hidden'

    // debugger
    // 1 在标题点击事件 onTitleClick 方法中，获取到两个状态：标题选中状态对象和筛选条件的选中值对象。
    // titleSelectedStatus => { area: false, mode: true, ... }
    // selectedValues => { area: [], mode: [], ... }
    const { titleSelectedStatus, selectedValues } = this.state
    // 2 根据当前标题选中状态对象，获取到一个新的标题选中状态对象（newTitleSelectedStatus）
    // console.log(titleSelectedStatus)

    const newTitleSelectedStatusChange = { ...titleSelectedStatus }
    // console.log(newTitleSelectedStatusChange)


    // 3 使用 Object.keys() 方法，遍历标题选中状态对象。
    // Object.keys(titleSelectedStatus) => ['area', 'mode', ...]
    Object.keys(titleSelectedStatus).forEach(item => {
      // 获取每一个菜单的选中项
      const selectedVal = selectedValues[item]

      // 4 先判断是否为当前标题，如果是，直接让该标题选中状态为 true（高亮）。
      // 5 否则，分别判断每个标题的选中值是否与默认值相同。
      // 6 如果不同，则设置该标题的选中状态为 true。
      // 7 如果相同，则设置该标题的选中状态为 false。
      if (item === type) {
        // 设置为true，就表示高亮
        newTitleSelectedStatusChange[type] = true
      } else {
        // 当前类型是否选中
        // console.log('selectedVal', selectedVal)

        let typeSelected = this.getTitleSelectedStatus(item, selectedVal)
        // console.log('typeSelected', typeSelected)

        // 将 typeSelected 对象中的属性，添加到 newTitleSelectedStatusChange，重名的属性，后面覆盖前面
        // newTitleSelectedStatusChange ==> { area: false, mode: false }
        // typeSelected ==> { area: true }
        // 结果为： { area: true, mode: false }
        Object.assign(newTitleSelectedStatusChange, typeSelected)
      }


    })


    this.setState({
      // 8 更新状态 titleSelectedStatus 的值为：newTitleSelectedStatusChange
      openType: type,
      titleSelectedStatus: newTitleSelectedStatusChange
    })

  }



  // 封装菜单高亮逻辑
  getTitleSelectedStatus(type, selectedVal) {
    const newTitleSelectedStatus = {}

    if (type === 'area' && (selectedVal.length === 3 || selectedVal[0] === "subway")) {
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length > 0) {
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }
    return newTitleSelectedStatus
  }


  onCancel = (type) => {
    this.htmlBody.className = ''
    const selectedVal = this.state.selectedValues[type]

    const newTitleSelectedStatus = this.getTitleSelectedStatus(
      type,
      selectedVal
    )

    this.setState({
      openType: '',
      titleSelectedStatus: { ...this.state.titleSelectedStatus, ...newTitleSelectedStatus }
    })
  }


  onSave = (type, value) => {
    this.htmlBody.className = ''
    let newTitleSelectedStatus = this.getTitleSelectedStatus(
      type,
      value
    )

    const newSelectedValues = { ...this.state.selectedValues, [type]: value }



    // 这是传递给父组件的筛选条件对象
    const filters = {}
    // 处理：区域或地铁
    const area = newSelectedValues.area
    const areaKey = area[0]
    let areaValue
    if (area.length == 2) {
      areaValue = null
    } else if (area.length === 3) {
      areaValue = area[2] === 'null' ? area[1] : area[2]
    }
    filters[areaKey] = areaValue
    // 处理方式和租金 
    filters.rentType = newSelectedValues.mode[0]
    filters.price = newSelectedValues.price[0]
    // 处理更多筛选条件数据
    filters.more = newSelectedValues.more.join(',')
    // console.log(1111111, filters)
    // 调用父组件中的 onFilter 方法，将所有筛选条件数据传递给父组件
    this.props.onFilter(filters)



    this.setState({
      openType: '',
      // 更新当前类型对应的选中值
      // 选中值对象：用来设置每一次的选中值
      selectedValues: newSelectedValues,
      // 标题高亮数据
      titleSelectedStatus: { ...this.state.titleSelectedStatus, ...newTitleSelectedStatus }
    })
  }

  // 渲染第四个菜单对应的组件
  renderFilterMore() {

    const { filtersData: { characteristic, floor, oriented, roomType }, openType, selectedValues } = this.state

    const data = { characteristic, floor, oriented, roomType }

    const defaultValue = selectedValues.more

    if (openType !== 'more') {
      return null
    }

    return <FilterMore
      data={data}
      onCancel={this.onCancel}
      onSave={this.onSave}
      defaultValue={defaultValue}
      type={openType}
    />
  }

  renderMask() {
    const { openType } = this.state
    const isHide = openType == 'more' || openType == ''

    return (
      <Spring
        from={{ opacity: 0 }}
        to={{ opacity: isHide ? 0 : 1 }}
      >
        {props => {
          // console.log(props)
          if (props.opacity == 0) {
            return null
          }
          return (
            <div style={props} className={styles.mask} onClick={() => { this.onCancel(openType) }} />
          )

        }}
      </Spring>
    )

  }

  render() {
    return (
      <div className={styles.root}>

        {/* 前三个菜单的遮罩层 */}
        {
          this.renderMask()
        }

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            HighLight={this.changeTitleSelected}
            titleSelectedStatus={this.state.titleSelectedStatus}
          />
          {/* 前三个菜单对应的内容： */}
          {
            this.renderFilterPicker()
          }
          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
          {
            this.renderFilterMore()
          }
        </div>

      </div>
    )
  }
}
