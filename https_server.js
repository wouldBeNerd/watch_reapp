const colors = require('./colors.js');
function green(string){return colors.fg.green + string + colors.reset}  
function https_server(ip_or_host_url, port_num, https_options){
    //server below
    const https = require("https");
    let server
    //routes defined here
    const init_request_handler = require("./request_handler.js")(ip_or_host_url, port_num, "https")
    const request_handler = init_request_handler.request_handler
    //start server
    server = https.createServer(https_options, request_handler)
    server.listen(port_num, (err)=>{
        if(err) return console.log("error", err);
        else console.log(green("running watch_refresh"), "https",green("server:"),ip_or_host_url,green("on port:"), port_num)
    })

    return {//expose these to initiating scope
        "server":server,
        "refresh_true": init_request_handler.refresh_true
    }
}
module.exports = https_server