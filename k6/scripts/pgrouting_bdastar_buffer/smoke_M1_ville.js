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
  id: 50194,
  osm_id: 300339517,
};

const vehicles = [
  {
    id: 120020,
    osm_id: 670118899,
  },
  {
    id: 120105,
    osm_id: 670343196,
  },
  {
    id: 252143,
    osm_id: 4525103910,
  },
  {
    id: 49947,
    osm_id: 300270057,
  },
  {
    id: 51790,
    osm_id: 301915957,
  },
  {
    id: 50927,
    osm_id: 294110431,
  },
  {
    id: 50320,
    osm_id: 2154436428,
  },
  {
    id: 175833,
    osm_id: 1580119392,
  },
  {
    id: 258685,
    osm_id: 4999278046,
  },
  {
    id: 102621,
    osm_id: 561625021,
  },
];
