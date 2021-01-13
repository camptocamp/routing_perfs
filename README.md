# Performance comparison for routing engines

## Dependencies

* docker-compose: 1.27.4
* docker: 20.10.0

Those are tested versions, inferior versions might still be compatible.


## Running the servers

To run all the servers at the same time:

```bash
docker-compose up
```

It will start:

* pgRouting: `psql -h localhost -p 5432 -U routing_user routing_db` with `routing` as password


## Preparing OSM data

### pgRouting

TODO: prerequisite, volumes, script, estimated time

```bash
osmconvert /home/osm/ile-de-france-latest.osm.pbf --drop-author --drop-version --out-osm -o=/home/osm/ile-de-france-latest-reduc.osm
```


## Importing OSM data

### pgRouting

TODO: prerequisite, volumes, script, estimated time

```bash
osm2pgrouting --f /home/osm/ile-de-france-latest-reduc.osm --conf /usr/local/share/osm2pgrouting/mapconfig.xml --dbname routing_db --username routing_user --clean
```
