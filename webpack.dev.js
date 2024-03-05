const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-source-map',
    optimization: {
        splitChunks: {
            chunks: 'initial',
            minSize: 2000,
            minChunks: 1,
            cacheGroups: {
                defaultVendors: {
                    chunks: 'initial',
                    name: 'modules_vendor',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                    name: 'modules_common',
                },
            },
        },
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        historyApiFallback: true,
        host: 'localhost',
        port: 8080,
        hot: true,
        proxy: {
            '/api': {
                target: 'https://openapi.youdao.com',
                secure: false,
                changeOrigin: true,
            },
            '/dict': {
                target: 'http://mobile.youdao.com',
                changeOrigin: true,
            },
        },
    },
    plugins: [new CleanWebpackPlugin()],
})
