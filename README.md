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

To backup the imported data that was stored in the `db-data` volume, turn down the composition but keep the volume, then run the following:

```bash
docker run --rm -v routing_perfs_db-data:/volume -v /tmp:/backup alpine tar -cjf /backup/routing_archive.tar.bz2 -C /volume ./
```

This will create a new file on the host machine, `/tmp/routing_archive.tar.bz2`, owned by `root`.

To restore the backup, just paste the `routing_archive.tar.bz2` to `/tmp/` on the host machine, then run the following:

```bash
docker run --rm -v routing_perfs_db-data:/volume -v /tmp:/backup alpine sh -c "rm -rf /volume/{*,.*} ; tar -C /volume/ -xjf /backup/routing_archive.tar.bz2"
```
