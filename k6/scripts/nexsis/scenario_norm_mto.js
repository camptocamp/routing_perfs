import { check, sleep } from "k6";
import http from "k6/http";

export let options = {
  //discardResponseBodies: true,

  scenarios: {
    m1Ville: {
      executor: "constant-arrival-rate",
      rate: 15,
      timeUnit: "1m",
      duration: "10m",
      preAllocatedVUs: 150,
      exec: "m1_ville",
    },
    m1Campagne: {
      executor: "constant-arrival-rate",
      rate: 13,
      timeUnit: "1m",
      duration: "10m",
      preAllocatedVUs: 130,
      exec: "m1_campagne",
    },
    m2: {
      executor: "constant-arrival-rate",
      rate: 5,
      timeUnit: "1m",
      duration: "10m",
      preAllocatedVUs: 50,
      exec: "m2",
    },
    m3: {
      executor: "constant-arrival-rate",
      rate: 2,
      timeUnit: "1m",
      duration: "10m",
      preAllocatedVUs: 20,
      exec: "m3",
    },
  },
};

export function m1_ville() {
  let url = urlTemplate;

  let coordsDepart = vehicles_m1_ville.reduce(
    (acc, vehicle) => `${acc}coordsDepart=${vehicle.lat}%2C${vehicle.lon}&`,
    ""
  );
  coordsDepart = coordsDepart.slice(0, -1);

  url = url.replace(/__COORDS_DEPART__/g, coordsDepart);
  url = url.replace(/__LAT_ARRIVEE__/g, intervention_m1_ville.lat);
  url = url.replace(/__LON_ARRIVEE__/g, intervention_m1_ville.lon);
  url = url.replace(/__BUFFER_RADIUS__/g, 10000);
  // console.log("-url-", url);

  const httpResult = http.get(url, {
    headers: { "x-api-key": "ffef5b1a-d4bd-4b08-9b75-c7ab4f9aa14b" },
  });
  // console.log("-httpResult-", JSON.stringify(httpResult));
  check(httpResult, {
    "is HTTP status 200": (r) => r.status === 200,
    "is body not empty": (r) => r.body.length > 0,
  });

  const results = JSON.parse(httpResult.body);
  // console.log("-results-", JSON.stringify(results));
  check(results, {
    "are temps OK": (r) => r.length === 10 && r[0].temps !== undefined,
  });
}

export function m1_campagne() {
  let url = urlTemplate;

  let coordsDepart = vehicles_m1_campagne.reduce(
    (acc, vehicle) => `${acc}coordsDepart=${vehicle.lat}%2C${vehicle.lon}&`,
    ""
  );
  coordsDepart = coordsDepart.slice(0, -1);

  url = url.replace(/__COORDS_DEPART__/g, coordsDepart);
  url = url.replace(/__LAT_ARRIVEE__/g, intervention_m1_campagne.lat);
  url = url.replace(/__LON_ARRIVEE__/g, intervention_m1_campagne.lon);
  url = url.replace(/__BUFFER_RADIUS__/g, 10000);
  // console.log("-url-", url);

  const httpResult = http.get(url, {
    headers: { "x-api-key": "ffef5b1a-d4bd-4b08-9b75-c7ab4f9aa14b" },
  });
  // console.log("-httpResult-", JSON.stringify(httpResult));
  check(httpResult, {
    "is HTTP status 200": (r) => r.status === 200,
    "is body not empty": (r) => r.body.length > 0,
  });

  const results = JSON.parse(httpResult.body);
  // console.log("-results-", JSON.stringify(results));
  check(results, {
    "are temps OK": (r) =>
      r.length === 10 &&
      r[0].temps !==
        undefined /* === 12.256460384610707 &&
      r[1].temps === 6.209413934486465 &&
      r[2].temps === 7.766821426274672 &&
      r[3].temps === 7.382335220529053 &&
      r[4].temps === 5.577606743135297 &&
      r[5].temps === 9.307097167587191 &&
      r[6].temps === 11.47883150231096 &&
      r[7].temps === 10.026179577584909 &&
      r[8].temps === 12.379567393766736 &&
      r[9].temps === 13.26299467636611 */,
  });
}

