/* eslint-disable */
const clearModule = require('clear-module');
const path = require('path');

//import file without cache
module.exports = function (filePath) {
    filePath = path.join(filePath);

    const module = require(filePath);
    clearModule(filePath);

    return module;
}