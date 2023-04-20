import { ViteDevServer } from 'vite';

const entryPath: string = "./src/main/mainEntry.ts";
const outPath: string =  "./dist/mainEntry.js";

// devPlugin 插件作用是监听 vite 启动时去触发 electron 启动 mainEntry.ts 
export let devPlugin = () => {
  return {
    name: "dev-plugin",
    configureServer(server: ViteDevServer){
      // electron 的内置模块都是通过 EJS Module 的形式导出的, 借助 esbuild 进行转换, 可使用 ES Module 的形式导出
      require("esbuild").buildSync({
        entryPoints: [entryPath], // 需转换处理的文件
        bundle: true,
        platform: "node", // 平台
        outfile: outPath, // 转换后的输出文件
        external: ["electron"], // 排除在外, 无需转换处理
      });
      // 监听 vite 的启动
      server.httpServer.once("listening",() => {
        // 创建一个子进程来执行命令, 创建子进程
        let { spawn } = require("child_process");
        let addressInfo: any = server.httpServer.address();
        let httpAddress = `http://${addressInfo.address}:${addressInfo.port}`;
        const command = require("electron").toString();
        console.log("\n[httpAddress] => ", httpAddress);
        console.log("\n[command] => ", command);
        let electronProcess = spawn(
          // 要执行的命令
          command,
          // 字符串参数列表
          [outPath, httpAddress],
          // 配置项
          {
            cwd: process.cwd(), // 设置触发的根目录，process.cwd() 的返回值是当前项目的根目录
            stdio: "inherit", // 设置执行代码时, 子进程继承主进程的IO控制流。从而使子进程的事件输出会打印到主进程中
          }
        )
        // 监听 electron 子进程的退出事件
        electronProcess.on("close", () => {
          server.close(); // 关闭 vite 的 http 服务
          process.exit(); // 结束父进程
        })
      });
    }
  }
}

// 把部分常用的 node 模块以及 electron 内置模块提供给 vite-plugin-optimizer 插件进行处理，
// 从而可以在文件中使用 import 的方式引入这些模块
export let getReplacer = () => {
  let externalModels = ["os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
  let result = {};
  for(let item of externalModels){
    result[item] = () => ({
      find: new RegExp(`^${item}$`),
      code: `const ${item} = require("${item}"); export {${item} as default}`,
    });
  }
  result["electron"] = () => {
    let electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
    return {
      find: new RegExp("^electron$"),
      code: `const {${electronModules}} = require("electron"); export {${electronModules}}`,
    }
  };

  return result;
}