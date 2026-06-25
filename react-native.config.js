const path = require('path');

module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts/'],
  dependencies: {
    '@react-native-seoul/naver-login': {
      platforms: {
        android: {
          sourceDir: path.resolve(__dirname, 'node_modules/@react-native-seoul/naver-login/android'),
          packageImportPath: 'import com.dooboolab.naverlogin.RNNaverLoginPackage;',
          packageInstance: 'new RNNaverLoginPackage()',
        },
      },
    },
  },
};
