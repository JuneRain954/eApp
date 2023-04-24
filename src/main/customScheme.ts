import { protocol } from 'electron';
import fs from 'fs';
import path from 'path';

// 后缀名映射集
const EXT_MAP = {
  JS: ".js",
  HTML: ".html",
  CSS: ".css",
  SVG: ".svg",
  JSON: ".json",
};

// mime 类型映射集
const MIME_TYPE_MAP = {
  [EXT_MAP.JS]: "text/javascript",
  [EXT_MAP.HTML]: "text/html",
  [EXT_MAP.CSS]: "text/css",
  [EXT_MAP.SVG]: "image/svg+xml",
  [EXT_MAP.JSON]: "application/json",
};


// 为自定义的app协议提供特权
let schemeConfig = {
  standard: true,
  supportFetchAPI: true,
  bypassCSP: true,
  corsEnable: true,
  stream: true,
};

/* tips: 在主进程 ready 前, 通过 protocol 对象的 registerSchemesAsPrivileged 方法
 *        为名为 app 的 scheme 注册了特权，例如：可以使用 FetchAPI, 绕过内容安全策略等
*/
protocol.registerSchemesAsPrivileged([{scheme: "app", privileges: schemeConfig}]);

export class CustomScheme{
  // 根据文件扩展名获取相应的 mime-type
  private static getMimeType(extension: string){
    return MIME_TYPE_MAP[extension];
  }

  /** 注册自定义app协议
   *    在主进程 ready 后, 通过 protocol 对象的 registerStreamProtocol 方法为名为 app
   *    的 scheme 注册一个回调函数。作用是当加载类似 app://index.html 这样的路径是，这个
   *    函数将被执行
   */
  static registerScheme(){
    protocol.registerStreamProtocol("app", (request, callback) => {
      let pathName = new URL(request.url).pathname;
      let extension = path.extname(pathName).toLowerCase();
      if(extension == ""){
        pathName = "index.html";
        extension = ".html";
      }
      let tarFile = path.join(__dirname, pathName);
      callback({
        statusCode: 200,
        headers: {
          "content-type": this.getMimeType(extension),
        },
        data: fs.createReadStream(tarFile),
      })
    })
  }
}