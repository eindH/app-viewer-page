'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "2efbb41d7877d10aac9d091f58ccd7b9",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "a68d2a28c526b3b070aefca4bac93d25",
"assets/NOTICES": "c274b6d0d50ae25943d0dda37cb3bc15",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "1905457d74b41e2e63f010c20b37431a",
"/": "1905457d74b41e2e63f010c20b37431a",
"live-data-viewer-app/.git/COMMIT_EDITMSG": "d778d8b1f42d0dd1bb284e5ca9549187",
"live-data-viewer-app/.git/config": "02d497b2a486aa54fd00db33374d3af3",
"live-data-viewer-app/.git/description": "a0a7c3fff21f2aea3cfa1d0316dd816c",
"live-data-viewer-app/.git/FETCH_HEAD": "f65181dfbf0825a9f5cdc98d087b628e",
"live-data-viewer-app/.git/HEAD": "4cf2d64e44205fe628ddd534e1151b58",
"live-data-viewer-app/.git/hooks/applypatch-msg.sample": "ce562e08d8098926a3862fc6e7905199",
"live-data-viewer-app/.git/hooks/commit-msg.sample": "579a3c1e12a1e74a98169175fb913012",
"live-data-viewer-app/.git/hooks/fsmonitor-watchman.sample": "ecbb0cb5ffb7d773cd5b2407b210cc3b",
"live-data-viewer-app/.git/hooks/post-update.sample": "2b7ea5cee3c49ff53d41e00785eb974c",
"live-data-viewer-app/.git/hooks/pre-applypatch.sample": "054f9ffb8bfe04a599751cc757226dda",
"live-data-viewer-app/.git/hooks/pre-commit.sample": "e4db8c12ee125a8a085907b757359ef0",
"live-data-viewer-app/.git/hooks/pre-push.sample": "3c5989301dd4b949dfa1f43738a22819",
"live-data-viewer-app/.git/hooks/pre-rebase.sample": "56e45f2bcbc8226d2b4200f7c46371bf",
"live-data-viewer-app/.git/hooks/pre-receive.sample": "2ad18ec82c20af7b5926ed9cea6aeedd",
"live-data-viewer-app/.git/hooks/prepare-commit-msg.sample": "2b5c047bdb474555e1787db32b2d2fc5",
"live-data-viewer-app/.git/hooks/update.sample": "517f14b9239689dff8bda3022ebd9004",
"live-data-viewer-app/.git/index": "aba1387918842109ce5c2954e6b4d9d8",
"live-data-viewer-app/.git/info/exclude": "036208b4a1ab4a235d75c181e685e5a3",
"live-data-viewer-app/.git/logs/HEAD": "66b865ebde0aed9309dbfa161a104a5a",
"live-data-viewer-app/.git/logs/refs/heads/master": "66b865ebde0aed9309dbfa161a104a5a",
"live-data-viewer-app/.git/logs/refs/remotes/origin/master": "3f14870ef939b06c26f7d4701cd88890",
"live-data-viewer-app/.git/objects/6f/9509c88bed7080d496fc5e1d87a9315e30549d": "c02716d7aaed30ce1c5697a2fb40d317",
"live-data-viewer-app/.git/objects/d1/e073fee65b04d279f6556e6925152d66bed8e5": "c0597687166a211782ab4f920b55ec75",
"live-data-viewer-app/.git/objects/df/e0770424b2a19faf507a501ebfc23be8f54e7b": "76f8baefc49c326b504db7bf751c967d",
"live-data-viewer-app/.git/refs/heads/master": "246246d264f4a7d417277d09fdaa325f",
"live-data-viewer-app/.git/refs/remotes/origin/master": "246246d264f4a7d417277d09fdaa325f",
"main.dart.js": "9bcf14676675217cee5fe3347d999fcd",
"manifest.json": "59a726adace2ca7941e2c12dd73e7ad5"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      // Provide a 'reload' param to ensure the latest version is downloaded.
      return cache.addAll(CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');

      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }

      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#')) {
    key = '/';
  }
  // If the URL is not the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache. Ensure the resources are not cached
        // by the browser for longer than the service worker expects.
        var modifiedRequest = new Request(event.request, {'cache': 'reload'});
        return response || fetch(modifiedRequest).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    return self.skipWaiting();
  }

  if (event.message === 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
