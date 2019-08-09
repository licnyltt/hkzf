import React from 'react'

import { Modal } from 'antd-mobile'

const Modalalert = (props) => {
  return (

    Modal.alert('提示', `${props.info}`, [
      { text: '取消' },
      {
        text: '确定',
        onPress: () =>
          this.props.history.push('/login', {
            // 第二个参数：表示路由状态对象，用来给路由添加一些额外信息
            from: this.props.location
          })
      },
    ])

  )

}

export default Modalalert