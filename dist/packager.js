"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect = require("connect");
const serveStatic = require("serve-static");
const port = 8000;
connect().use(serveStatic(__dirname)).listen(port, () => {
    console.log('Server running on ', port);
});
