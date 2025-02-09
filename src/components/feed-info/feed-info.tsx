import { FC } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import {
  getAllFeeds,
  getTotal,
  getTotalToday
} from '../../services/slices/feeds';
import { getIsLoading } from '../../services/slices/orders';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const orders: TOrder[] = useSelector(getAllFeeds);
  const feed = {
    total: useSelector(getTotal),
    totalToday: useSelector(getTotalToday)
  };
  const isLoading = useSelector(getIsLoading);

  if (isLoading) {
    return <Preloader />;
  }

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
