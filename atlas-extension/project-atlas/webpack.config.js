const path = require("path");

module.exports = (env, argv) => ({
    entry: {
        app: "./src/app/index.tsx",
    },
    output: {
        publicPath: "/",
        path: path.resolve(__dirname, "out/app"),
        filename: "[name].js",
    },
    devtool: argv.mode === "development" ? "eval-source-map" : undefined,
    optimization: {
        minimize: true,
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx", ".json"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
                options: {},
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                    },
                ],
            },
            {
                test: /\.png/,
                type: "asset/resource",
            },
        ],
    },
    performance: {
        hints: false,
    },
});
