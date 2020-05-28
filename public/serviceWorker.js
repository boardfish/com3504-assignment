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

// Promise.race is no good to us because it rejects if
// a promise rejects before fulfilling. Let's make a proper
// race function:
// Used only in cacheAndNetworkRace()
promiseAny = (promises) => {
  return new Promise((resolve, reject) => {
    // make sure promises are all promises
    promises = promises.map((p) => Promise.resolve(p));
    // resolve this promise as soon as one resolves
    promises.forEach((p) => p.then(resolve));
    // reject if all promises reject
    promises
      .reduce((a, b) => a.catch(() => b))
      .catch(() => reject(Error("All failed")));
  });
};

const cacheAndNetworkRace = (e) => {
  e.respondWith(promiseAny([caches.match(e.request), fetch(e.request)]));
};

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

const cacheThenNetwork = (e) => {
  e.respondWith(
    caches.open(cacheName).then((cache) => {
      return fetch(e.request).then((response) => {
        cache.put(e.request, response.clone());
        return response;
      });
    })
  );
}

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

const staleWhileRevalidate = (e) => {
  e.respondWith(
    caches.open(cacheName).then((cache) => {
      return cache.match(e.request).then((response) => {
        var fetchPromise = fetch(e.request).then((networkResponse) => {
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    })
  );
};

self.addEventListener("fetch", (e) => {
  console.log(`[ServiceWorker] Fetch ${e.request.method} ${e.request.url}`);
  const path = getPathFromURL(e.request.url);
  // https://stackoverflow.com/a/2896642
  switch (true) {
    // User sign-in - never cache
    case e.request.method === "POST":
      console.log("User sign-in request")
      e.respondWith(fetch(e.request))
      break;
    // All stories
    case /^\/$/.test(path):
      cacheThenNetwork(e);
      break;
    // All stories
    case /^\/stories$/.test(path):
      cacheThenNetwork(e);
      break;
    // User's stories
    // Hex ID regex from https://stackoverflow.com/a/20988543
    case /^\/user\/[0-9a-fA-F]{24}\/stories$/.test(path):
      cacheThenNetwork(e);
      break;
    // Avatars
    case /ui-avatars.com/.test(path):
      genericFallback(e, "/images/defaultProfilePic.png");
      break;
    default:
      staleWhileRevalidate(e);
      break;
  }
});

const getPathFromURL = (url) => {
  return url.replace("https://localhost:3000", "");
};
