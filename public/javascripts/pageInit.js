initDatabase = () => {
  if (!("indexedDB" in window)) {
    console.log("This browser doesn't support IndexedDB");
    return;
  }

  var dbPromise = idb.openDb("test-db1", 1, (upgradeDb) => {
    console.log("Making a new object store...");
    if (!upgradeDb.objectStoreNames.contains("stories")) {
      var storiesOS = upgradeDb.createObjectStore("stories", {
        keyPath: "_id",
      });
      storiesOS.createIndex("user", "user");
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
      const cachedValue = await store.get(object._id);
      if (cachedValue == null) {
        const newValue = await store.add(object);
        console.log("Caching...");
        console.log(object);
      } else {
        console.log("Cached.");
        console.log(cachedValue);
      }
      return tx.complete;
    })
    .catch((err) => console.log(err));
};

const loadStories = () => {
  $.ajax({
    // Base on current pathname, so /users/:id/stories only gets user stories
    url: window.location.pathname,
    success: (stories) => {
      stories.forEach((story) => {
        // Cache if they're not already cached, then...
        firstOrCache(story);
        // ...render if they aren't already rendered.
        if ($(`#story-${story._id}`).length === 0) {
          $.get(`/stories/${story._id}`, {}, (html) => {
              $("main.container").append(html);
          });
        }
      });
    },
    contentType: "application/json",
    dataType: "json",
  });
};
