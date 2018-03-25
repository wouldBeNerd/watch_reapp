
module.exports = watch_refresh
/**
 *Refreshes your Browser when you make changes to any files in it's or a differently specified directory.
 *
 * Ignores supplied Arrays of filenames, paths or wildcard names.
 *
 * config is an OPTIONAL parameter and so are it's keys,
 * 
 * default values are:
 * - ip_or_host_url =  '127.0.0.1'
 * - dir = './'
 * - watch_ext = ['.js', '.html', '.css', '.json']
 * - ignore_dirs = ['./node_modules/', './.vscode/', './LOGS/', './.git/'] 
 * - ignore_files = []
 * - ignore_dirs_containing = []
 * - port = 1337
 * - https_key = undefined
 * - https_cert = undefined
 * - https_string = undefined
 * 
 * be sure to re-include ['./node_modules/', './.vscode/', './.git/'] to ignore_dirs; you might end up watching thousands of files otherwise; computer could stop function in a very unimpressive manner.
 * 
 * @param {String} ip_or_host_url ip address of server (optional)
 * @param {{dir:String,watch_ext:[String],ignore_dirs:[String],ignore_files:[String],ignore_dirs_containing:[String],port:Number,https_key:String, https_cert:String, https_ca:String}} config Config Object and all it's keys are OPTIONAL
 * @author Mattias Lemmens
 * @exports ./watch_refresh.js 
 */
function watch_refresh(ip_or_host_url, config){//server will execute when watch_cycle ends
  const fs = require('fs');
  const path = require('path');
  const util = require('util');
  const colors = require('./colors.js');
  const on_file_change = require('on-file-change');//by Jan Święcki <jan.swiecki@gmail.com>
  let refresh_server
  //defaults  
  let dir = './VIEWS/'//starting dir, './ to look in the folder where the app is running
  let watch_ext = ['.js', '.html', '.css', '.json'] //file extensions to watch
  let ignore_dirs = ['./node_modules/', './.vscode/', "./.git/"] //directories to ignore, 
  let ignore_files = [] //files to ignore,
  let ignore_dirs_containing = []//ignore these dirs with prefix
  let port_num = 1337;
  let https_options = {
    cert:"",
    key:"",
  }
  let server_type = "http"
  if(!ip_or_host_url) ip_or_host_url = "127.0.0.1";
  if(config){
    if(config.dir) dir = config.dir;
    if(config.watch_ext) watch_ext = config.watch_ext;
    if(config.ignore_dirs){ 
      ignore_dirs = config.ignore_dirs
      if(ignore_dirs.indexOf(logs_dir) === -1) ignore_dirs.push(logs_dir);
    };
    if(config.ignore_files) ignore_files = config.ignore_files;
    if(config.ignore_dirs_containing) ignore_dirs_containing = config.ignore_dirs_containing;
    if(config.port) port_num = config.port;
    if(config.https_key && config.https_cert){
      https_options = {
        cert:config.https_cert,
        key:config.https_key,
      }      
        server_type = "https"
    }    
    if(config.key && config.cert){
      https_options = {
        cert:config.cert,
        key:config.key,
      }      
        server_type = "https"
    }        
    if(config.https_key && config.https_cert && config.https_ca){
      https_options = {
        cert:config.https_cert,
        key:config.https_key,
        ca:config.https_ca,
      }      
        server_type = "https"
    }
    if(config.key && config.cert && config.ca){
      https_options = {
        cert:config.cert,
        key:config.key,
        ca:config.ca
      }      
      server_type = "https"
    }    
  }

  let watch_arr = []//file+dir goes here to watch
  let watching_arr = []
  let running_app = false// will false before server is started
  //LOGGER INITIATED HERE
  const logger = console
  console.log(bright_green(process.title + ': ') ,'initiated on ' , new Date().toLocaleString())
  //return array of directories based on path ignores other types
  function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory()
    })
  }
  //
  function recurs_dir_scan(dir){//ignores dirs where applicable
      if(ignore_dirs_containing.map((x)=>{if(dir.includes(x)) return true }).includes(true)) return;//ignores dirs containing x
      if(ignore_dirs.includes(dir)) return;//ignores entire dirs
      ;(fs.readdirSync(dir)||[]).map((file)=> {
        let file_ext = path.extname(dir+file)||''
        if(watch_ext.includes(file_ext) && fs.lstatSync(dir+file).isFile()) watch_arr.push(dir+file)//adds files to watch to watch_arr
        if(!(file).includes('.')&&fs.lstatSync(dir+file).isDirectory()) recurs_dir_scan(dir+file+'/')//recursive_perform dir_scan a directory level deeper
      })
      return watch_arr//function returns array of dir+file to watch  
  } 
  //init file watch, build watch_arr
  function init_watch(dir_file){
      on_file_change(dir_file,(dir_file)=>{
        console.log(green('file-change for: ') + dir_file + green(' setting refresh_bool'))
        //indicate to server that a file has changed to tell browsers to refresh.
        refresh_server.refresh_true();
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
            if(!running_app) init_child_and_progress_report(i_c-1, files_c-1)//disable init progress report if app is already running
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
        //server initiated when watch list is finished
        if(server_type === "http") refresh_server = require("./http_server.js")(ip_or_host_url, port_num)
        if(server_type === "https") refresh_server = require("./https_server.js")(ip_or_host_url, port_num, https_options)
        running_app = true;
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
    let bar_l = 40//character length of progress par
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