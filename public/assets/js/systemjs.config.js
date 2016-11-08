/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'pt2/node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the client folder
      app: 'pt2/client',
      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      // other libraries
      'rxjs':                       'npm:rxjs',
      'angular2-in-memory-web-api': 'npm:angular2-in-memory-web-api',
      'primeng':                    'npm:primeng',
      'angular2-jwt':               'npm:angular2-jwt/angular2-jwt.js',
      'js-base64':                  'npm:js-base64/base64.js',
      'buffer':                     '@empty',
      'angular-2-local-storage':    'npm:angular-2-local-storage'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.js',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      },
      primeng: {
        defaultExtension: 'js'
      },
      'angular-2-local-storage': {
        main: 'dist/angular-2-local-storage.js',
        defaultExtension: 'js'
      },
    }
  });
})(this);
