const HtmlWebpackPlugin = require('html-webpack-plugin')

const dotEnv = require('dotenv-webpack')
const CopyPlugin = require("copy-webpack-plugin");

var config = {
    entry: {
        distributionReact: "./build/distribution/client/renduJeu1.js",
        accueilReact: "./build/accueil/renduAccueil.js",
    }, // Les clés remplacent name ci-dessous.
    output: {
        path: __dirname + "/build",
        filename: "[name].client.js",
        publicPath: "/" // added to the js name when injected in the HTML
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    mode: "production",
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
            title: 'Jeu 1 v0',
            template: 'site/interfaceTemplate.html',
            filename: "interfaceJeu1Distribution.html",
            chunks: ['distributionReact']
        }),
        new HtmlWebpackPlugin({
            title: 'Accueil',
            template: 'site/interfaceTemplate.html',
            filename: "interfaceAccueil.html",
            chunks: ['accueilReact']
        }),
        new dotEnv({
            systemvars: true // privilégier les variables d'environnement (Heroku's config vars), pas un fichier .env
        }),
    ]
};

module.exports = config;

