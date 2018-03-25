function str_random_gen(len){
//not compatible with internet explorer because of fill
    //polyfil for fill 
    Array.prototype.fill||Object.defineProperty(Array.prototype,"fill",{value:function(t){if(null==this)throw new TypeError("this is null or not defined");for(var r=Object(this),e=r.length>>>0,i=arguments[1]>>0,n=i<0?Math.max(e+i,0):Math.min(i,e),o=arguments[2],a=void 0===o?e:o>>0,l=a<0?Math.max(e+a,0):Math.min(a,e);n<l;)r[n]=t,n++;return r}});
    let aZ = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let arr = new Array(len).fill(0);
    return arr.map(function(x,i,a){
        return aZ[Math.floor(Math.random() * aZ.length)] 
    }).join("")
}
let browser_code = str_random_gen(10)
let src_string = "http://localhost:1337/watch_refresh_client_script_"+browser_code+".js"
console.log("watch_refresh app code:", browser_code, "https://www.npmjs.com/package/watch_refresh for info");
let script_ele = document.createElement("script")
function watch_refresh_cb_XYZ54(refresh_bool){
    if(refresh_bool === true)location.reload();
    if(script_ele.parentNode) script_ele.parentNode.removeChild(script_ele);  
    script_ele = undefined;
    script_ele = document.createElement("script");
    script_ele.src = src_string;
    setTimeout(function(){
        document.body.appendChild(script_ele);
    }, 1000);
}
script_ele.src = src_string;
document.body.appendChild(script_ele);