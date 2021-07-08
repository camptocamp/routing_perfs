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
  id: 199406,
  osm_id: 1936470012,
};

const vehicles = [
  {
    id: 63943,
    osm_id: 325167660,
  },
  {
    id: 27378,
    osm_id: 252190991,
  },
  {
    id: 62432,
    osm_id: 321614515,
  },
  {
    id: 231518,
    osm_id: 3011218861,
  },
  {
    id: 183064,
    osm_id: 1746995376,
  },
  {
    id: 121829,
    osm_id: 690673706,
  },
  {
    id: 172148,
    osm_id: 1510696832,
  },
  {
    id: 228139,
    osm_id: 2847982065,
  },
  {
    id: 225219,
    osm_id: 1027675631,
  },
  {
    id: 259920,
    osm_id: 1615557503,
  },
  {
    id: 200959,
    osm_id: 1507279568,
  },
  {
    id: 247899,
    osm_id: 1241700154,
  },
  {
    id: 155861,
    osm_id: 1078560182,
  },
  {
    id: 155838,
    osm_id: 1240901906,
  },
  {
    id: 202464,
    osm_id: 2013815235,
  },
  {
    id: 241057,
    osm_id: 1686140505,
  },
  {
    id: 247789,
    osm_id: 3974531806,
  },
  {
    id: 205828,
    osm_id: 2260328451,
  },
  {
    id: 219590,
    osm_id: 1509836093,
  },
  {
    id: 235827,
    osm_id: 894865730,
  },
  {
    id: 152751,
    osm_id: 1223199107,
  },
  {
    id: 105615,
    osm_id: 579374475,
  },
  {
    id: 254622,
    osm_id: 4565037696,
  },
  {
    id: 210448,
    osm_id: 3255558270,
  },
  {
    id: 77266,
    osm_id: 2244852654,
  },
  {
    id: 165891,
    osm_id: 1416985671,
  },
  {
    id: 166490,
    osm_id: 1428762137,
    // restrictions: -188735_188735-188735_328473-328419_328419-328419_188735-328473_328473
  },
  {
    id: 220178,
    osm_id: 2491989860,
  },
  {
    id: 25490,
    osm_id: 6153121114,
  },
  {
    id: 77659,
    osm_id: 3229427662,
  },
];
