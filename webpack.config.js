const nodeExternals = require("webpack-node-externals");
const path = require("path");
module.exports = {
    mode: "development",
    entry: "./index.ts",
    target: "node",
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "index.js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    externals: [nodeExternals()]
};