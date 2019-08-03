import React, { Component, createRef } from 'react'

import styles from './index.module.scss'

class Sticky extends Component {

  contentRef = createRef()

  placeholderRef = createRef()

  handleScroll = () => {

    const { height } = this.props

    const contentEl = this.contentRef.current

    const placeholderEl = this.placeholderRef.current

    const { top } = placeholderEl.getBoundingClientRect()

    if (top < 0) {
      placeholderEl.style.height = `${height}px`
      contentEl.classList.add(styles.fix)
    } else {
      placeholderEl.style.height = '0px'
      contentEl.classList.remove(styles.fix)
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll)
  }

  render() {
    return (
      <div>
        {/* 占位符 */}
        <div ref={this.placeholderRef}></div>
        {/* 内容 */}
        <div ref={this.contentRef}> {this.props.children}</div>
      </div >
    )
  }
}

export default Sticky
