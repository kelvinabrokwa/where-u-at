import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      time: 8
    };
    this.changeTime = this.changeTime.bind(this);
  }
  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2VsdmluYWJyb2t3YSIsImEiOiJkcUF1TWlVIn0.YzBtz0O019DJGk3IpFi72g';
    this.map = new mapboxgl.Map({
      container: this.refs.map,
      style: 'mapbox://styles/mapbox/light-v8',
      center: [-76.716, 37.269],
      zoom: 15
    });
    fetch('./seats_times.json')
      .then(res => res.json())
      .then(data => {
        this.setState({data});
        this.map.on('load', () => {
          this.setSource(data);
          this.setLabelStyle(data);
          this.setStyle(data, 8);
        });
      })
      .catch(e => console.log(e));

  }
  setSource(data) {
    this.map.addSource('buildings', {
      type: 'geojson',
      data: data2geoj(data)
    });
  }
  setLabelStyle(data) {
    this.map.batch(batch => {
      Object.keys(data).forEach(d => {
        batch.addLayer(labelStyle(d));
      });
    });
  }
  setStyle(data, time) {
    this.map.batch((batch) => {
      Object.keys(data).forEach(d => {
        batch.addLayer(circleStyle(d, data[d].times[time]));
      });
    });
  }
  changeTime(e) {
    this.setState({time: e.target.value});
    this.setStyle(this.state.data, e.target.value);
  }
  render() {
    return <div>
      <div ref='map' style={{height: '500px'}}></div>
      <div>
        <input style={{width: '100%'}} type='range' min='8' max='20' defaultValue='8' onChange={this.changeTime}/>
        {this.state.time}
      </div>
    </div>;
  }
}

function circleStyle(building, radius) {
  return {
    id: `${building}-circle`,
    source: 'buildings',
    type: 'circle',
    filter: ['==', 'building', building],
    paint: {
      'circle-radius': radius / 25,
      'circle-color': '#551A8B',
      'circle-opacity': 0.8,
      'circle-blur': 0.5
    }
  };
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

function data2geoj(data) {
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

ReactDOM.render(<App/>, document.getElementById('app'));
