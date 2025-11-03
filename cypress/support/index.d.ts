declare namespace Cypress {
  interface Chainable {
    addIngredient(ingredientLabel: string): Chainable<void>
    closeModal(): Chainable<void>
    verifyConstructorReset(): Chainable<void>
    authenticateUser(): Chainable<void>
    submitOrder(): Chainable<void>;
  }
}