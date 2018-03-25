# watch_refresh
Refreshes your browser automatically when you modify your files.
If this module has anything going for itself it's that it is light on dependencies, fast and simple to use. 
**Use this only in a secure development environment**, it uses JSONP script tags to call the server. 
**https NOW works with Chrome and Safari, but not EDGE(i could use some advice for this if anyone has any)**

## How to use
#### To Install
```
npm i watch_refresh --save-dev
```
#### Place this script tag in the html pages you want to refresh automatically
```html
<!--place at the bottom of the body, modify the url and port if you modified it in the module!-->
<!--change to https if you are using https-->
<script src='http://127.0.0.1:1337/watch_refresh_client_script_init.js'></script>
<!--don't forget to delete the tag once you finish designing your page-->
```
#### With default settings without config object
url '127.0.0.1' is used with port '1337',
local dir('./VIEWS/') is watched, 
files with extensions .js, .html, .css, .json will be added to watch list on init,
no directories ignored except for the following `['./node_modules/', './.vscode/', './LOGS/','./.git/']`

Create a js file.
```javascript
//require watch_refresh module
const watch_refresh = require('watch_refresh')
//run module, with path to app you wish to run
watch_refresh()
//default '127.0.0.1' and port '1337' will be used 
```

#### When including a config object
```javascript
//MODIFICATIONS IN THIS FILE WILL NOT BE UPDATED AUTOMATICALLY
//create a config object
const config = {
 port: 1337,
 dir :'./VIEWS/',//this directory is the starting point for all subfolders and files scanned
 watch_ext : ['.js','.html', '.css', '.json'], //file extensions to watch
 ignore_dirs : ['./node_modules/', './.vscode/', './LOGS/'], //directories to ignore, 
 ignore_dirs_containing : ['ZDEP_'], //wildcard strings directory
 ignore_files : ['./ignore_file.js'] //files to ignore, 
}
//require watch_refresh module
const watch_refresh = require('watch_refresh')
//run module, with path to app you wish to run and add the config object as a second parameter
watch_refresh('127.0.0.1', config)
```
#####If you are using any compilers or transpilers you might want to watch only the public directory. So that you are only refreshing when the public files are modified.

#### https instructions
Don't forget to modify the html script tag src from http to https!
```javascript
const fs = require('fs')
const watch_refresh = require('./../watch_refresh')
//run module, with path to app you wish to run and add the config object as second parameter
watch_refresh('127.0.0.1', 
{
    'port':1337, dir:'./VIEWS/', 
    'key':fs.readFileSync('./https/server.key'), 
    'cert':fs.readFileSync('./https/server.crt')
})
```

#### or (for https)
Don't forget to modify the html script tag src from http to https!
```javascript
const fs = require('fs')
const watch_refresh = require('./../watch_refresh')
//run module, with path to app you wish to run and add the config object as second parameter
watch_refresh('127.0.0.1', 
{
    'port':1337, dir:'./VIEWS/', 
    'key':fs.readFileSync('./https/server.key'), 
    'cert':fs.readFileSync('./https/server.crt'),
    'ca': fs.readFileSync('./https/server.csr')
})
```


#### Examples
check 
__'watch_refresh_test_http.js'__ 
and 
__'watch_refresh_test_https.js'__ 
in test_files folder for examples

## Updates
#### 1.0.0 (2017-10-17)
 - added JSDoc support (when trying to use watch_refresh you should now receive informative and helpful intellisense, tested in visual studio code, technically you shouldnt even need this readme anymore)

#### Good to know

for each browser connecting to the watch_refresh a code will be generated and stored
due to manual browser refreshes or browser exits some of these codes will become obsolete from time to time. Unused refresh codes are automatically cleaned up 10 seconds after the refresh event.

### PLEASE SEND ME FEEDBACK; especially the bad stuff, I would like to make this better!
email = mattias.lemmens@showtex.com