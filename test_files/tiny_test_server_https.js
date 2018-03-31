module.exports = function https_server(port_num){
    const fs = require("fs");
    const https = require("https");
    const httpsOptions = {//httpsconfig
        'cert': fs.readFileSync('./https/server.crt'),
        'key': fs.readFileSync('./https/server.key'),
        'ca': fs.readFileSync('./https/server.csr')
    }    
    const request_handler = (req, res)=>{
        if(req.url === "/"){
            fs.readFile("./client/index_https.html", function(error, pgResp){
                if(error){
                    res.writeHead(404);
                    res.write("contents not found")
                }else{
                    res.writeHead(200, {"Content-Type":"text/html"});
                    res.write(pgResp)
                }
                res.end()
            })
        }else{
            if(req.url.indexOf("") === -1){
                res.end()

            }else{
                res.end()                
            }
            res.end()
        }
    }
    const server = https.createServer(httpsOptions, request_handler)
    server.listen(port_num, (err)=>{
        if(err) return console.log("error", err);
        console.log("refresh_server listening on", port_num)
    })
}