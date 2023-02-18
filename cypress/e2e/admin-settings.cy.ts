import { SINVCypressLib } from './lib';

describe('Test header settings', () => {
    beforeEach(() => {
        SINVCypressLib.openSession();
        SINVCypressLib.openSubpage('/admin-settings');
    });

    describe('Test repository settings', () => {
        let testingRepositoryID = Cypress._.random(0, 1e15).toString();
        let testingRepositoryName = `testRepositoryName:${testingRepositoryID}`;
        let testingRepositoryDescription = `testRepositoryDescription:${testingRepositoryID}`;

        it('Test repository creation', () => {
            cy.get('app-button').contains('Create repository').click();
            cy.get('app-button')
                .contains('Save')
                .parents('app-button')
                .as('saveButton')
                .children()
                .should('have.class', 'disabled');
            cy.get('app-input input[placeholder="Label"]').type(
                testingRepositoryName
            );
            cy.get('app-input textarea[placeholder="Description"]').type(
                testingRepositoryDescription
            );
            cy.get('@saveButton').click();

            cy.get('body')
                .should('contain.text', testingRepositoryName)
                .should('contain.text', testingRepositoryDescription);
        });

        describe('Test repository editing', () => {
            beforeEach(() => {
                cy.get('.repository')
                    .contains(testingRepositoryDescription)
                    .parents('.repository')
                    .as('repositoryListEntry');
                cy.get('@repositoryListEntry').click();
                cy.get('app-input input[placeholder="Label"]').as('nameInput');
                cy.get('app-input textarea[placeholder="Description"]').as(
                    'descriptionInput'
                );
                cy.get('app-button')
                    .contains('Save')
                    .parents('app-button')
                    .as('saveButton');
            });

            it('Test name change', () => {
                let reversedRepositoryName = testingRepositoryName
                    .split('')
                    .reverse()
                    .join('');
                cy.get('@nameInput').clear().type(
                    reversedRepositoryName // Reverses the string and inserts it into the input
                );
                cy.get('@saveButton').click();

                cy.get('.repository').contains(reversedRepositoryName).click();
                cy.get('@nameInput').clear().type(testingRepositoryName);
                cy.get('@saveButton').click();
            });

            it('Test description change', () => {
                let reversedRepositoryDescription = testingRepositoryDescription
                    .split('')
                    .reverse()
                    .join('');
                cy.get('@descriptionInput').clear().type(
                    reversedRepositoryDescription // Reverses the string and inserts it into the input
                );
                cy.get('@saveButton').click();

                cy.get('.repository')
                    .contains(reversedRepositoryDescription)
                    .click();
                cy.get('@descriptionInput')
                    .clear()
                    .type(testingRepositoryDescription);
                cy.get('@saveButton').click();
            });

            it('Test input validation', () => {
                SINVCypressLib.createRepositoryIfNotExists('testingRepository');
                cy.reload();
                cy.contains(testingRepositoryDescription).click();
                cy.get('@nameInput').clear();
                cy.get('body').should('contain.text', 'Please enter a name');
                cy.get('@nameInput').clear().type('testingRepository');
                cy.get('body').should(
                    'contain.text',
                    'This name is already used'
                );
            });

            it('Test permission editing', () => {
                cy.contains('Manage permissions').click();
                cy.get('app-input input[placeholder="Search username"]').type(
                    'admin'
                );

                cy.contains('Give access').click();
                cy.contains('Revoke access').click();
            });

            it('Test repository deletion', () => {
                cy.get('app-button').contains('Delete repository').click();
                cy.get('.repository').should(
                    'not.contain',
                    testingRepositoryName
                );
            });
        });
    });
});
