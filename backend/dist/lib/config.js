"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SINVConfig = void 0;
const fs_1 = require("fs");
const lodash_1 = __importDefault(require("lodash"));
/**
 * `SINVConfig` is responsible for reading the SINV configuration file. Access the configuration object by using `SINVConfig.config`.
 * @example
 * console.log(SINVConfig.config.foo); // Gets the `foo` configuration entry from the config file
 *  */
var SINVConfig;
(function (SINVConfig) {
    const defaultConfiguration = {
        testEntry: 'helloWorld',
        testNumber: 10,
        testObject: {
            entry1: 'hello',
            entry2: 'world',
        },
    };
    const configPath = './config.json';
    /**
     * This is the configuration obejct read from the configuration file (unset entries are defaulted). The entries can be directly accessed.
     */
    SINVConfig.config = {};
    /**
     * Updates `SINV.config` based on the configuration file and defaults unset configuration entries to the defaults. This is executed automatically when this module is imported.
     * @example
     * SINVConfig.readConfig(); // Updates SINV.config (this is optional and executed automatically when importing the module)
     * var foo = SINVConfig.config.foo;
     */
    function readConfig() {
        var userConfig = JSON.parse((0, fs_1.readFileSync)(configPath).toString());
        SINVConfig.config = lodash_1.default.defaultsDeep(userConfig, defaultConfiguration);
    }
    SINVConfig.readConfig = readConfig;
})(SINVConfig = exports.SINVConfig || (exports.SINVConfig = {}));
SINVConfig.readConfig();
