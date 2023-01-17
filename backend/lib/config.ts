import { readFileSync, existsSync } from 'fs';
import _ from 'lodash';

/**
 * `SINVConfig` is responsible for reading the SINV configuration file. Access the configuration object by using `SINVConfig.config`.
 * @example
 * console.log(SINVConfig.config.foo); // Gets the `foo` configuration entry from the config file
 *  */
export namespace SINVConfig {
    export interface SINVConfigurationObject {
        httpd: {
            port: number;
            content_path: string;
        };
    }

    const defaultConfiguration: SINVConfigurationObject = {
        httpd: {
            port: 8080,
            content_path: 'dist/frontend',
        },
    };

    const configPath = '../../data/config.json';
    /**
     * This is the configuration obejct read from the configuration file (unset entries are defaulted). The entries can be directly accessed.
     */
    export var config: SINVConfigurationObject = defaultConfiguration;

    /**
     * Updates `SINV.config` based on the configuration file and defaults unset configuration entries to the defaults. This is executed automatically when this module is imported.
     * @example
     * SINVConfig.readConfig(); // Updates SINV.config (this is optional and executed automatically when importing the module)
     * var foo = SINVConfig.config.foo;
     */
    export function readConfig() {
        if (!existsSync(configPath)) var userConfig: Object = {};
        else
            var userConfig: Object = JSON.parse(
                readFileSync(configPath).toString()
            );
        config = _.defaultsDeep(userConfig, defaultConfiguration);
    }
}

SINVConfig.readConfig();
