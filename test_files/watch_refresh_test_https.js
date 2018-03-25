//start test server
const tiny_test_server_https = require("./tiny_test_server_https.js")
tiny_test_server_https(443)

//init watch_refresh
const fs = require("fs")
const watch_refresh = require('./../watch_refresh')
//run module, with path to app you wish to run and add the config object as second parameter
watch_refresh("127.0.0.1", 
{
    port:1337, dir:"./VIEWS/", 
    https_key:fs.readFileSync('./https/server.key'), 
    https_cert:fs.readFileSync('./https/server.crt'),
    https_ca: fs.readFileSync('./https/server.csr')
})