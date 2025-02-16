import { BASE_URL, testUrl } from '../../src/utils/urlTest';

describe('Перехват запроса на эндпоинт ingredients', () => {
  beforeEach(() => {
    cy.intercept('GET', `${BASE_URL}/ingredients`, {
      fixture: 'ingredients'
    });
    cy.visit(`${testUrl}`);
  });
  describe('Проверка сбора бургера', () => {
    it('Проверка добавления одного игредиента', () => {
      cy.contains('li', 'Флюоресцентная булка R2-D3').find('button').click();
      cy.contains('span', 'Флюоресцентная булка R2-D3').should('exist');
    });

    it('Проверка добавления нескольких ингредиентов', () => {
      cy.contains('li', 'Флюоресцентная булка R2-D3').find('button').click();

      cy.contains('div', 'Начинки').click();
      cy.contains('li', 'Филе Люминесцентного тетраодонтимформа')
        .find('button')
        .click();
      cy.contains('li', 'Хрустящие минеральные кольца').find('button').click();
      cy.contains('li', 'Сыр с астероидной плесенью').find('button').click();
    });

    it('Проверка смена булки', () => {
      cy.contains('li', 'Краторная булка N-200i').find('button').click();
      cy.contains('li', 'Флюоресцентная булка R2-D3').find('button').click();

      cy.contains('span', 'Флюоресцентная булка R2-D3');
      cy.contains('span', 'Краторная булка N-200i').should('not.exist');
    });
  });

  describe('Проверка работы модальных окон', () => {
    it('Проверка открытия модального окна ингредиента', () => {
      cy.contains('li', 'Мясо бессмертных моллюсков Protostomia').click();
      cy.wait(1000);

      const modal = cy.get(`[data-cy=modal]`);
      modal.should('exist');

      const close = cy.get(`[data-cy=modal-close]`);
      close.should('exist');

      modal.contains('h3', 'Детали ингредиента');
      cy.contains('h3', 'Мясо бессмертных моллюсков Protostomia');
    });

    it('Проверка закрытия модального окна ингредиентов по клику', () => {
      cy.contains('li', 'Мясо бессмертных моллюсков Protostomia').click();

      const modal = cy.get(`[data-cy=modal]`);
      modal.should('exist');

      const close = cy.get(`[data-cy=modal-close]`);
      close.should('exist');

      modal.contains('h3', 'Детали ингредиента');

      close.click();
      modal.should('not.exist');
    });

    it('Проверка закрытия модального окна ингредиентов по клавише esc', () => {
      cy.contains('li', 'Мясо бессмертных моллюсков Protostomia').click();

      const modal = cy.get(`[data-cy=modal]`);
      modal.should('exist');

      cy.get('body').type('{esc}');

      cy.get(`[data-cy=modal]`).should('not.exist');
    });
  });

  describe('Проверка создания заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', `${BASE_URL}/auth/user`, {
        fixture: 'user.json'
      });

      cy.intercept('POST', `${BASE_URL}/orders`, {
        fixture: 'order.json'
      }).as('createOrder');

      cy.setCookie('token', 'token');
      window.localStorage.setItem('token', 'token');
    });

    it('Проверка создания заказа', () => {
      cy.contains('li', 'Краторная булка N-200i').find('button').click();

      cy.contains('div', 'Начинки').click();
      cy.contains('li', 'Филе Люминесцентного тетраодонтимформа')
        .find('button')
        .click();
      cy.contains('div', 'Соусы').click();
      cy.contains('li', 'Соус фирменный Space Sauce').find('button').click();

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      const modal = cy.get(`[data-cy=modal]`);
      modal.should('exist');
      const close = cy.get(`[data-cy=modal-close]`);
      close.should('exist');

      cy.contains('p', 'идентификатор заказа');
      cy.contains('p', 'Ваш заказ начали готовить');
      cy.contains('h2', '68568').should('exist');
      cy.contains('p', 'Дождитесь готовности на орбитальной станции');

      close.click();
      cy.contains('p', 'идентификатор заказа').should('not.exist');
      cy.contains('p', 'Ваш заказ начали готовить').should('not.exist');
      cy.contains('h2', '68568').should('not.exist');
      cy.contains('p', 'Дождитесь готовности на орбитальной станции').should(
        'not.exist'
      );
    });

    afterEach(() => {
      cy.clearCookie('token');
      window.localStorage.removeItem('token');
    });
  });
});
