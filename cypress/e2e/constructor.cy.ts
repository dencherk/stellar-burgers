import { BASE_URL, testUrl } from '../../src/utils/urlTest';

const SELECTORS = {
  bunR2D3: 'Флюоресцентная булка R2-D3',
  bunN200i: 'Краторная булка N-200i',
  ingredientMeat: 'Мясо бессмертных моллюсков Protostomia',
  ingredientFish: 'Филе Люминесцентного тетраодонтимформа',
  ingredientRings: 'Хрустящие минеральные кольца',
  ingredientCheese: 'Сыр с астероидной плесенью',
  sauceSpace: 'Соус фирменный Space Sauce',
  sectionFillings: 'Начинки',
  sectionSauces: 'Соусы',
  modal: '[data-cy=modal]',
  modalClose: '[data-cy=modal-close]',
  orderButton: 'Оформить заказ',
};

describe('Перехват запроса на эндпоинт ingredients', () => {
  beforeEach(() => {
    cy.intercept('GET', `/ingredients`, { fixture: 'ingredients' });
    cy.visit(`${testUrl}`);
  });

  describe('Проверка сбора бургера', () => {
    it('Проверка добавления одного ингредиента', () => {
      cy.contains('li', SELECTORS.bunR2D3).find('button').click();
      cy.contains('span', SELECTORS.bunR2D3).should('exist');
    });

    it('Проверка добавления нескольких ингредиентов', () => {
      cy.contains('li', SELECTORS.bunR2D3).find('button').click();

      cy.contains('div', SELECTORS.sectionFillings).click();
      cy.contains('li', SELECTORS.ingredientFish).find('button').click();
      cy.contains('li', SELECTORS.ingredientRings).find('button').click();
      cy.contains('li', SELECTORS.ingredientCheese).find('button').click();
    });

    it('Проверка смены булки', () => {
      cy.contains('li', SELECTORS.bunN200i).find('button').click();
      cy.contains('li', SELECTORS.bunR2D3).find('button').click();

      cy.contains('span', SELECTORS.bunR2D3);
      cy.contains('span', SELECTORS.bunN200i).should('not.exist');
    });
  });

  describe('Проверка работы модальных окон', () => {
    it('Проверка открытия модального окна ингредиента', () => {
      cy.contains('li', SELECTORS.ingredientMeat).click();
      cy.wait(1000);

      cy.get(SELECTORS.modal).should('exist');
      cy.get(SELECTORS.modalClose).should('exist');

      cy.get(SELECTORS.modal).contains('h3', 'Детали ингредиента');
      cy.contains('h3', SELECTORS.ingredientMeat);
    });

    it('Проверка закрытия модального окна ингредиентов по клику', () => {
      cy.contains('li', SELECTORS.ingredientMeat).click();

      cy.get(SELECTORS.modal).should('exist');
      cy.get(SELECTORS.modalClose).should('exist');

      cy.get(SELECTORS.modal).contains('h3', 'Детали ингредиента');

      cy.get(SELECTORS.modalClose).click();
      cy.get(SELECTORS.modal).should('not.exist');
    });

    it('Проверка закрытия модального окна ингредиентов по клавише esc', () => {
      cy.contains('li', SELECTORS.ingredientMeat).click();

      cy.get(SELECTORS.modal).should('exist');
      cy.get('body').type('{esc}');

      cy.get(SELECTORS.modal).should('not.exist');
    });
  });

  describe('Проверка создания заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', `api/auth/user`, { fixture: 'user.json' });
      cy.intercept('POST', `api/orders`, { fixture: 'order.json' }).as('createOrder');

      cy.setCookie('token', 'token');
      window.localStorage.setItem('token', 'token');
    });

    it('Проверка создания заказа', () => {
      cy.contains('li', SELECTORS.bunN200i).find('button').click();

      cy.contains('div', SELECTORS.sectionFillings).click();
      cy.contains('li', SELECTORS.ingredientFish).find('button').click();
      cy.contains('div', SELECTORS.sectionSauces).click();
      cy.contains('li', SELECTORS.sauceSpace).find('button').click();

      cy.contains('button', SELECTORS.orderButton).click();
      cy.wait('@createOrder');

      cy.get(SELECTORS.modal).should('exist');
      cy.get(SELECTORS.modalClose).should('exist');

      cy.contains('p', 'идентификатор заказа');
      cy.contains('p', 'Ваш заказ начали готовить');
      cy.contains('h2', '68568').should('exist');
      cy.contains('p', 'Дождитесь готовности на орбитальной станции');

      cy.get(SELECTORS.modalClose).click();
      cy.contains('p', 'идентификатор заказа').should('not.exist');
      cy.contains('p', 'Ваш заказ начали готовить').should('not.exist');
      cy.contains('h2', '68568').should('not.exist');
      cy.contains('p', 'Дождитесь готовности на орбитальной станции').should('not.exist');
    });

    afterEach(() => {
      cy.clearCookie('token');
      window.localStorage.removeItem('token');
    });
  });
});
