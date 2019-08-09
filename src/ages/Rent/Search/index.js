import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { getCity, API } from '../../../utils'

import styles from './index.module.css'

export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value

  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li
        key={item.community}
        className={styles.tip}
        onClick={this.handleClick.bind(this, item)}
      >
        {item.communityName}
      </li>
    ))
  }

  // 获取小区信息，返回发布房源页面
  handleClick = ({ community, communityName }) => {
    // console.log(community, communityName)

    // 第二个参数：表示给路由跳转添加的额外参数
    this.props.history.replace('/rent/add', {
      community,
      communityName
    })
  }


  // 根据关键词搜索小区信息
  handleSearchTxt = val => {
    // if (val.trim() === '') {
    //   // 输入内容为空
    //   return this.setState({
    //     tipsList: [],
    //     searchTxt: ''
    //   })
    // }

    this.setState({
      searchTxt: val
    })

    // this.search(val)

    clearTimeout(this.timerId)
    this.timerId = setTimeout(async () => {
      // 发送请求获取小区数据
      const res = await API.get('/area/community', {
        params: {
          name: val,
          id: this.cityId
        }
      })
      // console.log('小区列表：', res)

      const { body } = res.data
      this.setState({
        tipsList: body.map(item => ({
          community: item.community,
          communityName: item.communityName
        }))
      })
    }, 500)
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
          onChange={this.handleSearchTxt}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
