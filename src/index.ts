import Converter from "./url-converter";
import Downloader from "./downloader";

const converter = new Converter();
const downloader = new Downloader();

converter.start("package_esp8266com_index.json")
.then((urlsArray)=>{
  downloader.start(urlsArray);
})
.catch((error)=>{
  console.log("err:", error);
});
