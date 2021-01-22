# Performance comparison for routing engines

## Dependencies

- docker-compose: 1.27.4
- docker: 20.10.0

Those are tested versions, inferior versions might still be compatible.

## Running the servers

To run all the servers at the same time:

```bash
docker-compose up
```

It will start the services:

- pgrouting: [More info](pgrouting/README.md)
- http2pgrouting: [More info](http2pgrouting/README.md)
- valhalla
- k6

### Networks

- pgrouting
- k6

### Volumes

- db-data

## Preparing OSM data

### pgRouting

TODO: prerequisite, volumes, script, estimated time

```bash
osmconvert /osm/Melun-Fontainebleau-Montereau.osm.pbf --drop-author --drop-version --out-osm -o=/osm/Melun-Fontainebleau-Montereau-reduc.osm
```

## Importing OSM data

### pgRouting

TODO: prerequisite, volumes, script, estimated time

```bash
osm2pgrouting --f /osm/Melun-Fontainebleau-Montereau-reduc.osm --conf /usr/local/share/osm2pgrouting/mapconfig.xml --dbname routing_db --username routing_user --clean
```

To backup the imported data that was stored in the `db-data` volume, turn down the composition but keep the volume, then run the following:

```bash
docker run --rm -v routing_perfs_db-data:/volume -v /tmp:/backup alpine tar -cjf /backup/routing_archive.tar.bz2 -C /volume ./
```

This will create a new file on the host machine, `/tmp/routing_archive.tar.bz2`, owned by `root`.

To restore the backup, just paste the `routing_archive.tar.bz2` to `/tmp/` on the host machine, then run the following:

```bash
docker run --rm -v routing_perfs_db-data:/volume -v /tmp:/backup alpine sh -c "rm -rf /volume/{*,.*} ; tar -C /volume/ -xjf /backup/routing_archive.tar.bz2"
```

### Valhalla

As described in [Build Valhalla with arbitrary OSM data](https://github.com/gis-ops/docker-valhalla#build-valhalla-with-arbitrary-osm-data):

> Just dump single or multiple OSM PBF files to your mapped custom_files directory, restart the container and Valhalla will start building the graphs[...]
> If you change the PBF files by either adding new ones or deleting any, Valhalla will build new tiles on the next restart.

## Running tests

To run `sh` inside the k6 container:

```bash
docker exec -ti routing_perfs_k6_1 sh
```

### pgRouting

To run pgRouting test script:

```sh
k6 run scripts/pgrouting.js
```

### Valhalla

To run Valhalla test script:

```sh
k6 run scripts/valhalla.js
```
