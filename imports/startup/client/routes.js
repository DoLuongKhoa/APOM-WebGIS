
// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/pm25_mod/pm25_mod.js';
import '../../ui/pages/pm25_landsat/pm25_landsat.js'

// Cấu hình route điều hướng đến ArcGis Js Api
const routePath = "https://js.arcgis.com/4.16/";

Router.route('/', {
    name: 'home',
    template: 'App_home',
    controller: PreloadController,

    preload: {
        // This is new:
        timeOut: 100,
        styles: [
            routePath + 'esri/themes/light/main.css',
        ],
        sync: routePath,
        // ...this is also new...
        onBeforeSync: function (fileName) {
            if (fileName === routePath) {
                var script = document.createElement('script');

                script.rel = 'preload javascript';
                script.type = 'text/javascript';
                script.src = routePath;
                script.onload = function () {
                    routeLoaded = true;
                };

                document.body.appendChild(script);

                return false;
            }
        },
        onSync: function (fileName) {
            if (routeLoaded && fileName === routePath) {
                // Check for Dojo
                return !!require && !!define;
            }
        },
        // ...and this is also new (optional)
        onAfterSync: function (fileName) {
            // We'll probably want to reload the main library,
            // so don't mark it cached (just testing...)
            return false;
        }
    }
});

Router.route('/pm25_mod', {
    name: 'not-found',
    template: 'pm25_mod',
    preload: {
        // This is new:
        timeOut: 5000,
        styles: [
            routePath + 'esri/themes/light/main.css',
        ],
        sync: routePath,
        // ...this is also new...
        onBeforeSync: function (fileName) {
            if (fileName === routePath) {
                var script = document.createElement('script');

                script.rel = 'preload javascript';
                script.type = 'text/javascript';
                script.src = routePath;
                script.onload = function () {
                    routeLoaded = true;
                };

                document.body.appendChild(script);

                return false;
            }
        },
        onSync: function (fileName) {
            if (routeLoaded && fileName === routePath) {
                // Check for Dojo
                return !!require && !!define;
            }
        },
        // ...and this is also new (optional)
        onAfterSync: function (fileName) {
            // We'll probably want to reload the main library,
            // so don't mark it cached (just testing...)
            return false;
        }
    }
});

Router.route('/pm25_landsat', {
    name: 'pm25-landsat',
    template: 'pm25_landsat',
    preload: {
        // This is new:
        timeOut: 5000,
        styles: [
            routePath + 'esri/themes/light/main.css',
        ],
        sync: routePath,
        // ...this is also new...
        onBeforeSync: function (fileName) {
            if (fileName === routePath) {
                var script = document.createElement('script');

                script.rel = 'preload javascript';
                script.type = 'text/javascript';
                script.src = routePath;
                script.onload = function () {
                    routeLoaded = true;
                };

                document.body.appendChild(script);

                return false;
            }
        },
        onSync: function (fileName) {
            if (routeLoaded && fileName === routePath) {
                // Check for Dojo
                return !!require && !!define;
            }
        },
        // ...and this is also new (optional)
        onAfterSync: function (fileName) {
            // We'll probably want to reload the main library,
            // so don't mark it cached (just testing...)
            return false;
        }
    }
});
