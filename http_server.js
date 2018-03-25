const colors = require('./colors.js');
function green(string){return colors.fg.green + string + colors.reset}  
function http_server(ip_or_host_url, port_num){
    //server below
    const http = require("http");
    let server
    //routes defined here
    const init_request_handler = require("./request_handler.js")(ip_or_host_url, port_num, "http")
    const request_handler = init_request_handler.request_handler
    //start server
    server = http.createServer(request_handler)
    server.listen(port_num, (err)=>{
        if(err) return console.log("error", err);
        else console.log(green("running watch_refresh"), "http",green("server:"),ip_or_host_url,green("on port:"), port_num)
    })

    return {//expose these to initiating scope
        "server":server,
        "refresh_true": init_request_handler.refresh_true
    }
}
module.exports = http_server