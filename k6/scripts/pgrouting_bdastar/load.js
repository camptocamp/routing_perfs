import { check, sleep } from "k6";
import http from "k6/http";

export let options = {
  stages: [
    { duration: "5m", target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    { duration: "10m", target: 100 }, // stay at 100 users for 10 minutes
    { duration: "5m", target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(99)<1500"], // 99% of requests must complete below 1.5s
    "logged in successfully": ["p(99)<1500"], // 99% of requests must complete below 1.5s
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
