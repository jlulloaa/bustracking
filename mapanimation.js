// This array contains the coordinates for all bus stops between MIT and Harvard
// const busStops = [
//   [-71.093729, 42.359244],
//   [-71.094915, 42.360175],
//   [-71.0958, 42.360698],
//   [-71.099558, 42.362953],
//   [-71.103476, 42.365248],
//   [-71.106067, 42.366806],
//   [-71.108717, 42.368355],
//   [-71.110799, 42.369192],
//   [-71.113095, 42.370218],
//   [-71.115476, 42.372085],
//   [-71.117585, 42.373016],
//   [-71.118625, 42.374863],
// ];

const busStops = [
  [-73.0747368280013,-36.8240270695445],
  [-73.0973186129397,-36.837934600527],
  [-73.1182072613217,-36.836834777831],
  [-73.1309136285728,-36.8456338998921],
  [-73.1330656327354,-36.85417249505],
  [-73.135810757869,-36.8669485992639],
  [-73.1396772209682,-36.8825367862886],
  [-73.1570705353778,-36.9544146400071]
]

// TODO: add your own access token
mapboxgl.accessToken = 'pk.eyJ1Ijoiamx1bGxvYWEiLCJhIjoiY2wyemphOTEyMWZ0MTNjbXU1aWozbW80bSJ9.2bAdUzIX0h79uDF4RmlFfw';

// This is the map instance
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  // center: [-71.104081, 42.365554],
  center: [-73.10987730333,-36.8339217247322],
  zoom: 14,
});

// TODO: add a marker to the map at the first coordinates in the array busStops. The marker variable should be named "marker"
let marker = new mapboxgl.Marker()
  .setLngLat(busStops[0])
  .addTo(map)
// counter here represents the index of the current bus stop
let counter = 0;
function move() {
  // TODO: move the marker on the map every 1000ms. Use the function marker.setLngLat() to update the marker coordinates
  // Use counter to access bus stops in the array busStops
  // Make sure you call move() after you increment the counter.
  setTimeout(() => {
    counter += 1;
    marker.setLngLat(busStops[counter]); // replace this to comeback after reaching the last element %busStops.length]);
    console.log(counter%busStops.length);
    move()
  }, 1000);
}

// Do not edit code past this point
if (typeof module !== 'undefined') {
  module.exports = { move };
}
