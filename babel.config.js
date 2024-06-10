module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin',],
  env: {
    development: {
      plugins: [['@babel/plugin-transform-react-jsx', { runtime: 'classic' }]],
    },
  },
};
