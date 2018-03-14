var path = require('path');

var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.config.common.js');

module.exports = webpackMerge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',

    output: {
        path: path.resolve(__dirname + '/public/js/app'),
        publicPath: "/js/app/",
        filename: 'bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {loader: 'awesome-typescript-loader', options: {
                        transpileOnly: true
                    }},
                    {loader: 'angular2-template-loader'},
                    {loader: 'angular-router-loader'}
                ]
            },
            {
                test: /\.(gif|svg|jpg|png)$/,
                loader: "file-loader",
              },
            // { test: /(\.css$)/, loaders: ['style-loader', 'css-loader', 'postcss-loader'] }, { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
        ]

    }
});