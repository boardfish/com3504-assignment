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