import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';

class App extends React.Component {
  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2VsdmluYWJyb2t3YSIsImEiOiJkcUF1TWlVIn0.YzBtz0O019DJGk3IpFi72g';
    this.map = new mapboxgl.Map({
      container: this.refs.map,
      style: 'mapbox://styles/mapbox/streets-v8',
      center: [0, 0],
      zoom: 0
    });
  }
  render() {
    return <div>
      <div ref='map'></div>
    </div>;
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
