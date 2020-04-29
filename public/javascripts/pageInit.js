initDatabase = () => {
  if (!("indexedDB" in window)) {
    console.log("This browser doesn't support IndexedDB");
    return;
  }

  var dbPromise = idb.openDb("test-db1", 1, (upgradeDb) => {
    console.log("Making a new object store...");
    if (!upgradeDb.objectStoreNames.contains("stories")) {
      var storiesOS = upgradeDb.createObjectStore("stories", {
        keyPath: "id"
      });
      storiesOS.createIndex('user', 'user')
    }
  });

  return dbPromise;
};

// Checks if something exists in the stories store, and adds it if it doesn't
firstOrCache = (object) => {
  initDatabase()
    .then(async (db) => {
      var tx = db.transaction("stories", "readwrite");
      var store = tx.objectStore("stories");
      const cachedValue = await store.get(object.id);
      if (cachedValue == null) {
        const newValue = await store.add(object);
        console.log('Caching...')
        console.log(object)
      } else {
        console.log('Cached.')
        console.log(cachedValue)
      }
      return tx.complete;
    })
    .catch((err) => console.log(err));
}