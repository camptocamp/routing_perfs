#! /bin/sh

java -Xmx1g -jar osm2po-core-5.3.2-signed.jar prefix=hh tileSize=x http://download.geofabrik.de/europe/germany/hamburg-latest.osm.pbf postp.0.class=de.cm.osm2po.plugins.postp.PgRoutingWriter
