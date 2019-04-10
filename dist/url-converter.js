"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const process = require("process");
const URL = require("url");
const rootPath = process.cwd();
const outputDir = path.join(rootPath, "output");
class Converter {
    start(inputFile) {
        return this.parseInput(inputFile);
    }
    /**
     * fetch url to this.urlArray form input string.
     *
     * @param {string} text
     * @memberof Converter
     */
    fetchUrl(text) {
        const urlReg = /http[s]?:\/{2}(?:[\/-\w.]|(?:%[\da-fA-F]{2}))+/gm;
        const set = new Set();
        let match;
        do {
            match = urlReg.exec(text);
            if (match) {
                const urlString = match[0];
                set.add(urlString);
                // console.log(urlString);
            }
        } while (match);
        this.urlArray = Array.from(set);
        // long string first
        this.urlArray.sort((a, b) => {
            return -(a.length - b.length);
        });
        // console.log(set, this.urlArray);
    }
    replaceUrl(text) {
        let p;
        // copy string
        let result = (" " + text).slice(1);
        this.urlArray.forEach((s) => {
            p = URL.parse(s);
            result = result.replace(s, `http://127.0.0.1:8000${p.path}${p.hash}`);
        });
        return result;
    }
    /**
     *
     *
     * @private
     * @param {string} input file name
     * @returns {Promise< string[]>} urlArray
     * @memberof Converter
     */
    parseInput(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fileName) {
                // console.error("input is null.");
                return Promise.reject("input is null.");
            }
            const inputFile = path.join(rootPath, fileName);
            const urlsFile = path.join(outputDir, "input" + path.extname(fileName));
            const outputFile = path.join(outputDir, "output" + path.extname(fileName));
            const text = fs.readFileSync(inputFile, "utf-8");
            try {
                // delete old output
                yield fs.remove(outputDir);
                // mkdir output
                yield fs.ensureDir(outputDir);
                // copy inputFile into output directory
                fs.copy(inputFile, urlsFile);
                // fetch url and save the urls.json
                this.fetchUrl(text);
                fs.outputJson(path.join(outputDir, "urls.json"), this.urlArray);
                // replace url and save the output
                const output = this.replaceUrl(text);
                yield fs.outputFile(outputFile, output);
                return Promise.resolve(this.urlArray);
            }
            catch (error) {
                // console.error(error);
                return Promise.reject(error);
            }
        });
    }
}
exports.default = Converter;
/* tslint:disable */
// const test = new Converter();
// test.start("package_esp8266com_index.json");
