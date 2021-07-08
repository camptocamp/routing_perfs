import { check, sleep } from "k6";
import http from "k6/http";

export let options = {
  discardResponseBodies: true,

  scenarios: {
    m1Ville: {
      executor: "constant-vus",
      vus: 200,
      duration: "10m",
      gracefulStop: "3m",
      exec: "m1_ville",
    },
    m1Campagne: {
      executor: "constant-vus",
      vus: 150,
      duration: "10m",
      gracefulStop: "3m",
      exec: "m1_campagne",
    },
    /* m2: {
      executor: "constant-vus",
      vus: 35,
      duration: "5m",
      gracefulStop: "1m",
      exec: "m2",
    },
    m3: {
      executor: "constant-vus",
      vus: 15,
      duration: "5m",
      gracefulStop: "1m",
      exec: "m3",
    }, */
  },
};

export function m1_ville() {
  let data;
  let requests;

  requests = vehicles_m1_ville.map((vehicle) => {
    data = {
      locations: [
        { lat: vehicle.lat, lon: vehicle.lon },
        { lat: intervention_m1_ville.lat, lon: intervention_m1_ville.lon },
      ],
      costing: "auto",
    };

    return {
      method: "POST",
      url: "http://valhalla:8002/route",
      body: JSON.stringify(data),
      params: {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    };
  });

  http.batch(requests);

  sleep(90 + Math.random() * 60);
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

  sleep(90 + Math.random() * 60);
}

/* export function m2() {
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

  sleep(90 + Math.random() * 60);
} */

/* export function m3() {
  let body;
  let requests;

  requests = vehicles_m3.map((vehicle) => {
    body = dataTemplate;
    body = body.replace(/__FROM_ID__/g, vehicle.id);
    body = body.replace(/__TO_VID__/g, intervention_m3.id);
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

  sleep(90 + Math.random() * 60);
} */

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
  lon: 3.0580155,
  lat: 48.5982848,
  osm_id: 1680128341,
};

const vehicles_m1_campagne = [
  {
    lon: 2.9281479,
    lat: 48.5872454,
    osm_id: 1926678866,
  },
  {
    lon: 2.9370473,
    lat: 48.6160958,
    osm_id: 1839730022,
  },
  {
    lon: 2.9704873,
    lat: 48.5960883,
    osm_id: 1936522855,
  },
  {
    lon: 3.0049624,
    lat: 48.638116,
    osm_id: 1522160503,
  },
  {
    lon: 3.0360042,
    lat: 48.6687008,
    osm_id: 3652806081,
  },
  {
    lon: 3.1157576,
    lat: 48.6062114,
    osm_id: 1507150595,
  },
  {
    lon: 3.1401509,
    lat: 48.5820105,
    osm_id: 1509673925,
  },
  {
    lon: 3.1212283,
    lat: 48.5464993,
    osm_id: 1509836491,
  },
  {
    lon: 3.0635944,
    lat: 48.5548806,
    osm_id: 3123545484,
  },
  {
    lon: 3.0329398,
    lat: 48.5282842,
    osm_id: 2906848438,
  },
];

const intervention_m1_ville = {
  lon: 2.6558766,
  lat: 48.5253905,
  osm_id: 300339517,
};

const vehicles_m1_ville = [
  {
    lon: 2.6181036,
    lat: 48.5465607,
    osm_id: 670118899,
  },
  {
    lon: 2.6325229,
    lat: 48.5550268,
    osm_id: 670343196,
  },
  {
    lon: 2.6525969,
    lat: 48.5512906,
    osm_id: 4525103910,
  },
  {
    lon: 2.6830995,
    lat: 48.5416088,
    osm_id: 300270057,
  },
  {
    lon: 2.6908616,
    lat: 48.5325409,
    osm_id: 301915957,
  },
  {
    lon: 2.6716568,
    lat: 48.5255899,
    osm_id: 294110431,
  },
  {
    lon: 2.6389131,
    lat: 48.5101254,
    osm_id: 2154436428,
  },
  {
    lon: 2.6337417,
    lat: 48.519998,
    osm_id: 1580119392,
  },
  {
    lon: 2.6127584,
    lat: 48.5064281,
    osm_id: 4999278046,
  },
  {
    lon: 2.5993134,
    lat: 48.5257354,
    osm_id: 561625021,
  },
];

/* const intervention_m2 = {
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
]; */

/* const intervention_m3 = {
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
]; */

/* const intervention_m4 = {
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
]; */
