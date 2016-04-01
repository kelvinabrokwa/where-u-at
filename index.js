/* global mapboxgl, d3 */
var data;
mapboxgl.accessToken = 'pk.eyJ1Ijoia2VsdmluYWJyb2t3YSIsImEiOiJkcUF1TWlVIn0.YzBtz0O019DJGk3IpFi72g';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/kelvinabrokwa/cimi2yjtc0033qxno72oiq5kb',
  center: [-76.711, 37.269],
  zoom: 14
});
fetch('./seats_times.json')
  .then(function(res) { return res.json(); })
  .then(function(d) {
    data = d;
    map.on('load', function() {
      setSource();
      addStyle(8);
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
function addStyle(time) {
  time = Math.floor(time);
  map.batch(function(batch) {
    Object.keys(data).forEach(function(d) {
      batch.addLayer(circleStyle(d, data[d].times[time]));
    });
  });
}
function setRadius(time) {
  time = Math.floor(time);
  var zoom = map.getZoom();
  map.batch(function(batch) {
    Object.keys(data).forEach(function(d) {
      batch.setPaintProperty(d + '-circle', 'circle-radius', (zoom * data[d].times[time]) / 100);
    });
  });
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
    },
    paint: {
      'text-color': '#FFF'
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
      'circle-radius': radius / 15,
      'circle-color': '#E81A1A',
      'circle-opacity': 0.6,
      'circle-blur': 0.5
    }
  };
}

// overlay
var height = 200, width = 600;

var svg = d3.select('#overlay').append('svg')
  .attr('width', width)
  .attr('height', height);

var label = svg.append('text')
  .attr('class', 'time label')
  .attr('text-anchor', 'end')
  .attr('y', height - 24)
  .attr('x', width)
  .text('8 AM');

var box = label.node().getBBox();

svg.append('rect')
  .attr('class', 'overlay')
  .attr('x', box.x)
  .attr('y', box.y)
  .attr('width', box.width)
  .attr('height', box.height)
  .on('mousemove', mousemove);


var timeScale = d3.scale.linear()
  .domain([8, 20])
  .range([box.x, box.x + box.width])
  .clamp(true);

function mousemove() {
  var time = timeScale.invert(d3.mouse(this)[0]);
  setRadius(time);
  var postfix = time < 12 ? ' AM' : ' PM';
  label.text((Math.floor(time) === 12 ? 12 : Math.floor(time % 12)) + postfix);
}
