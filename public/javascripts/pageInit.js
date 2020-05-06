registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js')
  } else {
    console.log('Your browser cannot register a service worker.')
  }
}

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

// Caches a story.
cacheStory = (object) => {
  initDatabase()
    .then(async (db) => {
      var tx = db.transaction("stories", "readwrite");
      var store = tx.objectStore("stories");
      const newValue = await store.add(object);
      console.log("Could not post story. Caching...");
      console.log(object);
      console.log(newValue);
      return tx.complete;
    })
    .catch((err) => console.log(err));
};

// Gets stories from the cache
// TODO: try to post them.
const getStoriesFromCache = () => {
  return initDatabase()
    .then(async (db) => {
      var tx = db.transaction("stories", "readonly");
      var store = tx.objectStore("stories");
      var stories = await store.getAll();
      return stories;
    })
    .catch((err) => console.log(err));
};

const loadStories = () => {
  $.ajax({
    // Base on current pathname, so /users/:id/stories only gets user stories
    url: window.location.pathname,
    success: (stories) => {
      renderStories(stories);
    },
    error: () => {
      // FIXME: Display user-friendly error - this shouldn't ever have to appear
    },
    contentType: "application/json",
    dataType: "json",
  });
};

const renderStories = (
  stories,
) => {
  stories.forEach((story) => {
    // Render if they aren't already rendered.
    if ($(`#story-${story._id}`).length === 0) {
      $.get(`/stories/${story._id}`, {}, (html) => {
        $("main.container").append(html);
      });
    }
  });
};

registerServiceWorker()