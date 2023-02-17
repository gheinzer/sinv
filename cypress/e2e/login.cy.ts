import { SINVCypressLib } from './lib';

describe('Login tests', () => {
    beforeEach(() => {
        SINVCypressLib.openSubpage('/login');
        cy.get('app-button')
            .contains('Sign in')
            .parents('app-button')
            .as('loginSubmitButton');
    });

    describe('Login test', () => {
        it('Test redirection from dashboard page', () => {
            SINVCypressLib.openSubpage('');
            cy.url().should('contain', 'login');
        });
        it('Login with the admin account', () => {
            cy.get('input[placeholder="Username"]')
                .should('be.focused')
                .type('admin');
            cy.get('input[placeholder="Password"]').type('admin');
            cy.get('@loginSubmitButton').click();
            cy.url().should('not.contain', 'login');
        });
    });

    describe('Test the input validation', () => {
        it('Test the warning when the user does not exist', () => {
            cy.get('input[placeholder="Username"]').type('invalid username');
            cy.get('body').should(
                'contain.text',
                'The user you are looking for was not found.'
            );
            cy.get('@loginSubmitButton')
                .children()
                .should('have.class', 'disabled');

            SINVCypressLib.openSubpage('/login');
            cy.get('input[placeholder="Username"]').type('admin');
            cy.get('body').should(
                'not.contain.text',
                'The user you are looking for was not found.'
            );
        });

        it('Test the password-empty validation', () => {
            cy.get('input[placeholder="Username"]').type('admin');
            cy.get('@loginSubmitButton')
                .children()
                .should('have.class', 'disabled');
        });

        it('Test the username-empty validation', () => {
            cy.get('input[placeholder="Password"]').type('admin');
            cy.get('@loginSubmitButton')
                .children()
                .should('have.class', 'disabled');
        });
    });
});
