import { check } from "k6";
import http from "k6/http";

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
}
