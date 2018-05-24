//start test server
const tiny_test_server_http = require("./tiny_test_server_http.js")
tiny_test_server_http(80)

//init watch_refresh
const fs = require("fs")
const watch_refresh = require('./../watch_refresh')
//run module, with path to app you wish to run and add the config object as second parameter
watch_refresh("127.0.0.1",{port:1336})