import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getAllFeeds,
  getFeeds,
  getIsLoading
} from '../../services/slices/feeds';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const fetchFeeds = useCallback(() => dispatch(getFeeds()), [dispatch]);
  const isLoading = useSelector(getIsLoading);

  useEffect(() => {
    fetchFeeds();
  }, [dispatch]);
  const orders: TOrder[] = useSelector(getAllFeeds);

  if (isLoading) {
    return <Preloader />;
  }
  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        fetchFeeds;
      }}
    />
  );
};
