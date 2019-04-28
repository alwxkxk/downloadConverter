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

// hexo post img save in sinaimg
// converter.start("_posts", {
//   multi:true,
//   filter:{
//     includes:["sinaimg"]
//   }
// })
// .then((urlsArray)=>{
//   downloader.start(urlsArray);
// })
// .catch((error)=>{
//   console.log("err:", error);
// });
