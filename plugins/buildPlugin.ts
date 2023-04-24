import fs from 'fs';
import path from 'path';

const ENTRY_PATH = "./src/main/mainEntry.ts";
const OUT_PATH = "./dist/mainEntry.js";
const CUR_PATH = process.cwd();

class BuildObj{
  constructor(){}

  // 编译主进程代码 (因为 Vite 编译前会清空 dist 目录，故需重新编译一遍)
  buildMain(){
    require("esbuild").buildSync({
      entryPoints: [ENTRY_PATH],
      bundle: true,
      platform: "node",
      minify: true,
      outfile: OUT_PATH,
      external: ["electron"],
    })
  }

  // 为生产环境准备 package.json,
  preparePackageJson(){
    // 读取 package.json 文件内容
    let pkgJsonPath = path.join(CUR_PATH, "package.json");
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    // 固定 electron 的版本号
    let electronConfig = localPkgJson.devDependencies.electron.replace("^", "");
    localPkgJson.main = "mainEntry.js";
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;
    localPkgJson.devDependencies = {electron: electronConfig};
    let tarJsonPath = path.join(CUR_PATH, "dist", "package.json");
    fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
    fs.mkdirSync(path.join(CUR_PATH, "dist/node_modules"));
  }

  // 使用 electron-builder 制作安装包
  buildInstaller(){
    let options = {
      config: {
        directories: {
          output: path.join(CUR_PATH, "release"),
          app: path.join(CUR_PATH, "dist"),
        },
        files: ["**"],
        extends: null,
        productName: "eApp",
        appId: "com.juejin.desktop",
        asar: true,
        nsis: {
          oneClick: true,
          perMachine: true,
          allowToChangeInstallationDirectory: false,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "eAppShortcut",
        },
        publish: [{provider: "generic", url: "http://localhost:5000/"}],
      },
      project: CUR_PATH,
    };

    return require("electron-builder").build(options);
  }
}



// 打包插件
export let buildPlugin = () => {
   return {
    name: "build-plugin",
    closeBundle: () => {
      let buildObj = new BuildObj();
      buildObj.buildMain();
      buildObj.preparePackageJson();
      buildObj.buildInstaller();
    }
   }
}