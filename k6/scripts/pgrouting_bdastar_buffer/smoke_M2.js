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
  id: 61206,
  osm_id: 1039071277,
};

const vehicles = [
  {
    id: 129016,
    osm_id: 778259739,
  },
  {
    id: 39722,
    osm_id: 275594038,
  },
  {
    id: 201731,
    osm_id: 3353009373,
  },
  {
    id: 53040,
    osm_id: 303387940,
  },
  {
    id: 34048,
    osm_id: 276937123,
  },
  {
    id: 61245,
    osm_id: 319539135,
  },
  {
    id: 143516,
    osm_id: 288780160,
  },
  {
    id: 226892,
    osm_id: 2758353294,
  },
  {
    id: 63083,
    osm_id: 322910710,
  },
  {
    id: 68430,
    osm_id: 3730693010,
  },
  {
    id: 171160,
    osm_id: 960134959,
  },
  {
    id: 247826,
    osm_id: 3974640266,
  },
  {
    id: 56945,
    osm_id: 103753956,
  },
  {
    id: 197331,
    osm_id: 2849500962,
  },
];
