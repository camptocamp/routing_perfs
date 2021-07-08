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
  const httpResult = http.get("http://http2pgrouting:3000/test");

  check(httpResult, {
    "is HTTP status 200": (r) => r.status === 200,
    "is body not empty": (r) => r.body.length > 0,
  });

  const pgroutingResult = httpResult.body;

  check(pgroutingResult, {
    "is pgRouting OK": (r) => r === "OK",
  });

  sleep(1);
}
