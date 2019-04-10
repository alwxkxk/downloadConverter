"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_converter_1 = require("./url-converter");
const downloader_1 = require("./downloader");
const converter = new url_converter_1.default();
const downloader = new downloader_1.default();
converter.start("package_esp8266com_index.json")
    .then((urlsArray) => {
    downloader.start(urlsArray);
})
    .catch((error) => {
    console.log("err:", error);
});
