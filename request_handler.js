module.exports = function init_request_handler(ip_or_host_url, port_num, server_type_str){

    const colors = require('./colors.js');
    function green(string){return colors.fg.green + string + colors.reset}  
    function ret_false_if_undefined(bool){//return false if bool is not true or undefined
        if(bool) return bool; 
        else return false;
    }
    let jsResp = function(){
        return "function str_random_gen(len){ "+
        "Array.prototype.fill||Object.defineProperty(Array.prototype,'fill',{value:function(t){if(null==this)throw new TypeError('this is null or not defined');for(var r=Object(this),e=r.length>>>0,i=arguments[1]>>0,n=i<0?Math.max(e+i,0):Math.min(i,e),o=arguments[2],a=void 0===o?e:o>>0,l=a<0?Math.max(e+a,0):Math.min(a,e);n<l;)r[n]=t,n++;return r}}); "+
        "let aZ = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; "+
        "let arr = new Array(len).fill(0); "+
        "return arr.map(function(x,i,a){ "+
        "return aZ[Math.floor(Math.random() * aZ.length)]; "+
        "}).join(''); "+
        "} "+
        "let browser_code = str_random_gen(10); "+
        "let src_string = 'http://localhost:1337/watch_refresh_client_script_'+browser_code+'.js'; "+
        "console.log('watch_refresh app code:', browser_code, 'https://www.npmjs.com/package/watch_refresh for info'); "+
        "let script_ele = document.createElement('script'); "+
        "function watch_refresh_cb_XYZ54(refresh_bool){ "+
        "if(refresh_bool === true)location.reload(); "+
        "if(script_ele.parentNode) script_ele.parentNode.removeChild(script_ele); "+
        "script_ele = undefined; "+
        "script_ele = document.createElement('script'); "+
        "script_ele.src = src_string; "+
        "setTimeout(function(){ "+
        "document.body.appendChild(script_ele); "+
        "}, 1000); "+
        "} "+
        "script_ele.src = src_string; "+
        "document.body.appendChild(script_ele); "
    }()

    switch(ip_or_host_url){
        case "127.0.0.1" : {
            jsResp = jsResp.replace(
                "http://localhost:1337/watch_refresh_client_script_",
                server_type_str+"://"+"localhost"+":"+port_num+"/watch_refresh_client_script_"
            )
            break;
        }
        case "localhost" : {
            jsResp = jsResp.replace(
                "http://localhost:1337/watch_refresh_client_script_",
                server_type_str+"://"+"localhost"+":"+port_num+"/watch_refresh_client_script_"
            )
            break;
        }
        default : {
            jsResp = jsResp.replace(
                "http://localhost:1337/watch_refresh_client_script_",
                server_type_str+"://"+ip_or_host_url+":"+port_num+"/watch_refresh_client_script_"
            )
        }
    }


    //random 10 digit keys are generated client side to identify each connecting browser
    let refresh_bools = {};
    let refresh_bools_times = {};
    let last_refresh_time = new Date()
    //this removes all old stored keys that were not used 10 seconds after a change was detected
    function clean_old_refresh_bool_keys(){
        setTimeout(
            ()=>{
                let refresh_bools_keys = Object.keys(refresh_bools_times)
                refresh_bools_keys.map((key)=>{
                    if(refresh_bools_times[key] !== last_refresh_time){
                        delete refresh_bools[key];                        
                        delete refresh_bools_times[key];                          
                    }
                })                
            }
        , 10000)
    }
    return {
        //sets all keys to true //meaning these browsers must be refreshed
        refresh_true:function (){
            let refresh_bools_keys = Object.keys(refresh_bools)
            refresh_bools_keys.map((key)=>{
                refresh_bools[key] = true;
                let last_refresh_time = new Date()
                refresh_bools_times[key] = new Date(last_refresh_time.getTime())
            })
            clean_old_refresh_bool_keys()    
        },

        request_handler:function(req, res){
            if(req.url === "/watch_refresh_client_script_init.js"){
                res.writeHead(200, {"Content-Type":"text/javascript"});
                res.write(jsResp)     
            }else{
                if(req.url.indexOf("/watch_refresh_client_script_") !== -1){
                    //collect browser_code out of req.url
                    let browser_code = req.url + ""
                    browser_code = browser_code.replace("/watch_refresh_client_script_", "")
                    browser_code = browser_code.replace(".js", "")
                    if(browser_code.length === 10){//code length must be 10
                        res.writeHead(200, {"Content-Type":"text/javascript" , "Cache-Control": "no-cache"});//prevent form caching the script
                        res.write("watch_refresh_cb_XYZ54("+ret_false_if_undefined(refresh_bools[browser_code])+");") 
                        if(refresh_bools[browser_code]){
                            //remove keys if it was set to true
                            delete refresh_bools[browser_code];                        
                            delete refresh_bools_times[browser_code];                        
                        }else{
                            //add key if it didnt exist
                            if(refresh_bools[browser_code] === undefined) console.log(green("added brwoser_code:") + browser_code + green(" to refresh_list"))
                            refresh_bools[browser_code] = false;
                        }
                    }
                }
            }
            res.end()
        }
    }

}