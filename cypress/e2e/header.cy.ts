import { SINVCypressLib } from './lib';

describe('Test the header', () => {
    beforeEach(() => {
        SINVCypressLib.openSubpage('/');
    });

    it('Test the header when not logged in', () => {
        cy.get('app-header')
            .should('contain.text', 'Sign in')
            .should('not.contain.html', 'app-input');
    });

    it('Test the header when logged in', () => {
        SINVCypressLib.openSession();
        cy.get('app-header')
            .should('not.contain.text', 'Sign in')
            .should('contain.html', 'app-input')
            .should('contain.text', 'admin');
    });

    describe('Test user badge navigation', () => {
        beforeEach(() => {
            SINVCypressLib.openSession();
            cy.get('app-user-badge .badge-menu').as('userBadgeMenu');
        });

        it('Test if the menu opens', () => {
            cy.get('app-user-badge .badge-menu').should('not.be.visible');
            cy.get('app-user-badge')
                .click()
                .get('.badge-menu')
                .should('be.visible');

            cy.get('@userBadgeMenu').contains('Settings').click();
        });

        it('Test settings link', () => {
            cy.get('@userBadgeMenu')
                .contains('Settings')
                .click({ force: true });
            cy.url().should('contain', 'settings');
        });

        it('Test repo settings link', () => {
            cy.get('@userBadgeMenu')
                .contains('Repository settings')
                .click({ force: true });
            cy.url().should('contain', 'repo-settings');
        });

        it('Test admin settings link', () => {
            cy.get('@userBadgeMenu')
                .contains('Admin settings')
                .click({ force: true });
            cy.url().should('contain', 'admin-settings');
        });

        it('Test logout', () => {
            cy.get('@userBadgeMenu')
                .contains('Sign out')
                .click({ force: true });
            cy.url().should('contain', 'login');
        });
    });
});
