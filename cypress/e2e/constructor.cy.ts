import { burgerTestUrl, modalBoxSelector } from '../support/consts';

const BunName = 'Новая булка HyperDrive';
const MainName = 'Котлета Теллуриевого Жука';
const SauceName = 'Соус SuperNova';

describe('Space Burger Builder (Shuffled Data)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 401,
      body: { success: false, message: 'Unauthorized' }
    });

    cy.intercept('GET', '**/api/ingredients', (req) => {
      req.reply({ fixture: 'ingredients.json' });
    }).as('getIngredients');

    cy.visit(burgerTestUrl);

    cy.wait('@getIngredients', { timeout: 5000 });
  });

  afterEach(() => {
    // Clear only existing cookies and clear localStorage via the app window
    cy.getCookies().then((cookies) => {
      cookies.forEach((c) => cy.clearCookie(c.name));
    });
    cy.window().then((win) => win.localStorage.clear());
  });

  describe('Модальное окно ингредиента', () => {
    it('открытие и закрытие модального окна ингредиента', () => {
      cy.contains(BunName).click();
      cy.get(modalBoxSelector).should('be.visible');
      cy.get('[data-testid="modal-close"]').click();
      cy.get(modalBoxSelector).should('not.exist');
    });

    it('отображение правильного ингредиента в модальном окне', () => {
      cy.contains(BunName).click();
      cy.get(modalBoxSelector)
        .should('contain.text', BunName)
        .should('contain.text', '999')
        .should('contain.text', '55')
        .should('contain.text', '28');
    });
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('добавление булки в конструктор', () => {
      cy.addIngredient(BunName);
      cy.get('[data-testid="constructor-bun-top"]')
        .should('contain.text', BunName)
        .should('not.contain.text', 'Выберите булки');
    });

    it('добавление начинки в конструктор', () => {
      cy.addIngredient(BunName);
      cy.addIngredient(MainName);
      cy.get('[data-testid="constructor-ingredients"]')
        .should('contain.text', 'Жука')
        .should('not.contain.text', 'Выберите начинку');
    });
  });

  describe('Оформление заказа', () => {
    it('неавторизованный пользователь перенаправляется на /login при попытке заказа', () => {
      cy.addIngredient(BunName);
      cy.addIngredient(MainName);
      cy.addIngredient(SauceName);

      cy.get('[data-testid="order-button"]').click();
      cy.url().should('include', '/login');
    });

    it('авторизованный пользователь может оформить заказ', () => {
  cy.setCookie('accessToken', 'mock-access-token');
  cy.window().then((win) => win.localStorage.setItem('refreshToken', 'mock-refresh-token'));

      cy.window().then((win) => {
        (win as any).store.dispatch({
          type: 'user/checkAuth/fulfilled',
          payload: { email: 'test@test.com', name: 'Test User' }
        });
      });

      cy.addIngredient(BunName);
      cy.addIngredient(MainName);
      cy.addIngredient(SauceName);

      cy.get('[data-testid="constructor-bun-top"]').should('exist');

      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');

      cy.get('[data-testid="order-button"]').click();
      cy.wait('@createOrder');

      cy.get(modalBoxSelector).should('be.visible');
      cy.get(modalBoxSelector).contains('54321');
      cy.contains('идентификатор заказа').should('be.visible');
      cy.contains('Ваш заказ начали готовить').should('be.visible');

      cy.get('[data-testid="modal-close"]').click();
      cy.get(modalBoxSelector).should('not.exist');
    });
  });
});