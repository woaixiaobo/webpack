import "./css/main.css";
// import add from "./js/add";
// import "@babel/polyfill"; // 所有JS兼容性包,需要下载依赖包
/**
 * 没有加 '@babel/polyfill'  打包文件 48kb
  加上 '@babel/polyfill' 打包文件 447kb
    使用 core-js 方案 打包文件 144kb

 */
// console.log(add(1, 4));

const promise = new Promise((resolve) => resolve());
promise.then(() => console.log("bozai"));

// 代码分割
import("./js/count.js").then((module) => {
  // console.log(module.default(1, 2));
});