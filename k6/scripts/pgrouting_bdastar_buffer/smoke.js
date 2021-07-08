import { check, sleep } from "k6";
import http from "k6/http";

export let options = {
  vus: 1, // 1 user looping for 1 minute
  duration: "1m",
  thresholds: {
    http_req_duration: ["p(99)<1500"], // 99% of requests must complete below 1.5s
  },
};

export default function () {
  const url = "http://http2pgrouting:3000/send";
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  const data =
    "queryString=\
    SELECT * FROM pgr_bdAstar(\
        '\
            SELECT\
                gid AS id,\
                source,\
                target,\
                cost_s AS cost,\
                reverse_cost_s AS reverse_cost,\
                x1,\
                y1,\
                x2,\
                y2\
            FROM ways\
            WHERE ST_Intersects(\
              the_geom,\
              (\
                SELECT ST_Buffer(ST_MakeLine(v1.the_geom, v2.the_geom), 0.1)\
                FROM ways_vertices_pgr v1, ways_vertices_pgr v2\
                WHERE v1.id = 1036 and v2.id = 6472\
              )\
            )\
        ',\
        1036,\
        6472,\
        directed := true\
    );";
  const httpResult = http.post(url, data, { headers: headers });

  check(httpResult, {
    "is HTTP status 200": (r) => r.status === 200,
    "is body not empty": (r) => r.body.length > 0,
  });

  sleep(1);
}
