  const colors = {
        fg:{
            black : "\x1b[30m",
            red : "\x1b[31m",
            green : "\x1b[32m",
            yellow : "\x1b[33m",
            blue : "\x1b[34m",
            magenta : "\x1b[35m",
            cyan : "\x1b[36m",
            white : "\x1b[37m",
        },
        bg:{
            black : "\x1b[40m",
            red : "\x1b[41m",
            green : "\x1b[42m",
            yellow : "\x1b[43m",
            blue : "\x1b[44m",
            magenta : "\x1b[45m",
            cyan : "\x1b[46m",
            white : "\x1b[47m",
        },
        reset : "\x1b[0m",
        bright : "\x1b[1m",
        dim : "\x1b[2m",
        underscore : "\x1b[4m",
        blink : "\x1b[5m",
        reverse : "\x1b[7m",
        hidden : "\x1b[8m",
}
 module.exports =  function (i, max, working_on_str, items_str){
      if(i === max-1){
        process.stdout.write(green(working_on_str+' '+ zero_out(i+1, max) +' of '+ max+' '+items_str+' ') + white(node_prog_bar(i+1, max))+'\n')//create new line at end
      }else{
        process.stdout.write(green(working_on_str+' '+ zero_out(i+1, max) +' of '+ max+' '+items_str+' ') + white(node_prog_bar(i+1, max))+'\r')//return to beginning of line 
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
      if(xi<=b_e) return '■'//'='
      else return ' '
    }).join('')+'] ' + (parseInt((i/max)*100)) +'%'
  }
  //RETURN COLOR STRING
  function bright_yellow(string){return colors.fg.yellow+ colors.bright + string + colors.reset}
  function bright_green(string){return colors.fg.green+ colors.bright + string + colors.reset}
  function bright_white(string){return colors.fg.white+ colors.bright + string + colors.reset}
  function green(string){return colors.fg.green + string + colors.reset}  
  function yellow(string){return colors.fg.yellow + string + colors.reset}  
  function white(string){return colors.fg.white + string + colors.reset}     
  function red(string){return colors.fg.red + string + colors.reset}        