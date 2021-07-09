const fetch = require('node-fetch');	//npm install node-fetch
const fs = require('fs');
var path = require('path');
const m1_v = require( path.resolve( __dirname, 'M4.js'));
//const m1_v = require('M1_ville.js');



function getLatLon(osmId){
    fetch(`https://api.openstreetmap.org/api/0.6/node/${osmId}.json`, {
        method: 'GET'
      })
        .then(res => res.json())
        .then(json => {
          console.log(json.elements[0])

        })
        .catch(err => console.log(err));
}

m1_v.vehicles.forEach(element => {
  getLatLon(element.osm_id)
});

getLatLon(element.osm_id)