module.exports = function http_server(port_num){
    const fs = require("fs");
    const http = require("http");
    const request_handler = (req, res)=>{
        if(req.url === "/"){
            fs.readFile("./client/index.html", function(error, pgResp){
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
    const server = http.createServer(request_handler)
    server.listen(port_num, (err)=>{
        if(err) return console.log("error", err);
        console.log("refresh_server listening on", port_num)
    })
}