var cacheName = "nodethings";
var filesToCache = [
  "/",
  "/jquery.min.js",
  "/js/bootstrap.min.js",
  "/javascripts/idb.js",
  "/javascripts/pageInit.js",
  "/javascripts/likeButton.js",
  "/javascripts/newStory.js",
  "/stylesheets/style.css",
];

self.addEventListener("install", (e) => {
  console.log("[ServiceWorker] Install");
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log("[ServiceWorker] Caching app shell...");
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("activate", (e) => {
  console.log("[ServiceWorker] Activate");
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== cacheName) {
            // && key !== dataCacheName) {
            console.log(`[ServiceWorker] Removing old cache ${key}...`);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// cacheAndNetworkRace?
//

const cacheFallingBackToNetwork = (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
};

const networkFallingBackToCache = (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
};

const genericFallback = (e, fallback) => {
  e.respondWith(
    caches
      .match(e.request)
      .then((response) => {
        return response || fetch(e.request);
      })
      .catch(() => {
        return caches.match(fallback);
      })
  );
};

self.addEventListener("fetch", (e) => {
  console.log(`[ServiceWorker] Fetch ${e.request.method} ${e.request.url}`);
  if (e.request.method === "POST") {
    return e.respondWith(fetch(e.request));
  }
  const path = getPathFromURL(e.request.url);
  // https://stackoverflow.com/a/2896642
  switch (true) {
    case /^\/$/.test(path):
      networkFallingBackToCache(e);
      break;
    case /^\/stories$/.test(path):
      networkFallingBackToCache(e);
      break;
    // Hex ID regex from https://stackoverflow.com/a/20988543
    case /^\/user\/[0-9a-fA-F]{24}\/stories$/.test(path):
      networkFallingBackToCache(e);
      break;
    case /ui-avatars.com/.test(path):
      genericFallback(e, '/images/defaultProfilePic.png')
      break;
    default:
      cacheFallingBackToNetwork(e);
      break;
  }
});

const getPathFromURL = (url) => {
  return url.replace("https://localhost:3000", "");
};
