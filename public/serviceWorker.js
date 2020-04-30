var cacheName = "nodethings";
var filesToCache = [
  "/",
  "/jquery.min.js",
  "/js/bootstrap.min.js",
  "/javascripts/idb.js",
  "/javascripts/pageInit.js",
  "/javascripts/likeButton.js",
  "/javascripts/newStory.js",
];

self.addEventListener('install', (e) => {
  console.log('[ServiceWorker] Install')
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[ServiceWorker] Caching app shell...')
      return cache.addAll(filesToCache)
    })
  )
})

self.addEventListener('activate', (e) => {
  console.log('[ServiceWorker] Activate')
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== cacheName) { // && key !== dataCacheName) {
          console.log(`[ServiceWorker] Removing old cache ${key}...`)
          return caches.delete(key)
        }
      }))
    })
  )
})

self.addEventListener('fetch', (e) => {
  console.log(`[ServiceWorker] Fetch ${e.request.url}`)
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || 
       fetch(e.request).then((response) => {
         if (!response.ok) {
           console.log('Error: response not OK')
         }
       })
       .catch((error) => {
          console.log(`Error: ${error}`)
       })
    })
  )
}