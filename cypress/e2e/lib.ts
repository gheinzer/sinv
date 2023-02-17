export namespace SINVCypressLib {
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

    export function openSession(callback?: () => {}) {
        cy.task('openSession', 'admin').then((sessid: any) => {
            window.localStorage.setItem('sinv-sessid', sessid);
            cy.reload();
            if (callback) callback();
        });
    }
}
