// webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/popup/Popup.jsx',
    output: {
        path: path.resolve(__dirname, 'src/popup'),
        filename: 'Popup.js',
    },
    mode: 'production',
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
        ],
    },
};
