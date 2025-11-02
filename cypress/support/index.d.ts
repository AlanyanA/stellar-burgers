declare namespace Cypress {
  interface Chainable {
    addIngredient(ingredientName: string): Chainable<void>
    closeModal(): Chainable<void>
    checkConstructorCleared(): Chainable<void>
    loginUser(): Chainable<void>
    createOrder(): Chainable<void>;
  }
}