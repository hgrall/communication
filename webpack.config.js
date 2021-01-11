const HtmlWebpackPlugin = require('html-webpack-plugin')
var config = {
    entry: {
        tchatReact: "./build/tchat/client/renduTchat.js",
        distributionReact: "./build/distribution/client/renduJeu1.js"
    }, // Les clés remplacent name ci-dessous.
    output: {
        path: __dirname + "/build",
        filename: "[name].client.js"
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Tchat v1',
            template: 'site/interfaceTchat.html',
            filename: "interfaceTchat.html",
            inject: false
        }),
        new HtmlWebpackPlugin({
            title: 'Jeu 1 v0',
            template: 'site/interfaceJeu1Distribution.html',
            filename: "interfaceJeu1Distribution.html",
            inject: false
        })
    ]
};

module.exports = config;

