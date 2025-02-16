import { describe, test } from '@jest/globals';
import { feedReducer, getFeeds, initialState } from '../feeds';

describe('Проверка slices feeds', () => {
  const feedsAdded = {
    orders: [
      {
        isLoading: false,
        orderModalData: null,
        orderRequest: false,
        data: null
      },
      {
        isLoading: false,
        orderModalData: null,
        orderRequest: false,
        data: null
      }
    ],
    total: 100,
    totalToday: 50
  };
  test('Проверка getFeeds pending', () => {
    const action = { type: getFeeds.pending.type };
    const newState = feedReducer(initialState, action);

    expect(newState.isLoading).toBe(true);
    expect(newState.orders).toEqual([]);
    expect(newState.total).toEqual(0);
    expect(newState.totalToday).toEqual(0);
  });

  test('Проверка getFeeds fulfilled', () => {
    const action = {
      type: getFeeds.fulfilled.type,
      payload: feedsAdded
    };
    const newState = feedReducer(initialState, action);

    expect(newState.isLoading).toBe(false);
    expect(newState.orders).toEqual(feedsAdded.orders);
    expect(newState.total).toEqual(feedsAdded.total);
    expect(newState.totalToday).toEqual(feedsAdded.totalToday);
  });

  test('Проверка getFeeds rejected', () => {
    const action = { type: getFeeds.rejected.type };
    const newState = feedReducer(initialState, action);

    expect(newState.isLoading).toBe(false);
    expect(newState.orders).toEqual([]);
    expect(newState.total).toBe(0);
    expect(newState.totalToday).toBe(0);
  });
});
