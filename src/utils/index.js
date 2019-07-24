import axios from 'axios'

//导入city API
import { getCity, setCity } from './city'

//使用promise解决回调问题
const getCityListData = () => {
  // debugger
  const curCity = getCity()
  if (!curCity) {
    return new Promise((resolve, reject) => {
      try {
        const myCity = new window.BMap.LocalCity();
        myCity.get(async result => {
          console.log('百度api根据ip定位当前城市', result)
          const { data: { body: { label, value } } } = await axios({
            method: 'get',
            url: 'http://localhost:8080/area/info',
            data: {
              name: result.name
            }
          });
          console.log('当前城市信息:', label, value)
          setCity({ label, value })
          resolve({ label, value })
        })
      } catch (e) {
        reject(e)
      }
    })
  } else {
    return Promise.resolve(curCity)
  }
}


// //使用回调函数的形式
// const getCityListData = (callback) => {
//   const curCity = JSON.parse(localStorage.getItem('hkzf_city'))
//   if (!curCity) {
//     var cityName
//     function myFun(result) {
//       cityName = result.name;
//     }
//     const myCity = new window.BMap.LocalCity();
//     myCity.get(myFun);
//     callback(cityName)

//   } else {
//     return curCity
//   }
// }

export { getCityListData, getCity, setCity }
