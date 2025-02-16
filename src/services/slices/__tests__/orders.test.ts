import { describe, test } from '@jest/globals';
import {
  createOrder,
  getOrder,
  getOrders,
  initialState,
  ordersReducer
} from '../orders';
import { TOrder } from '../../../utils/types';

describe('Проверка slices orders', () => {
  describe('Проверка getOrders', () => {
    test('Проверка getOrders pending', () => {
      const action = { type: getOrders.pending.type };
      const newState = ordersReducer(initialState, action);

      expect(newState.isLoading).toBe(true);
      expect(newState.data).toEqual([]);
    });

    test('Проверка getOrders fulfilled', () => {
      const ordersAdded: TOrder[] = [
        {
          _id: '678fc65a133acd001be4bd3e',
          status: 'done',
          name: 'Краторный био-марсианский бургер',
          createdAt: '2025-01-21T16:07:54.684Z',
          updatedAt: '2025-01-21T16:07:55.504Z',
          number: 3,
          ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
        },
        {
          _id: '789fc65a133acd001be4bd3e',
          status: 'done',
          name: 'Краторный био-марсианский бургер',
          createdAt: '2025-01-21T16:07:54.684Z',
          updatedAt: '2025-01-21T16:07:55.504Z',
          number: 5,
          ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
        }
      ];

      const action = {
        type: getOrders.fulfilled.type,
        payload: ordersAdded
      };
      const newState = ordersReducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.data).toEqual(ordersAdded);
    });

    test('Проверка getOrders rejected', () => {
      const action = { type: getOrders.rejected.type };
      const newState = ordersReducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.data).toEqual([]);
    });
  });

  describe('Проверка getOrder', () => {
    test('Проверка getOrder pending', () => {
      const action = { type: getOrder.pending.type };
      const newState = ordersReducer(initialState, action);

      expect(newState.isLoading).toBe(true);
      expect(newState.data).toEqual([]);
    });

    test('Проверка getOrder fulfilled', () => {
      const orderAdded = {
        order: {
          _id: '789fc65a133acd001be5bd3e',
          status: 'doneDone',
          name: 'Краторный био-марсианский бургер',
          createdAt: '2025-01-21T16:07:54.684Z',
          updatedAt: '2025-01-21T16:07:55.504Z',
          number: 2,
          ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
        }
      };
      const action = {
        type: createOrder.fulfilled.type,
        payload: orderAdded
      };
      const newState = ordersReducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.data).toEqual([action.payload.order]);
    });

    test('Проверка getOrder rejected', () => {
      const action = { type: createOrder.rejected.type };
      const newState = ordersReducer(initialState, action);

      expect(newState.isLoading).toBe(false);
    });
  });

  describe('Проверка createOrder', () => {
    test('Проверка createOrder pending', () => {
      const action = { type: createOrder.pending.type };
      const newState = ordersReducer(initialState, action);

      expect(newState.isLoading).toBe(true);
      expect(newState.orderRequest).toBe(true);
    });

    test('Проверка createOrder fulfilled', () => {
      const orderAdded = {
        order: {
          _id: '789fc65a133acd001be5bd3e',
          status: 'doneDone',
          name: 'Краторный био-марсианский бургер',
          createdAt: '2025-01-21T16:07:54.684Z',
          updatedAt: '2025-01-21T16:07:55.504Z',
          number: 2,
          ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
        }
      };

      const action = {
        type: createOrder.fulfilled.type,
        payload: orderAdded
      };
      const newState = ordersReducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.orderModalData).toEqual(action.payload.order);
      expect(newState.data).toEqual([action.payload.order]);
      expect(newState.orderRequest).toBe(false);
    });

    test('Проверка createOrder rejected', () => {
      const action = {
        type: createOrder.rejected.type
      };
      const newState = ordersReducer(initialState, action);

      expect(newState.isLoading).toBe(false);
    });
  });
});
