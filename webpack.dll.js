const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    mode: 'production',
    entry: {
        vender: ['react', 'react-dom', 'react-dom/client'],
        antd: ['antd'],
    },
    // optimization: {
    //     minimize: false,
    //     minimizer: [
    //         new TerserPlugin({
    //             terserOptions: {
    //                 keep_classnames: true,
    //                 keep_fnames: true,
    //             },
    //             extractComments: false,
    //         }),
    //     ],
    // },
    optimization: {
        minimize: false,
        usedExports: true,
        sideEffects: true,
    },
    output: {
        path: path.resolve(__dirname, 'dist/dll'),
        filename: '[name].dll.js',
        library: '[name]_dll',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DllPlugin({
            context: __dirname,
            name: '[name]_dll',
            path: path.resolve(__dirname, 'dist/dll/[name]-manifest.json'),
        }),
        // new BundleAnalyzerPlugin(),
    ],
}
