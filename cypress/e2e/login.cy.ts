import { SINVCypressLib } from './lib';

describe('Login test', () => {
    it('Test redirection from dashboard page', () => {
        SINVCypressLib.openSubpage('');
        cy.url().should('contain', 'login');
    });
    it('Login normally', () => {
        SINVCypressLib.openSubpage('/login');
        cy.get('input[placeholder="Username"]').type('admin');
        cy.get('input[placeholder="Password"]').type('admin');
        cy.get('app-button').contains('Sign in').click();
        cy.url().should('not.contain', 'login');
    });
});
