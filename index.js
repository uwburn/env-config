"use strict";

const debugDebug = require("debug")("env-config:debug");

const _ = require("lodash");

module.exports = function (defaults, alloweds) {
    let config = _.cloneDeep(defaults);

    for (let k in process.env) {
        let path = k.toLowerCase();
        path = path.replace(/(_)([a-z])/g, (match, underscore, letter) => {
            return `.${letter}`;
        });
        path = path.replace(/(-)([a-z])/, (match, dash, letter) => {
            return letter.toUpperCase();
        });
        path = path.replace(/(_)([0-9]+)/, (match, underscore, numbers) => {
            return `[${numbers}]`;
        });

        let zeroPath = path.replace(/\[[0-9]+\]/, "[0]");
        if (!alloweds || _.get(alloweds, zeroPath)) {
            let value = process.env[k];

            debugDebug(`Overwriting ${path} with value ${value}`);

            _.set(config, path, value);
        }
    }
};