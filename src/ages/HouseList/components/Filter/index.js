import React from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

const titleSelectedStatus = {
  // false 表示不亮；true 表示高亮
  area: false,
  mode: false,
  price: false,
  more: false
}

export default class Filter extends React.Component {
  state = {
    titleSelectedStatus,
    openType: ''
  }

  changeTitleSelected = type => {

    console.log(type)


    for (let k in this.state.titleSelectedStatus) {
      this.state.titleSelectedStatus[k] = false
    }

    this.setState({
      titleSelectedStatus: { ...this.state.titleSelectedStatus, [type]: true },
      openType: type
    })
  }

  onCancel = () => {
    this.setState({
      titleSelectedStatus: { ...titleSelectedStatus },
      openType: ''
    })
  }

  onSave = () => {
    this.setState({
      openType: ''
    })
  }

  render() {
    return (
      <div className={styles.root}>

        {/* 前三个菜单的遮罩层 */}
        {/* <div className={styles.mask} /> */}

        {
          (this.state.openType === 'area' || this.state.openType === 'mode' || this.state.openType === 'price') ? <div className={styles.mask} onClick={this.onCancel} /> : null
        }



        <div className={styles.content}>

          {/* 标题栏 */}
          <FilterTitle
            HighLight={this.changeTitleSelected}
            titleSelectedStatus={this.state.titleSelectedStatus}
          />

          {/* 前三个菜单对应的内容： */}

          {
            this.state.openType === 'area' || this.state.openType === 'mode' || this.state.openType === 'price' ? <FilterPicker onCancel={this.onCancel} onSave={this.onSave} /> : null
          }

          {/* 前三个菜单对应的内容： */}
          {/* {openType === 'area' ||
            openType === 'mode' ||
            openType === 'price' ? (
              <FilterPicker onCancel={this.onCancel} onSave={this.onSave} />
            ) : null} */}




          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}

          {
            this.state.openType === 'more' ? <FilterMore onCancel={this.onCancel} onSave={this.onSave} /> : null
          }


        </div>

      </div>
    )
  }
}
