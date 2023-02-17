export namespace SINVCypressLib {
    export function login() {
        cy.visit('localhost:8080');
    }

    function getConfig(callback: (config: any) => void) {
        return cy.task('getConfig').then((config) => {
            callback(config);
        });
    }

    export function openSubpage(path: string, callback?: () => void) {
        getConfig((config) => {
            cy.visit(`${config.httpd.host}${path}`);
            if (callback) callback();
        });
    }
}
