/* eslint no-loop-func:[0] */
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var Promise = require('promise');

function fetch(url) {
  return new Promise(function(resolve, reject) {
    request.get({url: 'https://courselist.wm.edu' + url}, function(err, res, body) {
      if (err) reject(err);
      resolve(parse(body));
    });
  });
}

function parse(html) {
  var $ = cheerio.load(html);
  var place = $($('table')[1], 'tbody tr:eq(4) td:eq(2)').text();
  var building = place.split('\n').filter(function(b) {
    return b.indexOf('Place') > -1;
  })[0];
  building = building.split('--')[0];
  var i = building.indexOf(' ');
  building = building.slice(i, building.length);
  return building;
}

var data = JSON.parse(fs.readFileSync('./data.json'));
var outStream = fs.createWriteStream('final.json', {'flags': 'a'});
outStream.write('[', function() {
  write(0);
});

function write(i) {
  if (i === data.length) {
    outStream.write(']');
  } else {
    fetch(data[i].link)
      .then(function(building) {
        console.log(building);
        data[i].building = building;
        outStream.write(JSON.stringify(data[i]) + (i < data.length - 1 ? ',' : ''), function() {
          write(++i);
        });
      })
      .catch(function(e) {
        console.log(e);
      });
  }
}

