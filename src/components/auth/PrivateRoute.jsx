import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const { user, loading } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return (
            <div className="container text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          );
        }
        if (!user) {
          return <Redirect to="/login" />;
        }
        if (roles && !roles.includes(user.profile?.role)) {
          return <Redirect to="/" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
