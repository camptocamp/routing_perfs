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
  const httpResult = http.get(
    // "https://api.kube.dev.nexsis.ansc.minint.fr/itineraires/master/temps-transit-dynamique/temps?latitude=48&longitude=2",
    // "http://localhost:8084/temps-transit-dynamique/sequence-itineraire?startVid=1036&endVid=6472&bufferRadius=0.1",
    // "https://api.dev.scw.ansc.fr/itineraires/master/temps-transit-dynamique/temps?coordsDepart=48.5872454%2C2.9281479&latArrivee=48.5982848&lonArrivee=3.0580155&bufferRadius=10000",
    // "https://api.kube.dev.nexsis.ansc.minint.fr/itineraires/nexsis-2748-route-sequence-itineraire/temps-transit-dynamique/sequence-itineraire?startVid=1036&endVid=6472&bufferRadius=0.1",
    "https://api.dev.scw.ansc.fr/itineraires/nexsis-3274-utiliser-many-to-one-pg-12/temps-transit-dynamique/temps?coordsDepart=48.530598%2C2.680752&coordsDepart=48.530697%2C2.680126&latArrivee=48.530899&lonArrivee=2.678850&bufferRadius=10000",
    // "http://localhost:8084/temps-transit-dynamique/temps?coordsDepart=48.530598%2C2.680752&coordsDepart=48.530697%2C2.680126&latArrivee=48.530899&lonArrivee=2.678850&bufferRadius=10000",
    { headers: { "x-api-key": "ffef5b1a-d4bd-4b08-9b75-c7ab4f9aa14b" } }
  );

  check(httpResult, {
    "is HTTP status 200": (r) => r.status === 200,
    "is body not empty": (r) => r.body.length > 0,
  });

  const results = JSON.parse(httpResult.body);
  check(results, {
    // "is aggCost OK": (r) => r.length > 0 && r[r.length - 1].aggCost > 0,
    "are temps OK": (r) =>
      r.length === 2 &&
      r[0].temps === 0.11624585688028766 &&
      r[1].temps === 0.20999695302567659,
  });

  sleep(1);
}
