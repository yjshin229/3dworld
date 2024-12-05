const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpackMode = process.env.NODE_ENV || 'development';

module.exports = {
    mode: webpackMode,
    entry: {
        main: './src/main.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].min.js',
    },
    devServer: {
        liveReload: true,
        historyApiFallback: true, // Enables SPA fallback for routing
        static: {
            directory: path.resolve(__dirname, 'dist'), // Serve static files
        },
        port: 3000, // Development server port
        open: true, // Automatically opens the browser
    },
    optimization: {
        minimize: webpackMode === 'production', // Only minimize in production mode
        minimizer: webpackMode === 'production' ? [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true, // Remove console.log in production
                    },
                },
            }),
        ] : [],
        splitChunks: {
            chunks: 'all', // Split chunks to optimize bundle size
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/, // Exclude third-party libraries
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'], // Use source maps for debugging
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'], // Handle CSS imports
            },
            {
                test: /\.(png|jpg|gif|glb|gltf|mp3|ogg)$/, // Handle assets like images and sounds
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name][ext]', // Place assets in 'assets' folder
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: webpackMode === 'production' ? {
                collapseWhitespace: true,
                removeComments: true,
            } : false,
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: "./src/main.css", to: "./main.css" },
                // { from: './src/models', to: './models' }, // Copy models folder
                // Add more patterns if needed
            ],
        }),
    ],
    resolve: {
        extensions: ['.js'], // Resolve these extensions by default
    },
    devtool: webpackMode === 'development' ? 'source-map' : false, // Source maps for development
};
