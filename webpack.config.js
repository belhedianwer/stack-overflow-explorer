const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
    const mode = argv.mode === 'production' ? 'production' : 'development';
    const minimize = mode === 'production';

    return {
        mode,
        entry: './js/popup.js',
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist/js')
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        },
        optimization: {
            minimize,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        format: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                }),
            ],
        },
        resolve: {
            extensions: ['.js']
        },
        devtool: minimize ? false : 'source-map'
    };
};
