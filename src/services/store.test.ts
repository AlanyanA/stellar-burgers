import { rootReducer } from './store';

describe('rootReducer initialization', () => {
  it('should initialize all slices with their default state', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state.user).toEqual({
      user: null,
      isInit: false,
      isLoading: false,
      error: null
    });

    expect(state.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });

    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });

    expect(state.order).toEqual({
      orderModalData: null,
      orderRequest: false,
      orderError: null
    });

    expect(state.feed).toEqual({
      feedData: null,
      isLoading: false,
      error: null
    });

    expect(state.userOrders).toEqual({
      orders: [],
      isLoading: false,
      error: null
    });
  });
});
