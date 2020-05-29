# COM3504 Assignment

by Daniel Ryder, Matthew Swinbank, Simon Fish

---

## Running in development

Can either be done using a local Node.js and MongoDB server or Docker.

### Local

#### Local Node.js (untested on Linux)

Install dependencies with `npm install`, then run `bin/www`.

### Docker environment

Run `docker-compose up` to bring the web server live on
`https://localhost:3000`. It's necessary to specify `https` as this is needed
for the service worker.

### HTTPS configuration (Chrome)

To add the root certificate, navigate to
`chrome://settings/certificates`, switch to the **Authorities** tab, then select
**Import**. Import `private/RootCA.crt`. You may then need to close and reopen
Chrome. After this, if you navigate to `https://localhost:3000`, you should then
see a lock icon before `localhost:3000` in your address bar. This means that
your requests recognise a valid certificate, and the service worker should
register.

If dependencies change, run `docker-compose build` instead of `npm install`.
This will install dependencies inside the containers that are used to run the
app.

## Seeding

Run `node seeder.js` to seed the database with the users, stories, and ratings
from `usersStoriesAndRatings.json`. Note that the structure is important - it
should reflect the structure that's already in that file. (That means if you're
marking this, it's safe to replace it with your JSON file!) If you're using
Docker, bring up the database in the background with `docker-compose up -d db`,
then call `docker-compose run --rm web seeder.js`.

## Checkout testing

These are the steps we have run through in order to test the application on our
end:

1. Make an account using the form.
1. Log in with the account.
1. Create a post.
1. Rate the post.
1. Refresh the page to see that the rating was applied. (It's submitted with
   AJAX, but isn't updated in the UI until a refresh.)
1. Open another browser.
1. Create another account.
1. Log in with it.
1. Create a post.
1. Check it showed up on the other browser. (Socket.IO)
1. Click on one of the users and make sure their wall only has their posts on it.
1. Go offline and make sure the page renders.
1. Make a post while offline (expect an alert), then come back online and
   refresh - it should submit when you do.
1. Check that /users/stories/me works as expected when authenticated (shows only
   your posts)) and when not authenticated (404s and returns a friendly error
   page).