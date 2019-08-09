import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import Home from './ages/Home'
import Map from './ages/Map'
import CityList from './ages/CityList'
import Details from './ages/Details'
import Login from './ages/Login'

import AuthRoute from './components/AuthRoute'

import Rent from './ages/Rent'
import RentAdd from './ages/Rent/Add'
import RentSearch from './ages/Rent/Search'



export default class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="app">
          <Route exact path="/" render={() => (
            <Redirect to="/home"></Redirect>
          )}></Route>
          <Route path='/home' component={Home}></Route>
          <Route path="/map" component={Map}></Route>
          <Route path="/citylist" component={CityList}></Route>
          <Route path='/details/:id' component={Details}></Route>
          <Route path="/login" component={Login}></Route>

          <AuthRoute exact path="/rent" component={Rent}></AuthRoute>
          <AuthRoute path="/rent/add" component={RentAdd}></AuthRoute>
          <AuthRoute path="/rent/search" component={RentSearch}></AuthRoute>

        </div>
      </Router>
    )
  }
}