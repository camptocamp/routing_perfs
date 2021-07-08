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
  const url = "http://valhalla:8002/route";
  const headers = { "Content-Type": "application/json" };
  const data = {
    locations: [
      { lat: 48.384576, lon: 2.950385 },
      { lat: 48.402601, lon: 2.895654 },
    ],
    costing: "auto",
  };
  const httpResult = http.post(url, JSON.stringify(data), { headers: headers });

  check(httpResult, {
    "is HTTP status 200": (r) => r.status === 200,
    "is body not empty": (r) => r.body.length > 0,
  });

  const valhallaResult = JSON.parse(httpResult.body);

  check(valhallaResult, {
    "is Valhalla status 0": (r) => r.trip.status === 0,
  });

  sleep(1);
}
