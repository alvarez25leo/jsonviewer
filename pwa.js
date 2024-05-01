import { writeFile } from 'fs';
import { randomBytes } from 'crypto';
import glob from 'glob';

const manifestFiles = [];
const rejExFiles = /(\.js|\.woff|\.woff2|\.jpg|\.png|\.txt|\.svg|\.ttf|\.ico|\.eot|\.gif|\.css)$/i;

const files = glob.sync('dist/**/**/**/**/**/*');

function hashFileVerification(length) {
	return randomBytes(Math.ceil(length / 2))
		.toString('hex')
		.slice(0, length);
}

function getDateHash() {
	const date = new Date();
	return `${date.getDate()}${
		date.getMonth() + 1
	}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
}

files.forEach((file) => {
	const fileItemName = file;
	if (rejExFiles.exec(fileItemName)) {
		manifestFiles.push({
			url: `${fileItemName.replace('dist', '')}`,
			revision: `${hashFileVerification(53)}${getDateHash()}`,
		});
	}
});

const workboxSW = `self.__precacheManifest =${JSON.stringify(manifestFiles)}
/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');
workbox.setConfig({
    debug: false,
});
workbox.core.setCacheNameDetails({
    prefix: 'app-manager-cache',
    suffix: 'v1',
    precache: 'precache',
    runtime: 'runtime'
});
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting()
    }
})
self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})

workbox.routing.registerRoute(
    ({url}) => url.origin === 'https://fonts.googleapis.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
            maxAgeSeconds: 60 * 60 * 24 * 365,
        }),
      ]
    })
)

workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|webp|svg)$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'cacheImages',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          purgeOnQuotaError: false,
        }),
      ],
    }),
    'GET'
)
workbox.routing.registerRoute(
    ({url}) => url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts-webfonts',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
        }),
      ],
    })
)

// Agregar rutas para otros archivos estáticos esenciales para el funcionamiento offline
workbox.routing.registerRoute(
    ({request}) => ['style', 'script', 'worker'].includes(request.destination),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'static-resources',
    })
);


// Asegurarse de que las peticiones para páginas sean gestionadas primero por la red
workbox.routing.registerRoute(
    ({request}) => request.destination === 'document',
    new workbox.strategies.NetworkFirst({
        cacheName: 'html-cache',
    })
);
`;

writeFile('dist/service-worker.js', workboxSW, 'utf-8', function (error) {
	if (error) return console.log(error);
	console.log(`${manifestFiles.length} files were generated in the sw.js file`);
});

writeFile('public/service-worker.js', workboxSW, 'utf-8', function (error) {
	if (error) return console.log(error);
	console.log(`${manifestFiles.length} files were generated in the sw.js file in public`);
});

