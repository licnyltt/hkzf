import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {

  state = {
    selectedValues: this.props.defaultValue
  }

  handleChange = (id) => {
    const { selectedValues } = this.state
    let newSelectedValues = [...selectedValues]
    if (newSelectedValues.indexOf(id) !== -1) {
      newSelectedValues = newSelectedValues.filter(item => item !== id)
    } else {
      newSelectedValues.push(id)
    }
    this.setState({
      selectedValues: newSelectedValues
    })
  }

  // 渲染标签
  renderFilters = data => {
    // console.log(data)
    // 高亮类名： styles.tagActive

    const { selectedValues } = this.state

    return (
      // <span className={[styles.tag, styles.tagActive].join(' ')}>东北</span>
      data.map(item => {
        const isSelected = selectedValues.indexOf(item.value) !== -1
        // <span key={item.value} className={[styles.tag, styles.tagActive].join(' ')}>{item.label}</span>
        return (<span
          key={item.value}

          className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')}

          onClick={() => this.handleChange(item.value)}
        >
          {item.label}
        </span>)
      })
    )
  }

  render() {
    const { data: { characteristic, floor, oriented, roomType }, type, onCancel } = this.props
    const { selectedValues } = this.state
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={() => { onCancel(type) }} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          onCancel={() => this.setState({ selectedValues: [] })}
          onSave={() => { this.props.onSave(type, selectedValues) }}
          cancelText="清除"
        />
      </div>
    )
  }
}
