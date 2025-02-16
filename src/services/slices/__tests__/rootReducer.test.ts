import { describe, test } from '@jest/globals';
import { rootReducer, store } from '../../store';

describe('Проверка rootReducer', () => {
  test('Проверка правильности инициализации rootReducer', () => {
    const initialState = rootReducer(undefined, { type: 'test rootReducer' });
    expect(initialState).toEqual(store.getState());
  });
});
