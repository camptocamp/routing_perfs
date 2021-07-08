import { check, sleep } from "k6";
import http from "k6/http";

export let options = {
  discardResponseBodies: true,

  scenarios: {
    m1Ville: {
      executor: "constant-arrival-rate",
      rate: 4,
      timeUnit: "1s",
      duration: "10m",
      preAllocatedVUs: 200,
      exec: "m1_ville",
    },
    m1Campagne: {
      executor: "constant-arrival-rate",
      rate: 3,
      timeUnit: "1s",
      duration: "10m",
      preAllocatedVUs: 200,
      exec: "m1_campagne",
    },
    m2: {
      executor: "constant-arrival-rate",
      rate: 1,
      timeUnit: "1s",
      duration: "10m",
      preAllocatedVUs: 100,
      exec: "m2",
    },
    m4: {
      executor: "constant-arrival-rate",
      rate: 7,
      timeUnit: "1s",
      duration: "10m",
      preAllocatedVUs: 400,
      exec: "m4",
    },
  },
};

export function m1_ville() {
  let body;
  let requests;

  requests = vehicles_m1_ville.map((vehicle) => {
    body = dataTemplate;
    body = body.replace(/__FROM_ID__/g, vehicle.id);
    body = body.replace(/__TO_VID__/g, intervention_m1_ville.id);
    body = body.replace(/__RADIUS_DEG__/g, 0.1);

    return {
      method: "POST",
      url: "http://http2pgrouting:3000/send",
      body,
      params: {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    };
  });

  http.batch(requests);
}

export function m1_campagne() {
  let body;
  let requests;

  requests = vehicles_m1_campagne.map((vehicle) => {
    body = dataTemplate;
    body = body.replace(/__FROM_ID__/g, vehicle.id);
    body = body.replace(/__TO_VID__/g, intervention_m1_campagne.id);
    body = body.replace(/__RADIUS_DEG__/g, 0.1);

    return {
      method: "POST",
      url: "http://http2pgrouting:3000/send",
      body,
      params: {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    };
  });

  http.batch(requests);
}

export function m2() {
  let body;

  let requests_near = vehicles_m2_near.map((vehicle) => {
    body = dataTemplate;
    body = body.replace(/__FROM_ID__/g, vehicle.id);
    body = body.replace(/__TO_VID__/g, intervention_m2.id);
    body = body.replace(/__RADIUS_DEG__/g, 0.1);

    return {
      method: "POST",
      url: "http://http2pgrouting:3000/send",
      body,
      params: {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    };
  });

  let requests_far = vehicles_m2_far.map((vehicle) => {
    body = dataTemplate;
    body = body.replace(/__FROM_ID__/g, vehicle.id);
    body = body.replace(/__TO_VID__/g, intervention_m2.id);
    body = body.replace(/__RADIUS_DEG__/g, 0.2);

    return {
      method: "POST",
      url: "http://http2pgrouting:3000/send",
      body,
      params: {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    };
  });

  let requests = requests_near.concat(requests_far);
  http.batch(requests);
}

export function m4() {
  let body;
  let requests;

  requests = vehicles_m4.map((vehicle) => {
    body = dataTemplate;
    body = body.replace(/__FROM_ID__/g, vehicle.id);
    body = body.replace(/__TO_VID__/g, intervention_m4.id);
    body = body.replace(/__RADIUS_DEG__/g, 0.2);

    return {
      method: "POST",
      url: "http://http2pgrouting:3000/send",
      body,
      params: {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    };
  });

  http.batch(requests);
}

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

const intervention_m1_campagne = {
  id: 215215,
  osm_id: 1680128341,
};

const vehicles_m1_campagne = [
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

const intervention_m1_ville = {
  id: 50194,
  osm_id: 300339517,
};

const vehicles_m1_ville = [
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

const intervention_m2 = {
  id: 61206,
  osm_id: 1039071277,
};

const vehicles_m2_near = [
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
];

const vehicles_m2_far = [
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

const intervention_m3 = {
  id: 181895,
  osm_id: 1648777947,
};

const vehicles_m3 = [
  {
    id: 200151,
    osm_id: 661099065,
  },
  {
    id: 191838,
    osm_id: 279995388,
  },
  {
    id: 56019,
    osm_id: 309695869,
  },
];

const intervention_m4 = {
  id: 199406,
  osm_id: 1936470012,
};

const vehicles_m4 = [
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
