import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, loggedIn, ...rest }) => {
  return loggedIn ? <Component {...rest} /> : <Navigate to="/signin" />;
};


export default ProtectedRoute;