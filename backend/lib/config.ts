import { Prisma, PrismaClient } from '@prisma/client';
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
            http: {
                port: number;
            };
            content_path: string;
            https: {
                key_location: string;
                cert_location: string;
                port: number;
                enable_HTTPS: boolean;
            };
        };
        uploadDirectory: string;
        users: {
            password_hash_rounds: number;
            sessionMaxAge: number;
        };
        prismaClientOptions: Prisma.PrismaClientOptions;
    }

    const defaultConfiguration: SINVConfigurationObject = {
        httpd: {
            http: {
                port: 80,
            },
            content_path: 'dist/frontend',
            https: {
                key_location: 'data/key.pem',
                cert_location: 'data/certificate.pem',
                port: 443,
                enable_HTTPS: false,
            },
        },
        uploadDirectory: 'data/uploads',
        users: {
            password_hash_rounds: 10,
            sessionMaxAge: 24 * 7, // Is in hours, so the default is 7 days.
        },
        prismaClientOptions: {
            datasources: {
                db: {
                    url: 'file:../../../data/sinv.db',
                },
            },
        },
    };

    const configPath = 'data/config.json';
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

    export function getPrismaClient() {
        return new PrismaClient(config.prismaClientOptions);
    }
}

SINVConfig.readConfig();
