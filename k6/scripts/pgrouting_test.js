import { check } from "k6";
import http from "k6/http";

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
}
