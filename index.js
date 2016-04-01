/* global mapboxgl */
var data;
mapboxgl.accessToken = 'pk.eyJ1Ijoia2VsdmluYWJyb2t3YSIsImEiOiJkcUF1TWlVIn0.YzBtz0O019DJGk3IpFi72g';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/kelvinabrokwa/cimhzn0k5001xg4nsodukqsr8',
  center: [-76.711, 37.269],
  zoom: 14
});
fetch('./seats_times.json')
  .then(function(res) { return res.json(); })
  .then(function(d) {
    data = d;
    map.on('load', function() {
      setSource();
      setStyle(8);
      setLabelStyle();
    });
  })
  .catch(function(e) { console.log(e); });
function setSource() {
  map.addSource('buildings', {
    type: 'geojson',
    data: data2geoj(data)
  });
}
function setLabelStyle() {
  map.batch(function(batch) {
    Object.keys(data).forEach(function(d) {
      batch.addLayer(labelStyle(d));
    });
  });
}
function setStyle(time) {
  map.batch(function(batch) {
    Object.keys(data).forEach(function(d) {
      batch.addLayer(circleStyle(d, data[d].times[time]));
    });
  });
}
function changeTime() { // eslint-disable-line no-unused-vars
  var time = document.getElementById('timeInput').value;
  setStyle(time);
}
function labelStyle(building) {
  return {
    id: `${building}-label`,
    source: 'buildings',
    type: 'symbol',
    filter: ['==', 'building', building],
    layout: {
      'text-field': '{building}',
      'text-size': 10
    }
  };
}
function data2geoj() {
  var out = [];
  var buildings = Object.keys(data);
  for (var i = 0; i < buildings.length; i++) {
    var b = data[buildings[i]];
    if (!b.location) continue;
    out.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: b.location
      },
      properties: {
        building: buildings[i]
      }
    });
  }
  return {
    type: 'FeatureCollection',
    features: out
  };
}
function circleStyle(building, radius) {
  return {
    id: `${building}-circle`,
    source: 'buildings',
    type: 'circle',
    filter: ['==', 'building', building],
    paint: {
      'circle-radius': radius / 20,
      'circle-color': '#551A8B',
      'circle-opacity': 0.8,
      'circle-blur': 0.5
    }
  };
}
