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

- pgrouting: PostgreSQL + PostGIS based routing engine [More info](pgrouting/README.md)
- http2pgrouting: Minimalist HTTP client too pgRouting [More info](http2pgrouting/README.md)
- valhalla: routing engine
- influxdb: database to store load tests results
- grafana: dashboard to visualize load tests results
- k6: load testing tool

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

TODO: prerequisite, volumes, script, estimated time, data loss analysis

#### osm2pgrouting

```bash
osm2pgrouting --f /osm/Melun-Fontainebleau-Montereau-reduc.osm --conf /usr/local/share/osm2pgrouting/mapconfig.xml --dbname routing_db --username routing_user --clean
```

#### osm2po

```bash
docker run --rm -v ${PWD}/osm2po:/osm2po -v ${PWD}/osm:/osm openjdk:14 bash -c "cd /osm && java -Xmx16g -jar /osm2po/osm2po-core-5.3.2-signed.jar prefix=idf tileSize=x cmd=tjsp /osm/ile-de-france-latest.osm.pbf"
```

```bash
docker exec -ti routing_perfs_pgrouting_1 bash
```

```bash
psql -U routing_user -d routing_db -q -f "/osm/idf/idf_2po_4pgr.sql"
psql -U routing_user -d routing_db -q -f "/osm/idf/idf_2po_vertex.sql"
```

```sql
CREATE INDEX idf_2po_4pgr_geom_idx
  ON idf_2po_4pgr
  USING GIST (geom_way);
```

#### backup

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

### pgRouting

To run pgRouting test script:

```bash
docker-compose run --rm k6 run /scripts/pgrouting.js
```

### Valhalla

To run Valhalla test script:

```bash
docker-compose run --rm k6 run /scripts/valhalla.js
```

## Visualizing results

Go to http://localhost:3000 to access Grafana.

Add an InfluxDB datasource:

- URL: http://influxdb:8086
- Database: k6

Import one of k6 recommended dashboards, for example: https://grafana.com/grafana/dashboards/2587
