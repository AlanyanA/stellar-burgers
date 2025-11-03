import { rootReducer } from '../store';

describe('RootReducer: начальное состояние слайсов', () => {
  it('инициализирует все части стора начальными значениями', () => {
    const snapshot = rootReducer(undefined, { type: '@@INIT' });

    expect(snapshot.user).toEqual({
      user: null,
      isInit: false,
      isLoading: false,
      error: null
    });

    expect(snapshot.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });

    expect(snapshot.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });

    expect(snapshot.order).toEqual({
      orderModalData: null,
      orderRequest: false,
      orderError: null
    });

    expect(snapshot.feed).toEqual({
      feedData: null,
      isLoading: false,
      error: null
    });

    expect(snapshot.userOrders).toEqual({
      orders: [],
      isLoading: false,
      error: null
    });
  });
});