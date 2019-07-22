import React from 'react'
import { Route } from "react-router-dom"
import Index from '../Index'
import Profile from '../Profile'
import HouseList from '../HouseList'
import News from '../News'
import { TabBar } from 'antd-mobile';
import './index.scss'
// const tabItems = [
//   {
//     title: '首页',
//     icon: 'icon-ind',
//     path: '/home'
//   },
//   {
//     title: '找房',
//     icon: 'inco-findHouse',
//     path: '/home/house'
//   },
//   {
//     title: '资讯',
//     icon: 'icon-infom',
//     path: '/home/news'
//   },
//   {
//     title: '我的',
//     icon: 'icon-my',
//     path: '/home/profile'
//   }
// ]
export default class Home extends React.Component {
  state = {
    selectedTab: this.props.location.pathname,
    fullScreen: true,
    tabItems: [
      {
        title: '首页',
        icon: 'icon-ind',
        path: '/home'
      },
      {
        title: '找房',
        icon: 'icon-findHouse',
        path: '/home/house'
      },
      {
        title: '资讯',
        icon: 'icon-infom',
        path: '/home/news'
      },
      {
        title: '我的',
        icon: 'icon-my',
        path: '/home/profile'
      }
    ]
  };

  componentDidUpdate(prevProps) {
    // 典型用法（不要忘记比较 props）：
    // console.log('preprops', prevProps)
    // console.log('this.props', this.props)
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname,
      })
    }
  }
  render() {
    // console.log(this.props)

    return (
      <div id='home'>
        <div className='tabbar'>
          <TabBar
            unselectedTintColor="#949494"
            tintColor="#21b97a"
            barTintColor="white"
          >
            {
              this.state.tabItems.map(item => (
                <TabBar.Item
                  title={item.title}
                  key={item.title}
                  icon={
                    <i className={`iconfont ${item.icon}`}></i>
                  }
                  selectedIcon={<i className={`iconfont ${item.icon}`}></i>
                  }
                  selected={this.state.selectedTab === item.path}
                  onPress={() => {
                    this.props.history.push(item.path)
                  }}
                  data-seed="logId"
                >
                </TabBar.Item>
              ))
            }


          </TabBar>
        </div>
        <Route exact path="/home" component={Index}></Route>
        <Route path="/home/profile" component={Profile}></Route>
        <Route path="/home/house" component={HouseList}></Route>
        <Route path="/home/news" component={News}></Route>
      </div>
    )
  }
}