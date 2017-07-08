# watch_reapp
Watches your app's directory for changes and restarts it when changes are made to it's files. 
Logs console output of your app to file and to console.
#### directory './LOGS/' will be created if absent and will always be ignored
#### (even when using a config object) 

## How to use
Create a js file.
#### with default settings without config object
local dir('./') is watched, 
files with extentions .js, .html, .css will be added to watch list on init,
no directories ignored except for the following `['./node_modules/', './.vscode/', './LOGS/','./.git/']`

```javascript
//MODIFICATIONS IN THIS FILE WILL NOT BE UPDATED AUTOMATICALLY
//require watch_reapp module
const watch_reapp = require('watch_reapp')
//run module, with path to app you wish to run
watch_reapp('./server.js')
```

#### include a config object
```javascript
//MODIFICATIONS IN THIS FILE WILL NOT BE UPDATED AUTOMATICALLY
//create a config object
const config = {
 dir :'./',//this directory is the starting point for all subfolders and files scanned
 watch_ext : ['.js','.html', '.css'], //file extensions to watch
 ignore_dirs : ['./node_modules/', './.vscode/', './LOGS/', './MONGODATABASE/'], //directories to ignore, 
 ignore_dirs_containing : ['ZDEP_'], //wildcard strings directory
 ignore_files : ['./ignore_file.js'] //files to ignore, 
}
//require watch_reapp module
const watch_reapp = require('watch_reapp')
//run module, with path to app you wish to run and add the config object as second parameter
watch_reapp('./server.js', config)
```
