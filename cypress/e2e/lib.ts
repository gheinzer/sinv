export namespace SINVCypressLib {
    function getConfig(callback: (config: any) => void) {
        return cy.task('getConfig').then((config) => {
            callback(config);
        });
    }

    export function openSubpage(path: string, callback?: () => void) {
        getConfig((config) => {
            cy.visit(`${config.httpd.host}${path}`);
            cy.get('.loader-overlay').should('have.css', 'opacity', '0');
            if (callback) callback();
        });
    }

    export function openSession(callback?: () => {}) {
        cy.task('openSession', 'admin').then((sessid: any) => {
            window.localStorage.setItem('sinv-sessid', sessid);
            cy.reload();
            if (callback) callback();
        });
    }

    export function createRepositoryIfNotExists(name: string) {
        cy.task('createRepositoryIfNotExists', name);
    }

    export function getInput(placeholder: string) {
        cy.get(`app-input input[placeholder=${placeholder}]`);
    }

    export function URLShouldBe(path: string) {
        getConfig((config) => {
            cy.url().should('equal', `http://${config.httpd.host}${path}`);
        });
    }
}
