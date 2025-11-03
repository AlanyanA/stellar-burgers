import { rootReducer } from '../store';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredientUp,
  moveIngredientDown
} from './constructor-slice';
import { TIngredient } from '@utils-types';

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

// юнит тесты конструктора
describe('constructor slice reducers', () => {
  const makeIngredient = (idSuffix: string, type = 'main'): TIngredient => ({
    _id: `ing-${idSuffix}`,
    name: `Ingredient ${idSuffix}`,
    type,
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
    price: 10,
    image: 'img.png',
    image_large: 'img_large.png',
    image_mobile: 'img_mobile.png'
  });

  it('addIngredient: добавляет булку в поле bun', () => {
    const bun = makeIngredient('bun', 'bun');
    const state = constructorReducer(undefined as any, addIngredient(bun));

    expect(state.bun).not.toBeNull();
    expect(state.bun?._id).toBe(bun._id);
    expect(state.ingredients).toHaveLength(0);
  });

  it('addIngredient: добавляет ингредиент в список ingredients (и присваивает id)', () => {
    const ing = makeIngredient('1', 'main');
    const state = constructorReducer(undefined as any, addIngredient(ing));

    expect(state.ingredients).toHaveLength(1);
    const added = state.ingredients[0];
    expect(added._id).toBe(ing._id);
    expect(typeof added.id).toBe('string');
    expect(added.id.length).toBeGreaterThan(0);
  });

  it('removeIngredient: удаляет ингредиент по id', () => {
    const ing1 = makeIngredient('a');
    const ing2 = makeIngredient('b');
    let state = constructorReducer(undefined as any, addIngredient(ing1));
    state = constructorReducer(state, addIngredient(ing2));

    expect(state.ingredients).toHaveLength(2);
    const idToRemove = state.ingredients[0].id;

    state = constructorReducer(state, removeIngredient(idToRemove));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients.find((i) => i.id === idToRemove)).toBeUndefined();
  });

  it('moveIngredientUp / moveIngredientDown: перемещение ингредиентов', () => {
    const a = makeIngredient('a');
    const b = makeIngredient('b');
    const c = makeIngredient('c');

    let state = constructorReducer(undefined as any, addIngredient(a));
    state = constructorReducer(state, addIngredient(b));
    state = constructorReducer(state, addIngredient(c));

    const ids = state.ingredients.map((i) => i.id);
    // порядок: a, b, c
    expect(ids).toHaveLength(3);

    // поднять b вынесем вперед (или вверъ) -> порядок b, a, c
    const bId = state.ingredients[1].id;
    state = constructorReducer(state, moveIngredientUp(bId));
    expect(state.ingredients[0].id).toBe(bId);

    //  b обратно назад -> порядок a, b, c 
    state = constructorReducer(state, moveIngredientDown(bId));
    expect(state.ingredients[1].id).toBe(bId);
  });

  it('clearConstructor: очищает булку и список ингредиентов', () => {
    const bun = makeIngredient('bun', 'bun');
    const ing = makeIngredient('x');
    let state = constructorReducer(undefined as any, addIngredient(bun));
    state = constructorReducer(state, addIngredient(ing));

    expect(state.bun).not.toBeNull();
    expect(state.ingredients.length).toBeGreaterThan(0);

    state = constructorReducer(state, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});
