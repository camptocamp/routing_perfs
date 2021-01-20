import { check } from "k6";
import http from "k6/http";

export default function () {
  const url = "http://http2pgrouting:3000/send";
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  const data =
    "queryString=\
    SELECT * FROM pgr_dijkstra(\
        '\
            SELECT \
                gid AS id, \
                source, \
                target, \
                cost_s AS cost, \
                reverse_cost_s AS reverse_cost \
            FROM ways\
        ', \
        1036, \
        6472, \
        directed := true\
    );";
  const httpResult = http.post(url, data, { headers: headers });

  check(httpResult, {
    "is HTTP status 200": (r) => r.status === 200,
    "is body not empty": (r) => r.body.length > 0,
  });
}
