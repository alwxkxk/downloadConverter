import * as connect from "connect";
import * as serveStatic from "serve-static";
const port = 8000;
connect().use(serveStatic(__dirname)).listen(port, ()=>{
    console.log('Server running on ', port);
});
