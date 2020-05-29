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

/**
 * This function implements the cache and network race algorithm from
 * https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-and-network-race
 * (i.e. the lecture slides).
 * @param {FetchEvent} e a JS FetchEvent
 * @returns {undefined} FetchEvent.respondWith() returns undefined.
 */
const cacheAndNetworkRace = (e) => {
  e.respondWith(promiseAny([caches.match(e.request), fetch(e.request)]));
};

/**
 * This function implements the cache falling back to network algorithm from
 * https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-falling-back-to-network
 * (i.e. the lecture slides).
 * @param {FetchEvent} e a JS FetchEvent
 * @returns {undefined} FetchEvent.respondWith() returns undefined.
 */
const cacheFallingBackToNetwork = (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
};

/**
 * This function implements the network falling back to cache algorithm from
 * https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#network-falling-back-to-cache
 * (i.e. the lecture slides).
 * @param {FetchEvent} e a JS FetchEvent
 * @returns {undefined} FetchEvent.respondWith() returns undefined.
 */
const networkFallingBackToCache = (e) => {
  e.respondWith(
    caches.open(cacheName).then((cache) => {
      return fetch(e.request).then((response) => {
        cache.put(e.request, response.clone());
        return response;
      }).catch(() => {
      return caches.match(e.request);
    });
    })
  );
};

/**
 * This function implements the cache then network algorithm from
 * https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-then-network
 * (i.e. the lecture slides).
 * @param {FetchEvent} e a JS FetchEvent
 * @returns {undefined} FetchEvent.respondWith() returns undefined.
 */
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

/**
 * This function implements the generic fallback algorithm from
 * https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#generic-fallback
 * (i.e. the lecture slides).
 * @param {FetchEvent} e a JS FetchEvent
 * @returns {undefined} FetchEvent.respondWith() returns undefined.
 */
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


/**
 * This function implements part of the stale while revalidate algorithm from
 * https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate
 * (i.e. the lecture slides).
 * @param {FetchEvent} e a JS FetchEvent
 * @returns {undefined} FetchEvent.respondWith() returns undefined.
 */
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
  // This switch decides which strategy to employ based on the path of the
  // request
  switch (true) {
    // ServiceWorker not responsible for caching POSTs - that's down to AJAX
    // failure callbacks 
    case e.request.method === "POST":
      console.log(`Not handling ${e.request.url}`)
      e.respondWith(fetch(e.request))
      break;
    // All stories: /, /stories, /user/:userId/stories
    case /\?json$/.test(path):
      cacheThenNetwork(e);
      break;
    // Avatars
    case /ui-avatars.com/.test(path):
      genericFallback(e, "/images/defaultProfilePic.png");
      break;
    default:
      networkFallingBackToCache(e);
      break;
  }
});


/**
 * This function gets the path from a given URL by removing the protocol,
 * hostname, and port.
 * @param {string} url a URL
 * @returns {string} url with the first occurrence of https://localhost:3000
 * removed 
 */
const getPathFromURL = (url) => {
  return url.replace("https://localhost:3000", "");
};
