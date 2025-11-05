Cypress.Commands.add('addIngredient', (ingredientLabel) => {
  cy.contains(ingredientLabel)
    .scrollIntoView()
    .parents('li')
    .first()
    .within(() => {
      cy.contains('button', 'Добавить', { timeout: 10000 })
        .scrollIntoView()
        .click();
    });
});

// Закрыть модальное окно
Cypress.Commands.add('closeModal', () => {
  cy.get('[data-testid="modal-close"]').click();
  cy.get('[data-testid="modal"]').should('not.exist');
});

// Очистить конструктор
Cypress.Commands.add('verifyConstructorReset', () => {
  cy.contains('Выберите начинку').should('exist');
  cy.contains('Выберите булки').should('exist');
  cy.get('[data-testid="constructor-bun-top"]').should('not.exist');
});

// Создать заказ
Cypress.Commands.add('submitOrder', (num = 12345) => {
  cy.intercept('POST', '**/api/orders', {
    statusCode: 200,
    body: {
      success: true,
      order: { number: num }
    }
  }).as('submitOrder');

  cy.get('[data-testid="order-button"]').click();
  cy.wait('@submitOrder');
});

// Авторизация пользователя
Cypress.Commands.add('authenticateUser', () => {
  cy.intercept('GET', '**/api/auth/user', {
    statusCode: 200,
    body: {
      success: true,
      user: { email: 'test@test.com', name: 'Test User' }
    }
  }).as('authRequest');

  cy.setCookie('accessToken', 'mock-access-token');
  cy.window().then((win) => win.localStorage.setItem('refreshToken', 'mock-refresh-token'));
  cy.visit('/profile');
  cy.wait('@authRequest');
  cy.visit('/');
});