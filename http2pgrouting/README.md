# http2pgrouting

## Building the docker image

```bash
docker build -t camptocamp/http2pgrouting .
```

The image is build from a `node` image.

Source files are copied to build a minimalist `Hapi` server, with `Sequelize` access to a `PostgreSQL` database.

## Running the docker image outside compose

```bash
docker run --rm --entrypoint bash -ti -p 3000:3000 -v ${PWD}:/http2pgrouting --name http2pgrouting camptocamp/http2pgrouting
```

Here, the volume allows for dynamically changing the source code. Be careful, as these changes won't be reflected in the docker image until you rebuild it.

```bash
node src/index.js
```

## Sharing a network with pgrouting outside compose

To create the network:

```bash
docker network create --driver bridge pgrouting-net
```

To connect the containers to the network:

```bash
docker network connect pgrouting-net pgrouting
docker network connect pgrouting-net http2pgrouting
```
