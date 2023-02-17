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
});
