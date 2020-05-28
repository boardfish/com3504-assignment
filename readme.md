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