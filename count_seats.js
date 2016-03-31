var fs = require('fs');
var centroid = require('turf-centroid');

var data = JSON.parse(fs.readFileSync('with_buildings.json'));
var loc = JSON.parse(fs.readFileSync('buildings.geojson'));

var out = {};

function initTimes() {
  var times = {};
  for (var i = 8; i <= 20; i++) {
    times[i.toString()] = 0;
  }
  return times;
}

for (var i = 0; i < data.length; i++) {
  var c = data[i];
  if (!c.meetTimes.trim()) {
    continue;
  }
  if (c.building === ' ') continue;
  c.building = c.building.trim();
  if (!(c.building in out)) {
    out[c.building] = {};
   out[c.building].times = initTimes();
  }
  var time = c.meetTimes.slice(0, 2).replace(/^0/g, '');
  out[c.building].times[time] += +c.seats;
}

for (var b in out) {
  var feats = loc.features;
  var bname, key;
  switch (b) {
    case 'School of Education':
      key = 'Mason School of Education';
      break;
    case 'Marshall-Wythe School of Law':
      key = 'Marshall-Wythe Law School';
      break;
    case 'Miller Hall':
      key = 'Mason School of Business';
      break;
    case 'Keck':
      key = 'Keck Lab';
      break;
    case 'McGlothlin-Street':
      key = 'McGlothlin-Street Hall';
      break;
    case 'Integrated Science Center':
      key = 'ISC';
      break;
    case 'Matoka Art Studio':
      key = 'Matoaka Art Studio';
      break;
    case 'Colonial Williamsburg':
      key = 'Williamsburg Theatre';
      break;
    case 'Small Physics Lab':
      key = 'Small Hall';
      break;
    case 'Blow Memorial Hall':
      key = 'Blow Hall';
      break;
    default:
      key = b;
  }
  for (var i = 0; i < feats.length; i++) {
    bname = feats[i].properties.Name;
    if (key === bname) {
      out[b].location = centroid(feats[i].geometry).geometry.coordinates;
    }
  }
}

console.log(out);
