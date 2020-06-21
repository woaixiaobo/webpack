//引入nodejs的核心文件 path 用来创建绝对路径
const path = require("path");
//下载引入 处理html文件的依赖包  npm i html-webpack-plugin -D
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//定义绝对路径的方法
function resolve(relative) {
	return path.resolve(__dirname, relative);
}
process.env.NODE_ENV = "production";

module.exports = {
	entry: "./src/index.js", //入口文件
	// entry: {
	// 	// 多入口，多输出
	// 	main: "./src/index.js",
	// 	count: "./src/js/count.js",
	// },
	//代码分割
	optimization: {
		splitChunks: {
			chunks: "all",
		},
	},
	output: {
		path: undefined, //开发环境不需要输出
		filename: "js/[name].js", //输出的文件名
		publicPath: "/", //资源引入的公共路径
	},
	module: {
		rules: [
			// npm i css-loader style-loader -D
			{
				test: /\.css$/,
				use: [
					//执行顺序是从上到下
					// "style-loader",
					MiniCssExtractPlugin.loader, //代替上边的 style
					{
						loader: "css-loader",
						options: {
							importLoaders: 1
						}
					},
					// npm i postcss-loader postcss-flexbugs-fixes postcss-preset-env postcss-normalize -D
					{
						loader: require.resolve("postcss-loader"),
						options: {
							// Necessary for external CSS imports to work
							// https://github.com/facebook/create-react-app/issues/2677
							ident: "postcss",
							plugins: () => [
								require("postcss-flexbugs-fixes"), // 修改flex bugs
								require("postcss-preset-env")({
									// 做兼容性处理
									autoprefixer: {
										flexbox: "no-2009",
									},
									stage: 3,
								}),
								// Adds PostCSS Normalize as the reset css with default options,
								// so that it honors browserslist config in package.json
								// which in turn let's users customize the target behavior as per their needs.
								require("postcss-normalize")(), // 引入reset.css
							],
						},
					},
				],
			},
			//js的兼容性处理
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							[
								"@babel/preset-env",
								{
									useBuiltIns: "usage", //按需加载需要的兼容性包  需要下载依赖 core-js
									corejs: {
										version: 3
									},
									targets: "> 0.25%, not dead",
								},
							],
						],
					},
				},
			},
		],
	},
	//插件
	plugins: [
		//处理html文件
		new HtmlWebpackPlugin({
			template: resolve("public/index.html"), // 以index.html文件为模板创建新html文件
		}),
		// HMR功能插件
		new webpack.HotModuleReplacementPlugin(),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: "css/[name].css",
			chunkFilename: "[id].css",
		}),
	],
	//模式
	mode: "development",
	//开发服务器配置
	devServer: {
		contentBase: resolve("public"), // 需要开发服务器暴露的文件
		port: 9527, //服务器端口
		open: true, //是否自动打开浏览器
		compress: true, //启动gzip压缩
		hot: true, //开启HMR
	},
	// devtool: "cheap-module-source-map", //生成 map 文件 调试用
	resolve: {
		//配置别名
		alias: {
			"@src": resolve("src"),
		},
		extensions: [".jsx", ".js", ".json"], //自动查找拓展名
		modules: [resolve("node_modules"), "node_modules"], //查找modules文件的位置，这样就不会多层查找
	},
};