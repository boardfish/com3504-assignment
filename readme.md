# COM3504 Assignment

by Daniel Ryder, Matthew Swinbank, Simon Fish

---

## Running in development

Can either be done using a local Node.js and MongoDB server or Docker.

### Local

#### Development with the stub server (without Docker)

To develop against the stub server, set the SERVER_HOST environment variable to
`localhost:4000`. Then, if you're not using Docker, bring the stub server live
with `rackup -p 4000 -o 0.0.0.0 config.ru`, and run the Node.js server too.

#### Local Node.js (untested on Linux)

Install dependencies with `npm install`, then run `bin/www`.

### Docker environment

Run `docker-compose up` to bring the web server live on `localhost:3000` and the
Sinatra stub server live on `localhost:4000`.

If dependencies change, run `docker-compose build` instead of `npm install`.
This will install dependencies inside the containers that are used to run the
app.
