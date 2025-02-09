import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getUserData, isAuthChecked } from '../../services/slices/user';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isPublic?: boolean;
}

export function ProtectedRoute({ children, isPublic }: ProtectedRouteProps) {
  const location = useLocation();
  const user = useSelector(getUserData);
  const checkUser = useSelector(isAuthChecked);

  if (!checkUser && user !== null) {
    return <Preloader />;
  }

  if (isPublic && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!isPublic && !user) {
    return (
      <Navigate
        replace
        to={'/login'}
        state={{
          form: {
            ...location,
            background: location.state?.background,
            state: null
          }
        }}
      />
    );
  }
  return children;
}
