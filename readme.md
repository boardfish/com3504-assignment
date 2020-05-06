# COM3504 Assignment

by Daniel Ryder, Matthew Swinbank, Simon Fish

---

## Running in development

Can either be done using a local Node.js and MongoDB server or Docker.

### Local

#### Local Node.js (untested on Linux)

Install dependencies with `npm install`, then run `bin/www`.

### Docker environment

Run `docker-compose up` to bring the web server live on `localhost:3000`.

If dependencies change, run `docker-compose build` instead of `npm install`.
This will install dependencies inside the containers that are used to run the
app.
