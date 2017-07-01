/**
 * watches your directory for file changes and restarts your applications when changes are made
 * it also has a fancy loading bar with colors and stuff
 * @author Mattias Lemmens<mattias.lemmens@showtex.com>
 */
module.exports = watch_reapp
function watch_reapp(app_str, config){//app_fn will execute when watch_cycle ends
  const fs = require('fs');
  const path = require('path');
  const util = require('util');
  const colors = require('./colors.js');
  const on_file_change = require('on-file-change');//by Jan Święcki <jan.swiecki@gmail.com>
  //defaults  
  let dir = './'//starting dir, './ to look in the folder where the app is running
  let watch_ext = ['.js', '.html', '.css'] //file extensions to watch
  let ignore_dirs = ['./node_modules/', './.vscode/', './LOGS/',"./.git/"] //directories to ignore, 
  let ignore_files = [] //files to ignore,
  let ignore_dirs_containing = []//ignore these dirs with prefix
  //they must be complete, if you have nested directories, you must add the complete path 
  //ignore_dirs example =  './dir/sub_dir/ignore_this_dir/'
  //ignore_dirs example =  './dir/sub_dir/ignore_this_file.js'
  //folders that contain a '.' will ALWAYS be ignored
  if(config){
    if(config.dir) dir = config.dir;
    if(config.watch_ext) watch_ext = config.watch_ext;
    if(config.ignore_dirs) ignore_dirs = config.ignore_dirs;
    if(config.ignore_files) ignore_files = config.ignore_files;
    if(config.ignore_dirs_containing) ignore_dirs_containing = config.ignore_dirs_containing;
  }
  let watch_arr = []//file+dir goes here to watch
  let watching_arr = []
  //CHILD PROCESS RUNS IN HERE prep child process/app_fn
  const spawn = require('child_process').spawn
  function new_child_process(){
    let app = spawn('node',[app_str])
    //route console output to main app console output
    app.stdout.on('data', function (data){
        var str = data.toString(), lines = str.split(/(\r?\n)/g);
        lines.map((x)=>{ //filter out new lines and line backs so that they do not get applied twice
          if(x.length > 0 && !x.includes("\n")&& !x.includes("\r"))console.log(x)
        })
        logger.log(data.toString())
    })
    app.stderr.on('data', function (data) { 
        console.log(red(data.toString()))
        logger.error(data.toString())
        console.log('awaiting file-change')
    }); 
    app.on('close', (code)=>{
      if(code === null) console.log('child process killed '+bright_yellow('NATURALLY')+' by '+bright_white(process.title));
      // else  console.log(`child process exited with code ${code}`)
    }) 
    return app
  }
  let running_app = null// will hold the child app once running 
  //LOGGER INITIATED HERE
  const Console = require('console').Console//get console prototyppe
  const output = fs.createWriteStream('./LOGS/stdout.log')//must mod to add incremented file numbering
  const errorOutput = fs.createWriteStream('./LOGS/stderr.log')//must mod to add incremented file numbering
  const logger = new Console(output, errorOutput)//create new logger prototype
  console.log(bright_green(process.title + ': ') ,'initiated on ' , new Date().toLocaleString())
  //return array of directories based on path ignores other types
  function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory()
    })
  }
  //
  function recurs_dir_scan(dir){//ignores dirs where applicable
      if(ignore_dirs_containing.map((x)=>{if(dir.includes(x)) return true }).includes(true)) return//ignores dirs containing x
      if(ignore_dirs.includes(dir)) return//ignores entire dirs
      ;(fs.readdirSync(dir)||[]).map(file=> {
        let file_ext = path.extname(dir+file)||''
        if(watch_ext.includes(file_ext) && fs.lstatSync(dir+file).isFile()) watch_arr.push(dir+file)//adds files to watch to watch_arr
        if(!(file).includes('.')&&fs.lstatSync(dir+file).isDirectory()) recurs_dir_scan(dir+file+'/')//recursive_perform dir_scan a directory level deeper
      })
      return watch_arr//function returns array of dir+file to watch  
  } 
  //init file watch, build watch_arr
  function init_watch(dir_file){
      on_file_change(dir_file,(dir_file)=>{
        console.log(green('file-change for: ') + dir_file)
        running_app.kill()
        console.log(green('restarting: ') + app_str)        
        running_app = new_child_process()  
      })  
  } 
  let ignore_count = 0
  //return false if dir_file is in ignore list 
  function is_ignored(dir_file){
    if(!ignore_files.includes(dir_file)){ 
      return false
    }else{
      ignore_count++
      return true
    }
  }
  //INITIATES HERE iterate watch_arr
  function init(){
    ignore_count = 0
    watch_arr = []
    recurs_dir_scan(dir).map((x,i,a)=>{
        if(is_ignored(x)){
        }else{
          let files_c = a.length - ignore_count+1;//files_to_watch_count
          let i_c = i - ignore_count+1
          if(!watching_arr.includes(x)){//x exists in watching_arr dont  add it     
            init_watch(x)
            watching_arr.push(x)
            if(!running_app) init_child_and_progress_report(i_c, files_c)//disable init progress report if app is already running
            else console.log(green('added file: ') + x)//report file added if 
          }
        }
        if(a.length-1 === i) setTimeout(init, 30000)//reinit new file check every 30 seconds
    })
  }
  init()//START
  function init_child_and_progress_report(i_c, files_c){
      if(i_c === files_c-1){
        process.stdout.write(green('watching '+ zero_out(i_c+1, files_c) +' of '+ files_c+' files ') + white(node_prog_bar(i_c+1, files_c))+'\n')//create new line at end
        console.log(green('running:'), app_str)
        running_app = new_child_process()
      }else{
        process.stdout.write(green('watching '+ zero_out(i_c+1, files_c) +' of '+ files_c+' files ') + white(node_prog_bar(i_c+1, files_c))+'\r')//return to beginning of line 
      } 
  }
  //zero out and return digit for instance(1 becomes '001' if max value ahs 3 digits
  function zero_out(num, max_num){
    let digits = max_num.toString().length
    if(digits === num.toString().length) return num.toString()
    let i_d = num.toString().length
    let pf_d = digits-i_d
    return (Array(pf_d+1).join('0')+num.toString())
  }
  //build and return progress bar
  function node_prog_bar(i, max){//returns progress bar string
    let bar_l = 50//character length of progress par
    let b_e = Math.round(i/(max/bar_l))//bar end
    return '  ['+Array(bar_l+1).join('_').split('').map((x,xi, a)=>{
      if(xi<=b_e) return '■'
      else return ' '
    }).join('')+'] ' + (parseInt((b_e/bar_l)*100)) +'%'
  }
  //RETURN COLOR STRING
  function bright_yellow(string){return colors.fg.yellow+ colors.bright + string + colors.reset}
  function bright_green(string){return colors.fg.green+ colors.bright + string + colors.reset}
  function bright_white(string){return colors.fg.white+ colors.bright + string + colors.reset}
  function green(string){return colors.fg.green + string + colors.reset}  
  function yellow(string){return colors.fg.yellow + string + colors.reset}  
  function white(string){return colors.fg.white + string + colors.reset}     
  function red(string){return colors.fg.red + string + colors.reset}        
}