export function m2() {
  let url = urlTemplate;

  let vehicles_m2 = [...vehicles_m2_near, ...vehicles_m2_far];
  let coordsDepart = vehicles_m2.reduce(
    (acc, vehicle) => `${acc}coordsDepart=${vehicle.lat}%2C${vehicle.lon}&`,
    ""
  );
  coordsDepart = coordsDepart.slice(0, -1);

  url = url.replace(/__COORDS_DEPART__/g, coordsDepart);
  url = url.replace(/__LAT_ARRIVEE__/g, intervention_m2.lat);
  url = url.replace(/__LON_ARRIVEE__/g, intervention_m2.lon);
  url = url.replace(/__BUFFER_RADIUS__/g, 10000);
  // console.log("-url-", url);

  const httpResult = http.get(url, {
    headers: { "x-api-key": "ffef5b1a-d4bd-4b08-9b75-c7ab4f9aa14b" },
  });
  // console.log("-httpResult-", JSON.stringify(httpResult));
  check(httpResult, {
    "is HTTP status 200": (r) => r.status === 200,
    "is body not empty": (r) => r.body.length > 0,
  });

  const results = JSON.parse(httpResult.body);
  // console.log("-results-", JSON.stringify(results));
  check(results, {
    "are temps OK": (r) => r.length === 14 && r[0].temps !== undefined,
  });
}

export function m3() {
  let url = urlTemplate;

  let coordsDepart = vehicles_m3.reduce(
    (acc, vehicle) => `${acc}coordsDepart=${vehicle.lat}%2C${vehicle.lon}&`,
    ""
  );
  coordsDepart = coordsDepart.slice(0, -1);

  url = url.replace(/__COORDS_DEPART__/g, coordsDepart);
  url = url.replace(/__LAT_ARRIVEE__/g, intervention_m3.lat);
  url = url.replace(/__LON_ARRIVEE__/g, intervention_m3.lon);
  url = url.replace(/__BUFFER_RADIUS__/g, 10000);
  // console.log("-url-", url);

  const httpResult = http.get(url, {
    headers: { "x-api-key": "ffef5b1a-d4bd-4b08-9b75-c7ab4f9aa14b" },
  });
  // console.log("-httpResult-", JSON.stringify(httpResult));
  check(httpResult, {
    "is HTTP status 200": (r) => r.status === 200,
    "is body not empty": (r) => r.body.length > 0,
  });

  const results = JSON.parse(httpResult.body);
  // console.log("-results-", JSON.stringify(results));
  check(results, {
    "are temps OK": (r) => r.length === 3 && r[0].temps !== undefined,
  });
}

const urlTemplate =
  //"https://api.dev.scw.ansc.fr/itineraires/master/temps-transit-dynamique/temps?__COORDS_DEPART__&latArrivee=__LAT_ARRIVEE__&lonArrivee=__LON_ARRIVEE__&bufferRadius=__BUFFER_RADIUS__";
  //"https://api.dev.scw.ansc.fr/itineraires/nexsis-3274-utiliser-many-to-one-pg-12/temps-transit-dynamique/temps?__COORDS_DEPART__&latArrivee=__LAT_ARRIVEE__&lonArrivee=__LON_ARRIVEE__&bufferRadius=__BUFFER_RADIUS__";
  "http://localhost:8084/temps-transit-dynamique/temps?__COORDS_DEPART__&latArrivee=__LAT_ARRIVEE__&lonArrivee=__LON_ARRIVEE__&bufferRadius=__BUFFER_RADIUS__";

const intervention_m1_campagne = {
  id: 215215,
  osm_id: 1680128341,
  lon: 3.0580155,
  lat: 48.5982848,
};

const vehicles_m1_campagne = [
  {
    id: 199422,
    osm_id: 1926678866,
    lon: 2.9281479,
    lat: 48.5872454,
  },
  {
    id: 194379,
    osm_id: 1839730022,
    lon: 2.9370473,
    lat: 48.6160958,
  },
  {
    id: 199453,
    osm_id: 1936522855,
    lon: 2.9704873,
    lat: 48.5960883,
  },
  {
    id: 173198,
    osm_id: 1522160503,
    lon: 3.0049624,
    lat: 48.638116,
  },
  {
    id: 243109,
    osm_id: 3652806081,
    lon: 3.0360042,
    lat: 48.6687008,
  },
  {
    id: 234394,
    osm_id: 1507150595,
    lon: 3.1157576,
    lat: 48.6062114,
  },
  {
    id: 171958,
    osm_id: 1509673925,
    lon: 3.1401509,
    lat: 48.5820105,
  },
  {
    id: 171998,
    osm_id: 1509836491,
    lon: 3.1212283,
    lat: 48.5464993,
  },
  {
    id: 172486,
    osm_id: 3123545484,
    lon: 3.0635944,
    lat: 48.5548806,
  },
  {
    id: 229473,
    osm_id: 2906848438,
    lon: 3.0329398,
    lat: 48.5282842,
  },
];

