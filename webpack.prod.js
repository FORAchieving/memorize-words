const path = require('path')
const fs = require('fs')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

const Webpack = require('webpack')

function getDllFilesPath() {
    const dirPath = path.resolve(__dirname, 'dist/dll')
    const files = fs.readdirSync(dirPath)
    const dll = []

    files.forEach((file) => {
        if (file.endsWith('.json')) {
            dll.push(
                new Webpack.DllReferencePlugin({
                    context: __dirname, // 与DllPlugin中的那个context保持一致
                    manifest: require(`./dist/dll/${file}`),
                }),
            )
        } else if (file.endsWith('.dll.js')) {
            dll.push(
                new AddAssetHtmlPlugin({
                    filepath: path.resolve(__dirname, './dist/dll/' + file),
                    outputPath: 'dll',
                    publicPath: 'dll',
                }),
            )
        }
    })

    return dll
}

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[fullhash:8].js',
        publicPath: '.', // 资源获取的目录
    },
    optimization: {
        minimize: false,
        usedExports: true,
        sideEffects: false,
        splitChunks: {
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
    plugins: [
        new CleanWebpackPlugin(),
        // ...getDllFilesPath(),
        // new BundleAnalyzerPlugin(),
    ],
})
