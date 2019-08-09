import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

// 导入 formik 组件
import { withFormik, Field, Form, ErrorMessage } from 'formik';

import * as yup from 'yup';

import { API, setToken } from '../../utils'

import NavBar from '../../components/NavBar'

import styles from './index.module.scss'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavBar className={styles.navHeader}>账号登录</NavBar>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>


          <Form>
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            <ErrorMessage name="username" component="div" className={styles.error} />
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            <ErrorMessage name="password" component="div" className={styles.error} />
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </Form>



          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

// 使用 withFormik 高阶组件包装我们自己的 Login 组件
// withFormik() 第一次调用：可以传入一些配置对象
// 第二次调用，再包装组件
Login = withFormik({

  // 为表单提供状态值，相当于原来在 Login 组件 state 中添加的状态
  mapPropsToValues: () => ({ username: '', password: '' }),

  // 表单校验规则：
  validationSchema: yup.object().shape({
    username: yup.string().required('账号为必填项').matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),
    password: yup.string().required('密码为必填项').matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线'),
  }),

  // 为表单提供事件处理程序
  handleSubmit: async (values, { props }) => {
    const { username, password } = values
    // console.log('Fomik 表单提交：', props)
    const res = await API({
      method: 'post',
      url: '/user/login',
      data: {
        username,
        password
      }
    })
    // console.log(res)
    const { status, description, body } = res.data
    //如果成功，保存token(setToken('...'),并返回跳转过来的页面(props.history.go(-1))
    if (status === 200) {
      // setToken
      setToken(body.token)

      // console.log(props, 1111111111111)
      if (props.location.state) {
        props.history.replace(props.location.state.from.pathname)
      } else {
        props.history.go(-1)
      }

    } else {
      //否则，提示登录失败
      Toast.info(description, 2, null, false)
    }

  },

})(Login)

export default Login
