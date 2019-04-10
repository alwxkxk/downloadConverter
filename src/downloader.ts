import {queue} from "async";
import * as fs from "fs-extra";
import * as path from "path";
import * as ProgressBar  from "progress";
import * as request from "request";
import * as URL from "url";

const rootPath = process.cwd();
const outputDir = path.join(rootPath, "output");
const parallelNum = 3;
type ICallback = ( error: Error, result?: number )  => void;

class Downloader {
  // TODO: check file exist before download.
  public start(urlsArray: string[]) {
    if (!urlsArray || !urlsArray.length) {
      return console.warn("urlsArray length is 0");
    }
    console.log(`download file number:${urlsArray.length}`);
    // download by queue
    const q = queue((url: string, callback: ICallback) => {
      this .download(url, callback);
    }, parallelNum);

    q.drain = () => {
      console.log("all items have been processed");
    };

    q.push(urlsArray);
  }
  public download(url: string, onCompleted?: ICallback) {
    console.log("download:", url);
    const pathname = URL.parse(url).pathname;
    const filePath = path.join(outputDir, pathname);
    request.get(url, (err, httpResponse, body)=>{
      onCompleted(err);
    })
    .on("response", (response) => {
      // download file
      fs.ensureFileSync(filePath);
      response.pipe(fs.createWriteStream(filePath));
      // show download progress bar
      const len = parseInt(response.headers["content-length"], 10);
      const bar = new ProgressBar("downloading [:bar] :rate/bps :percent :etas", {
        complete: "=",
        incomplete: " ",
        width: 20,
        total: len,
      });
      response.on("data", (chunk) => {
        bar.tick(chunk.length);
      });
    });
  }
}

export default Downloader;

/* tslint:disable */

// const urlsArray1 = ["http://ww1.sinaimg.cn/large/005BIQVbgy1fvi5wtnbqej30h80dbmx6.jpg"];

// const urlsArray2 = [
//   "https://github.com/earlephilhower/esp-quick-toolchain/releases/download/2.5.0-3/x86_64-apple-darwin14.xtensa-lx106-elf-20ed2b9c.tar.gz"];
// const urlsArray3 = [
//   "http://ww1.sinaimg.cn/large/005BIQVbgy1fvi5wtnbqej30h80dbmx6.jpg",
//   "http://ww1.sinaimg.cn/large/005BIQVbgy1fw7hfkw1z0j305k046jr8.jpg",
//   "http://ww1.sinaimg.cn/large/005BIQVbgy1fw7hir4bdrj30si0fuwmo.jpg",
// "http://ww1.sinaimg.cn/large/005BIQVbgy1fxa5xk5h9gj30rj09rq55.jpg",
// "http://ww1.sinaimg.cn/large/005BIQVbgy1fxa63z5bylj30ms0bmq5j.jpg"];

// const urlsArray4 = [
//   "https://github.com/earlephilhower/esp-quick-toolchain/releases/download/2.5.0-3/x86_64-apple-darwin14.xtensa-lx106-elf-20ed2b9c.tar.gz",
//   "https://github.com/earlephilhower/esp-quick-toolchain/releases/download/2.5.0-2/x86_64-apple-darwin14.xtensa-lx106-elf-59d892c8.tar.gz"];

// const test = new Downloader();
// test.start(urlsArray4);
