import { describe, test } from '@jest/globals';
import {
  getIngredients,
  ingredientsReducer,
  initialState
} from '../ingredients';

describe('Проверка slices ingredients', () => {
  const ingredientsAdded = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      id: 'id'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      id: 'id2'
    }
  ];
  test('Проверка getIngredients pending', () => {
    const action = { type: getIngredients.pending.type };
    const newState = ingredientsReducer(initialState, action);

    expect(newState.isLoading).toBe(true);
    expect(newState.ingredients).toEqual([]);
  });

  test('Проверка getIngredients fulfilled', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: ingredientsAdded
    };
    const newState = ingredientsReducer(initialState, action);

    expect(newState.isLoading).toBe(false);
    expect(newState.ingredients).toEqual(ingredientsAdded);
  });

  test('Проверка getIngredients rejected', () => {
    const action = { type: getIngredients.rejected.type };
    const newState = ingredientsReducer(initialState, action);

    expect(newState.isLoading).toBe(false);
    expect(newState.ingredients).toEqual([]);
  });
});
