import React from 'react'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';
import axios from 'axios'

import SearchHeader from '../../components/SearchHeader/'

import './index.scss'

import { getCityListData } from '../../utils/index'

import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'

navigator.geolocation.getCurrentPosition(position => {
  // console.log(position)
  // console.log(position.coords.longitude)
  // console.log(position.coords.latitude)
})

export default class Index extends React.Component {
  state = {
    // 定位位置
    curCity: '上海',
    // 最新资讯
    news: [],
    //group数据
    groups: [],
    //nav数据
    navItems: [
      {
        imgSrc: nav1,
        title: '整租',
        path: '/home/house'
      },
      {
        imgSrc: nav2,
        title: '合租',
        path: '/home/house'

      },
      {
        imgSrc: nav3,
        title: '地图找房',
        path: '/map'

      },
      {
        imgSrc: nav4,
        title: '去出租',
        path: '/rent/add'
      }
    ],
    // swiper数据
    data: [],
    imgHeight: 176,
    isSwiperLoading: true
  }

  //  获取最新资讯
  getNews = async () => {
    const res = await axios({
      method: 'get',
      url: 'http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0',
    });
    this.setState({
      news: res.data.body
    })
  }

  //获取group数据请求方法封装
  getGroups = async () => {
    const res = await axios({
      method: 'get',
      url: 'http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0',
    });
    // console.log(res)
    this.setState({
      groups: res.data.body,
    })
  }

  //获取swiper数据请求方法封装
  getSwipers = async () => {
    const res = await axios({
      method: 'get',
      url: 'http://localhost:8080/home/swiper',
    });
    // console.log(res)
    this.setState({
      data: res.data.body,
      isSwiperLoading: false
    })
  }

  // 渲染最新资讯
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }

  //nav行渲染方法封装
  renderNavs = () => {
    return this.state.navItems.map(item => (
      <Flex.Item key={item.imgSrc} onClick={() => this.props.history.push(item.path)}>
        <img src={item.imgSrc} alt="" />
        <p>{item.title}</p>
      </Flex.Item>
    ))
  }

  //swiper渲染方法封装
  renderSwipers = () => {
    return this.state.data.map(val => (
      <a
        key={val.id}
        href="http://www.alipay.com"
        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
      >
        <img
          src={`http://localhost:8080${val.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
          onLoad={() => {
            // fire window resize event to change height
            window.dispatchEvent(new Event('resize'));
            this.setState({ imgHeight: 'auto' });
          }}
        />
      </a>
    ))
  }



  async componentDidMount() {
    //获取swiper数据请求方法调用
    this.getSwipers()
    //获取group数据请求方法调用
    this.getGroups()
    //获取news数据请求方法调用
    this.getNews()
    //获取当前城市方法调用
    const { label } = await getCityListData()
    this.setState({
      curCity: label
    })
  }

  render() {
    return (
      <div id='index'>
        {/* swiper部分 */}
        <div className='swiper'>

          <SearchHeader curCity={this.state.curCity}></SearchHeader>

          {/* 顶部导航部分 */}
          <Flex className='search'>
            <Flex className='search-left'>
              <div className='location' onClick={() => this.props.history.push('/citylist')}>
                <span>{this.state.curCity}</span>
                <i className='iconfont icon-arrow'></i>
              </div>
              <div className='search-form' onClick={() => this.props.history.push('/search')}>
                <i className='iconfont icon-seach'></i>
                <span>请输入小区或地址</span>
              </div>
            </Flex>
            <i className='iconfont icon-map' onClick={() => this.props.history.push('/map')} ></i>
          </Flex>


          {/* 轮播图部分 */}
          {!this.state.isSwiperLoading && <Carousel className='swiper'
            autoplay={true}
            infinite
          // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          // afterChange={index => console.log('slide to', index)}
          >
            {
              // swiper渲染方法调用
              this.renderSwipers()
            }
          </Carousel>}
        </div>

        {/* nav部分 */}
        <Flex className='nav'>
          {
            // nav渲染方法调用
            this.renderNavs()
          }
        </Flex>

        {/* 租房小组部分 */}
        <div className='group'>
          {/* 标题 */}
          <Flex justify='between' className='title'>
            <p>租房小组</p>
            <span>更多</span>
          </Flex>

          {/* 宫格组件 */}
          < Grid
            square={false}
            hasLine={false}
            className='group-item'
            data={this.state.groups}
            columnNum={2}
            renderItem={dataItem => (
              <Flex className='content' justify='between' key={dataItem.id} >
                <div>
                  <p>{dataItem.title}</p>
                  <span>{dataItem.desc}</span>
                </ div >
                <div>
                  <img src={`http://localhost:8080${dataItem.imgSrc}`} alt="" />
                </div >

              </Flex>
            )
            }
          />
        </div >
        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    )
  }
}