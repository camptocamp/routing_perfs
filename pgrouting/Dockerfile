FROM pgrouting/pgrouting:13-3.0-3.1.1

ENV OSM2PGROUTING_VERSION 2.3.6

# osm2pgrouting
RUN set -ex \
 && apt update \
 && apt install -y \
        expat \
        libexpat1-dev \
        libboost-dev \
        libboost-program-options-dev \
        libpqxx-dev \
 && apt install -y \
        build-essential \
        cmake \
        wget \
        unzip \
 && apt install -y \
        osmctools \
 && wget -O osm2pgrouting.zip "https://github.com/pgRouting/osm2pgrouting/archive/v${OSM2PGROUTING_VERSION}.zip" \
 && mkdir -p /usr/src/osm2pgrouting \
 && unzip osm2pgrouting.zip -d /usr/src/osm2pgrouting \
 && rm osm2pgrouting.zip \
 && cd "/usr/src/osm2pgrouting/osm2pgrouting-${OSM2PGROUTING_VERSION}" \
 && cmake -H. -Bbuild \
 && cd build \
 && make \
 && make install \
 && cd / \
 && rm -rf /usr/src/osm2pgrouting \
 && apt purge -y --autoremove \
        build-essential \
        cmake \
        wget \
        unzip \
        expat \
        libexpat1-dev \
        libboost-dev \
        libboost-program-options-dev \
 && rm -rf /var/lib/apt/lists/*

# TODO: split to new docker image from here on
COPY --chown=postgres ./initdb/* /docker-entrypoint-initdb.d/
