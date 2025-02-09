import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { getUserData } from '../../services/slices/user';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useSelector(getUserData);
  return <AppHeaderUI userName={user?.name} />;
};
