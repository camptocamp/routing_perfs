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
