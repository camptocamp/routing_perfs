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
  const dataTemplate =
    "queryString=\
    SELECT * FROM pgr_bdAstar(\
        '\
            SELECT\
                id,\
                source,\
                target,\
                cost,\
                reverse_cost,\
                x1,\
                y1,\
                x2,\
                y2\
            FROM idf_2po_4pgr\
            WHERE ST_Intersects(\
              geom_way,\
              (\
                SELECT ST_Buffer(ST_MakeLine(v1.geom_vertex, v2.geom_vertex), __RADIUS_DEG__)\
                FROM idf_2po_vertex v1, idf_2po_vertex v2\
                WHERE v1.id = __FROM_ID__ and v2.id = __TO_VID__\
              )\
            )\
        ',\
        __FROM_ID__,\
        __TO_VID__,\
        directed := true\
    );";

  const requests = vehicles.map((vehicle) => {
    let body = dataTemplate;
    body = body.replace(/__FROM_ID__/g, vehicle.id);
    body = body.replace(/__TO_VID__/g, intervention.id);
    body = body.replace(/__RADIUS_DEG__/g, 0.2);
    // console.log("body", body);
    return {
      method: "POST",
      url: "http://http2pgrouting:3000/send",
      body,
      params: {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    };
  });

  let responses = http.batch(requests);
  // console.log("responses", JSON.stringify(responses));
  /* check(responses, {
    "are all HTTP status 200": (responses) =>
      !responses.some((r) => r.status !== 200),
    "are all body not empty": (responses) =>
      !responses.some(r.body.length === 0),
  }); */

  sleep(1000 * 10);
}

const intervention = {
  id: 215215,
  osm_id: 1680128341,
};

const vehicles = [
  {
    id: 199422,
    osm_id: 1926678866,
  },
  {
    id: 194379,
    osm_id: 1839730022,
  },
  {
    id: 199453,
    osm_id: 1936522855,
  },
  {
    id: 173198,
    osm_id: 1522160503,
  },
  {
    id: 243109,
    osm_id: 3652806081,
  },
  {
    id: 234394,
    osm_id: 1507150595,
  },
  {
    id: 171958,
    osm_id: 1509673925,
  },
  {
    id: 171998,
    osm_id: 1509836491,
  },
  {
    id: 172486,
    osm_id: 3123545484,
  },
  {
    id: 229473,
    osm_id: 2906848438,
  },
];