const intervention_m1_ville = {
  id: 50194,
  osm_id: 300339517,
  lat: 48.5253905,
  lon: 2.6558766,
};

const vehicles_m1_ville = [
  {
    id: 120020,
    osm_id: 670118899,
    lat: 48.5465607,
    lon: 2.6181036,
  },
  {
    id: 120105,
    osm_id: 670343196,
    lat: 48.5550268,
    lon: 2.6325229,
  },
  {
    id: 252143,
    osm_id: 4525103910,
    lat: 48.5512906,
    lon: 2.6525969,
  },
  {
    id: 49947,
    osm_id: 300270057,
    lat: 48.5416088,
    lon: 2.6830995,
  },
  {
    id: 51790,
    osm_id: 301915957,
    lat: 48.5325409,
    lon: 2.6908616,
  },
  {
    id: 50927,
    osm_id: 294110431,
    lat: 48.5255899,
    lon: 2.6716568,
  },
  {
    id: 50320,
    osm_id: 2154436428,
    lat: 48.5101254,
    lon: 2.6389131,
  },
  {
    id: 175833,
    osm_id: 1580119392,
    lat: 48.519998,
    lon: 2.6337417,
  },
  {
    id: 258685,
    osm_id: 4999278046,
    lat: 48.5064281,
    lon: 2.6127584,
  },
  {
    id: 102621,
    osm_id: 561625021,
    lat: 48.5257354,
    lon: 2.5993134,
  },
];

const intervention_m2 = {
  id: 61206,
  osm_id: 1039071277,
  lat: 48.8565841,
  lon: 2.71956,
};

const vehicles_m2_near = [
  {
    id: 129016,
    osm_id: 778259739,
    lat: 48.8262529,
    lon: 2.6507467,
  },
  {
    id: 39722,
    osm_id: 275594038,
    lat: 48.8423231,
    lon: 2.6977244,
  },
  {
    id: 201731,
    osm_id: 3353009373,
    lat: 48.8508183,
    lon: 2.6562482,
  },
  {
    id: 53040,
    osm_id: 303387940,
    lat: 48.857559,
    lon: 2.665081,
  },
  {
    id: 34048,
    osm_id: 276937123,
    lat: 48.8661201,
    lon: 2.684509,
  },
  {
    id: 61245,
    osm_id: 319539135,
    lat: 48.8730949,
    lon: 2.718231,
  },
  {
    id: 143516,
    osm_id: 288780160,
    lat: 48.8854692,
    lon: 2.697694,
  },
  {
    id: 226892,
    osm_id: 2758353294,
    lat: 48.8894258,
    lon: 2.7325129,
  },
  {
    id: 63083,
    osm_id: 322910710,
    lat: 48.8807635,
    lon: 2.7678703,
  },
  {
    id: 68430,
    osm_id: 3730693010,
    lat: 48.8189234,
    lon: 2.7830925,
  },
];

const vehicles_m2_far = [
  {
    id: 171160,
    osm_id: 960134959,
    lat: 48.7884421,
    lon: 3.3032729,
  },
  {
    id: 247826,
    osm_id: 3974640266,
    lat: 48.5552199,
    lon: 3.2945359,
  },
  {
    id: 56945,
    osm_id: 103753956,
    lat: 48.3931865,
    lon: 2.7995818,
  },
  {
    id: 197331,
    osm_id: 2849500962,
    lat: 48.5237103,
    lon: 2.5443223,
  },
];

const intervention_m3 = {
  id: 181895,
  osm_id: 1648777947,
  lat: 48.8018948,
  lon: 3.0935316,
};

const vehicles_m3 = [
  {
    id: 200151,
    osm_id: 661099065,
    lat: 48.2658885,
    lon: 2.7043236,
  },
  {
    lat: 48.59942,
    lon: 2.241674,
  },
  {
    lat: 48.917995,
    lon: 2.292374,
  },
];
