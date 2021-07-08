# pgRouting

## Building the docker image

```bash
docker build -t camptocamp/osm2pgrouting:13-3.0-3.1.1-2.3.6 .
```

The image is build from a `pgRouting` image.

On top of it, `osm2pgrouting` is built from source and installed.

Then, `osmconvert` is installed too.

Finally, the initialization files are copied.

## Overwritting postgresql.conf

```bash
docker run --rm -v routing_perfs_db-data:/volume -v ${PWD}:/pgrouting alpine sh -c "cp /pgrouting/postgresql_tuned.conf /volume/postgresql.conf"
```

## Initializing the database

As stated on the [official postgres dockerhub page](https://hub.docker.com/_/postgres):

> **Initialization scripts**<br>
> If you would like to do additional initialization in an image derived from this one, add one or more _.sql, _.sql.gz, or \*.sh scripts under /docker-entrypoint-initdb.d (creating the directory if necessary).

Here, those files are copied from the initdb directory.

## Running the docker image outside compose

```bash
docker run --rm -p 5432:5432 -v pgrouting-db-data:/var/lib/postgresql/data -v ${PWD}/../osm:/osm -e POSTGRES_PASSWORD=postgres --name pgrouting camptocamp/osm2pgrouting:13-3.0-3.1.1-2.3.6
```

The `pgrouting-db-data` volume is persisted after the container has stopped.

```bash
docker exec -ti pgrouting bash
```
