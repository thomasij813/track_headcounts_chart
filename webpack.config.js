const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
    mode: 'development',
    entry: ['@babel/polyfill', './src/scripts/index.js'],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js'
    }, 
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
            }
        }, {
            type: 'javascript/auto',
            test: /\.json$/,
            exclude: /node_modules/,
            use: {
                loader: 'file-loader',
                options: {
                    name: 'data/[name].[ext]'
                }
            }
        }, {
            test: /\.csv$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: 'data/[name].[ext]'
                }
            }]
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
}

module.exports = config;