# 🍔 Safka Online 🍔

### What is this?

This is a monorepo for the [Safka Online](https://safka.online/) project which archives the Juhannuskukkula's Safka canteen's menu, allows it to be queried from an [API](https://api.safka.online/v1/menu), and makes it more accessible to read through our homepage.

### Project Structure

| Project | Description |
|-------------|---|
| [api-service](https://github.com/Tembero11/Safka/tree/main/api-service) | Node.js API Backend |
| [web-service](https://github.com/Tembero11/Safka/tree/main/web-service) | Next.js Frontend |
| [nginx-service](https://github.com/Tembero11/Safka/tree/main/nginx-service) | Reverse-Proxy Configured For Docker |
| [app](https://github.com/Tembero11/Safka/tree/main/app) | Flutter Mobile App (Discontinued) |

### Running and stopping containers

An extremely small script was made to reduce some typing while stopping and starting containers.
Usage is dead-simple: `./mgr <run|stop> [dev]`
  where: **run|stop** runs or stops, and **dev** can be used for either run|stop to use docker-compose.dev.yml instead, which doesn't start or automate nginx.

### Contributors

* [Tembero11](https://github.com/Tembero11)
* [Finnbyte](https://github.com/Finnbyte)
