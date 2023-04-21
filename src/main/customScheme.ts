import { protocol } from 'electron';
import fs from 'fs';
import path from 'path';

const EXT_MAP = {
  JS: ".js",
  HTML: ".html",
  CSS: ".css",
  SVG: ".svg",
  JSON: ".json",
};

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

protocol.registerSchemesAsPrivileged([{scheme: "app", privileges: schemeConfig}]);

export class CustomScheme{
  // 根据文件扩展名获取相应的 mime-type
  private static getMimeType(extension: string){
    return MIME_TYPE_MAP[extension];
  }

  // 注册自定义app协议
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