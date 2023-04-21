import fs from 'fs';
import path from 'path';

const entryPath = "./src/main/mainEntry.ts";
const outPath = "./dist/mainEntry.js";

class BuildObj{
  constructor(){}

  // 编译主进程代码
  buildMain(){
    require("esbuild").buildSync({
      entryPoints: [entryPath],
      bundle: true,
      platform: "node",
      minify: true,
      outfile: outPath,
      external: ["electron"],
    })
  }

  // 为生产环境准备 package.json,
  preparePackageJson(){
    let pkgJsonPath = path.join(process.cwd(), "package.json");
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    let electronConfig = localPkgJson.devDependencies.electron.replace("^", "");
    localPkgJson.main = "mainEntry.js";
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;
    localPkgJson.devDependencies = {electron: electronConfig};
    let tarJsonPath = path.join(process.cwd(), "dist", "package.json");
    fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
    fs.mkdirSync(path.join(process.cwd(), "dist/node_modules"));
  }

  // 使用 electron-builder 制作安装包
  buildInstaller(){
    let options = {
      config: {
        directories: {
          output: path.join(process.cwd(), "release"),
          app: path.join(process.cwd(), "dist"),
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
      project: process.cwd(),
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