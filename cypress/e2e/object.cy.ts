import { SINVCypressLib } from './lib';
describe('Test the object creator', () => {
    before(() => {
        cy.task('createTestingRepository');
    });

    beforeEach(() => {
        SINVCypressLib.openSubpage('');
        SINVCypressLib.openSession();
        cy.get('header app-input[icon="repository"][type="dropdown"]')
            .click()
            .find('.dropdown-menu')
            .contains('testingRepository')
            .click();
    });
    it('Test the object creator button', () => {
        cy.get('app-button').contains('Create object').click();
        SINVCypressLib.URLShouldBe('/object/new');
    });

    describe('Test input validation', () => {
        let testIdentifier = 'id' + Cypress._.random(0, 1e15);
        let testName = 'name' + Cypress._.random(0, 1e15);
        let testDescription = 'description' + Cypress._.random(0, 1e15);
        let testDescriptionWithNewlines = testDescription.replace(
            /[0-2]/g,
            '{Enter}'
        );
        let testDescriptionWithBreakTags = testDescription.replace(
            /[0-2]/g,
            '<br>'
        );

        beforeEach(() => {
            SINVCypressLib.openSubpage('/object/new');
            getInputByLabel('Identifier').type(testIdentifier);
            getInputByLabel('Label').type(testName);
            getInputByLabel('Description').type(testDescriptionWithNewlines);
            getInputByLabel('Category')
                .click()
                .get('.dropdown-menu')
                .contains('category1')
                .click();
            cy.get('app-button')
                .contains('Create object')
                .parents('.button')
                .as('createButton'); // The button element is used because it is the one that has the .disabled class name
        });

        function getInputByLabel(label: string) {
            return cy
                .get('label')
                .contains(label)
                .parents('.label-input-container')
                .find('app-input');
        }

        it('Test name validation', () => {
            cy.get('@createButton').should('not.have.class', 'disabled');
            getInputByLabel('Identifier').find('input').clear();
            cy.get('@createButton').should('have.class', 'disabled');
        });

        it('Create the test object', () => {
            cy.get('@createButton').click();
            SINVCypressLib.URLShouldBe('/object/view/' + testIdentifier);
            cy.get('body')
                .should('contain', testIdentifier)
                .should('contain', testName)
                .should('contain.html', testDescriptionWithBreakTags)
                .should('contain', 'category1');
        });

        it('Test identifier validation', () => {
            cy.get('body').should(
                'contain.text',
                'This identifier already exists.'
            );
            cy.get('@createButton').should('have.class', 'disabled');
            getInputByLabel('Identifier').type('{backspace}');
            cy.get('body').should(
                'not.contain.text',
                'This identifier already exists.'
            );
            cy.get('@createButton').should('not.have.class', 'disabled');
        });
    });
});
