import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuth } from '../../utils'

function AuthRoute({ component: Component, ...rest }) {

  return (
    <Route


      {...rest}
      render={props =>
        isAuth() ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
      }


    />
  );

}

export default AuthRoute