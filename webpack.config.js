const path = require('path');
const pkg = require('./package.json');
const libraryName= pkg.name;

module.exports = {
  entry: './src/index.js',
  // output: {
  //   path: path.resolve(__dirname, 'build'),
  //   filename: 'index.js',
  //   libraryTarget: 'commonjs2' // THIS IS THE MOST IMPORTANT LINE! :mindblow: I wasted more than 2 days until realize this was the line most important in all this guide.
  // },
  output: {      
    path: path.join(__dirname, './dist'),      
    filename: 'index.js',
    library: libraryName,
    libraryTarget: 'umd',
    publicPath: '/dist/',
    umdNamedDefine: true  
  },
  resolve: {      
    alias: {          
      'react': path.resolve(__dirname, './node_modules/react')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components|build)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  // externals: {
  //   'react': 'commonjs react' // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
  // }
  externals: {      
    // Don't bundle react or react-dom      
    react: {          
        commonjs: "react",          
        commonjs2: "react",          
        amd: "React",          
        root: "React"      
    }
  }
};