const path = require('path'); //引入内置path方便得到绝对路径
const HtmlWebpackPlugin = require('html-webpack-plugin'); //引入模板组件
const webpack = require('webpack');

/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
	mode: 'development', //开发模式
	entry: './demos/test-fc/main.tsx', //入口文件地址
	output: {
		path: path.resolve(__dirname, './dist'), //出口文件，即打包后的文件存放地址
		filename: 'bundle.js', //文件名
		clean: true
	},
	devServer: {
		hot: true
	},
	devtool: 'cheap-module-source-map',
	resolve: {
		extensions: ['.ts', '.js', '.cjs', '.json', '.tsx'], //配置文件引入时省略后缀名
		alias: {
			react: path.resolve(__dirname, './packages/react/'),
			'react-dom': path.resolve(__dirname, './packages/react-dom/'),
			hostConfig: path.resolve(
				__dirname,
				'./packages/react-dom/src/hostConfig.ts'
			)
		}
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/, //匹配规则 以ts结尾的文件
				loader: 'ts-loader' //对应文件采用ts-loader进行编译
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html' //使用模板地址
		}),
		new webpack.DefinePlugin({
			__DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
		})
	],
	devServer: {
		compress: true,
		port: 8000,
		open: true
	}
};
