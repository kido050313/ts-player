const path = require('path');
const HtmlWebpakPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: "./src/main.ts",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "main.js"
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        open: false // 自动打开浏览器
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: [
                    path.resolve(__dirname, 'src/components')
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: {  
                            localIdentName: '[name]__[local]--[hash:base64:5]'
                        }
                    }
                }],
                include: [
                    path.resolve(__dirname, 'src/components')
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: ['file-loader']
            },
            {
                test: /\.ts$/,
                use: ['ts-loader'],
                exclude: '/node_modules/'
            }
        ]
    },
    plugins: [
        new HtmlWebpakPlugin({
            template: './src/index.html'
        }),
        new CleanWebpackPlugin(),
    ],
    mode: "development"
}

// module.exports = config;