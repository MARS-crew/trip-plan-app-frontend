const path = require('path');

module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts/'],
  dependencies: {
    '@react-native-google-signin/google-signin': {
      platforms: {
        android: {
          sourceDir: path.resolve(__dirname, 'node_modules/@react-native-google-signin/google-signin/android'),
          packageImportPath: 'import com.reactnativegooglesignin.RNGoogleSigninPackage;',
          packageInstance: 'new RNGoogleSigninPackage()',
        },
      },
    },
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
