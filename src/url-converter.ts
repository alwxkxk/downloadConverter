import * as fs from "fs-extra";
import * as url from "url";
import * as path from "path";
import * as process from "process";

const rootPath = process.cwd();
const outputDir = path.join(rootPath, "output");

class Converter {
  private urlArray: string[];

  public start(inputFile: string) {
    this .parseInput(inputFile);
  }

  /**
   * fetch url to this.urlArray form input string.
   *
   * @param {string} text
   * @memberof Converter
   */
  public fetchUrl(text: string) {
    const urlReg = /http[s]?:\/{2}(?:[\/-\w.]|(?:%[\da-fA-F]{2}))+/gm;
    const set = new Set();
    let match;
    do {
      match = urlReg.exec(text);
      if (match) {
        const urlString: string = match[0];
        set.add(urlString);
        // console.log(urlString);
      }
    } while (match);

    this .urlArray = Array.from(set);
    // long string first
    this .urlArray.sort((a, b) => {
      return -(a.length - b.length);
    });
    // console.log(set, this.urlArray);
  }

  private replaceUrl(text: string): string {
    let p;
    // copy string
    let result = (" " + text).slice(1);
    this .urlArray.forEach((s) => {
      p = url.parse(s);
      result=result.replace(s, `http://127.0.0.1:8000${p.path}${p.hash}`);
    });
    return result;
  }
  /**
   *
   *
   * @private
   * @param {string} input file name
   * @returns
   * @memberof Converter
   */
  private async parseInput(fileName: string) {
    if (!fileName) {
      return console.error("input is null.");
    }
    const inputFile = path.join(rootPath, fileName);
    const urlsFile = path.join(outputDir, "input" + path.extname(fileName));
    const outputFile = path.join(outputDir, "output"+ path.extname(fileName));
    const text = fs.readFileSync(inputFile, "utf-8");

    try {
      // delete old output
      await fs.remove(outputDir);
      // mkdir output
      await fs.ensureDir(outputDir);

      // copy inputFile into output directory
      fs.copy(inputFile, urlsFile);
      // fetch url and save the urls.json
      this .fetchUrl(text);
      fs.outputJson(path.join(outputDir, "urls.json"), this .urlArray);
      // replace url and save the output
      const output = this .replaceUrl(text);
      await fs.outputFile(outputFile, output);

    } catch (error) {
      console.error(error);
    }
  }
}

const test = new Converter();
test.start("package_esp8266com_index.json");
