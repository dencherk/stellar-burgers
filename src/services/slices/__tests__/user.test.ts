import { describe, test } from '@jest/globals';
import { RequestStatus, TUser } from '@utils-types';
import {
  authUser,
  getUser,
  initialState,
  logoutUser,
  registerUser,
  userReducer
} from '../user';

describe('Проверка slices user', () => {
  describe('Проверка getUser', () => {
    test('Проверка getUser pending', () => {
      const action = { type: getUser.pending.type };
      const newState = userReducer(initialState, action);

      expect(newState.RequestStatus).toBe(RequestStatus.Loading);
      expect(newState.data).toEqual(null);
    });

    test('Проверка getUser fulfilled', () => {
      const userPayload = {
        email: 'hello@yandex.ru',
        name: 'Valeriia'
      };
      const action = {
        type: getUser.fulfilled.type,
        payload: userPayload
      };
      const newState = userReducer(initialState, action);

      expect(newState.data).toEqual(userPayload);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.isAuthenticated).toBe(true);
      expect(newState.RequestStatus).toBe(RequestStatus.Success);
    });

    test('Проверка getUser rejected', () => {
      const action = {
        type: getUser.rejected.type,
        meta: { rejectedWithValue: true },
        payload: { message: 'error' },
        error: { message: 'error' }
      };
      const newState = userReducer(initialState, action);

      expect(newState.error).toEqual({ message: 'error' });
      expect(newState.RequestStatus).toEqual(RequestStatus.Failed);
    });
  });

  describe('Проверка registerUser', () => {
    test('Проверка registerUser pending', () => {
      const action = { type: registerUser.pending.type };
      const newState = userReducer(initialState, action);

      expect(newState.RequestStatus).toBe(RequestStatus.Loading);
    });

    test('Проверка registerUser fulfilled', () => {
      const userPayload: TUser = {
        email: 'hello@yandex.ru',
        name: 'Valeriia'
      };
      const action = {
        type: registerUser.fulfilled.type,
        payload: userPayload
      };
      const newState = userReducer(initialState, action);

      expect(newState.data).toEqual(action.payload);
      expect(newState.isAuthenticated).toBe(true);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.RequestStatus).toBe(RequestStatus.Success);
    });

    test('Проверка registerUser rejected', () => {
      const action = {
        type: registerUser.rejected.type
      };
      const newState = userReducer(initialState, action);

      expect(newState.RequestStatus).toBe(RequestStatus.Failed);
    });
  });

  describe('Проверка authUser', () => {
    test('Проверка authUser pending', () => {
      const action = { type: authUser.pending.type };
      const newState = userReducer(initialState, action);

      expect(newState.RequestStatus).toBe(RequestStatus.Loading);
    });

    test('Проверка authUser fulfilled', () => {
      const userPayload: TUser = {
        email: 'hello@yandex.ru',
        name: 'Valeriia'
      };
      const action = {
        type: authUser.fulfilled.type,
        payload: userPayload
      };
      const newState = userReducer(initialState, action);

      expect(newState.data).toEqual(action.payload);
      expect(newState.isAuthenticated).toBe(true);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.RequestStatus).toBe(RequestStatus.Success);
    });

    test('Проверка authUser tejected', () => {
      const action = {
        type: authUser.rejected.type
      };
      const newState = userReducer(initialState, action);

      expect(newState.RequestStatus).toBe(RequestStatus.Failed);
    });
  });

  describe('Проверка logoutUser', () => {
    test('Проверка logoutUser pending', () => {
      const action = { type: logoutUser.pending.type };
      const newState = userReducer(initialState, action);

      expect(newState.RequestStatus).toBe(RequestStatus.Loading);
    });

    test('Проверка logoutUser fulfilled', () => {
      const userPayload: TUser = {
        email: 'hello@yandex.ru',
        name: 'Valeriia'
      };
      const action = {
        type: logoutUser.fulfilled.type,
        payload: userPayload
      };
      const newState = userReducer(initialState, action);

      expect(newState.data).toEqual(null);
      expect(newState.isAuthenticated).toBe(false);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.RequestStatus).toBe(RequestStatus.Success);
    });

    test('Проверка logoutUser rejected', () => {
      const action = { type: logoutUser.rejected.type };
      const newState = userReducer(initialState, action);

      expect(newState.RequestStatus).toBe(RequestStatus.Failed);
    });
  });
});
