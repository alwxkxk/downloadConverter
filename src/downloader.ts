import * as fs from "fs-extra";
import * as path from "path";
import * as ProgressBar  from "progress";
import * as request from "request";
import * as URL from "url";

const rootPath = process.cwd();
const outputDir = path.join(rootPath, "output");

class Downloader {
  public start(urlsArray: string[]) {
    // TOOD: down load one by one
    urlsArray.forEach((url) => {
      this .download(url)
    });
  }
  public download(url:string){
    console.log(url)
    const pathname = URL.parse(url).pathname;
    request.get(url)
    .on("data", (data)=> {
      // save file
      fs.outputFile(path.join(outputDir, pathname), data);
    })
    .on("response", (response)=> {
      // show download progress bar
      let len = parseInt(response.headers['content-length'], 10);
      let bar = new ProgressBar('  downloading [:bar] :rate/bps :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: len
      });
      response.on("data", (chunk)=> {
        bar.tick(chunk.length);
      });
    });
  }
}

const urlsArray1 = ["http://ww1.sinaimg.cn/large/005BIQVbgy1fvi5wtnbqej30h80dbmx6.jpg"];

const urlsArray2 = [
  "https://github.com/earlephilhower/esp-quick-toolchain/releases/download/2.5.0-3/x86_64-apple-darwin14.xtensa-lx106-elf-20ed2b9c.tar.gz"];
const urlsArray3 = [
  "https://github.com/earlephilhower/esp-quick-toolchain/releases/download/2.5.0-3/x86_64-apple-darwin14.xtensa-lx106-elf-20ed2b9c.tar.gz",
  "https://github.com/earlephilhower/esp-quick-toolchain/releases/download/2.5.0-2/x86_64-apple-darwin14.xtensa-lx106-elf-59d892c8.tar.gz",
];

const test = new Downloader();
test.start(urlsArray2);
