// Auxiliar functions
// Check whether all elements in an array are not NaN
function checkNaN(arr) {
  return arr.every(element => ~Number.isNaN(element));
}

// Create a marker in the map object mapObj, with coordinates mrkrCoord. Returns the marker object
function addMarker(mapObj, mrkrCoord, popuptext) {
  if (arguments.length < 3) {
    popuptext = {title: 'Marker',
                 description: mrkrCoord};
  }
  let marker = new mapboxgl.Marker()
    .setLngLat(mrkrCoord)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(
        `<h3>${popuptext.title}</h3><p>${popuptext.description}</p>`
        )
      )
    .addTo(mapObj)

  return marker;
}

// Update a marker
function updateMarker(marker, mrkrCoord) {
  marker.setLngLat(mrkrCoord);
}

// Re-centre the map object mapObj in the coordinates centreCoord:
function recentreMap(mapObj, centreCoord) {
  // Move to the new centre
  mapObj.flyTo({center: centreCoord});
  // update initial Marker
  updateMarker(initMrkr, centreCoord);
  initMrkr.togglePopup(true);
  // Update the query
  transitlandAPI = shape_request('https://transit.land/api/v2/rest/stops', {lon: centreCoord[0], lat: centreCoord[1], rad:radius}, transitlan.accessToken);
  run(transitlandAPI);
}

// Get the coordinates from the text box to recentre the map
function center() {
  // Get coordinates from text box
  let textCoord = document.getElementById("centrecord").value;

  // coordinates must be in the form LATITUDE, LONGITUDE (google maps convention)
  mapCentre = textCoord.split(',');
  // mapbox uses LONGITUDE, LATITUDE, so will need to reverse the input
  // (reverse works inplace)
  mapCentre.reverse();
  mapC0 = mapCentre.map(Number);
  if (checkNaN(mapC0) & mapC0.length==2){
    console.log(mapCentre);
    // Stop any ongoing fetching process
    clearTimeout(timer);
    // Recentre map
    recentreMap(map, mapC0);
  }

}

// Get traffic information by fetching whatever API decide to use, based on the location of the map:
async function getTrafficInfo(urlToken) {
  const url = urlToken; // 'http://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
  const response = await fetch(url);
  const json = await response.json();
  return json.stops;
}

// Shedule fetching data periodically and displaying it in the map
async function run(url) {
  const stops = await getTrafficInfo(url);
  console.log(stops);
  if (stops.length > 0) {
    stops.forEach((element, idx) => {
      popuptext = {title: 'Stop Name',
                  description: element.stop_name};
      let mrki = addMarker(map, element.geometry.coordinates, popuptext);
      if (idx == (stops.length-1)) {
        map.flyTo({center: element.geometry.coordinates});
      }
      setTimeout(() => {
        // Modifies the colour of the marker randomly:
        let hueRotLevel = Math.random() * 360;
        el_mrki = mrki.getElement();
        el_mrki.style.filter = 'hue-rotate('+hueRotLevel + 'deg)';
        
      }, idx*200);
      });
    timer = setTimeout(run, 60000);
  } else {
    initMrkr.setPopup(
      new mapboxgl.Popup({ offset: 25 }) // add popups
      .setText("Could not find any bus stop near this place, please try another set of coordinates")
      )
    initMrkr.togglePopup(true);
  }
}

// Shape the url to execute the query in transitland (see https://www.transit.land/)
function shape_request(baseUrl, searchCoord, token) {
  return baseUrl + '?' + 'lon=' + searchCoord.lon + '&lat=' + searchCoord.lat + '&radius=' + searchCoord.rad + '&apikey=' + token;
}

// §§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§
// Initial constants and variables
// Santiago [Latitude, Longitude]:
// var mapC0 = [-33.43021450773247, -70.63269145612679].reverse(); 
// descripC0 = {title: 'Reference Point', description: 'Click over the map to change it'}
// Concepcion [Latitude, Longitude]:
// var mapC0 = [-36.816392332966494, -73.05296554039516].reverse();
// descripC0 = {title: 'Centre Point', description: 'Concepcion, Chile'}
// Talca [Latitude, Longitude]:
var mapC0 = [-35.4231656184843, -71.64862301094895].reverse();
descripC0 = {title: 'Reference Point', description: 'Click over the map to change it'}

// Search radius (in meters)
const radius = 10000;
// map style
const map_style = '//styles/mapbox/streets-v11';

// TODO: find a way to scramble these tokens
mapboxgl.accessToken = 'pk.eyJ1Ijoiamx1bGxvYWEiLCJhIjoiY2wyemphOTEyMWZ0MTNjbXU1aWozbW80bSJ9.2bAdUzIX0h79uDF4RmlFfw';
transitlan = {accessToken: 'QNewQJP5sD5lQjKgAIiSLPmaNO95wUKq'};

// URL where to send the query
transitlandAPI = shape_request('https://transit.land/api/v2/rest/stops', {lon: mapC0[0], lat: mapC0[1], rad:radius}, transitlan.accessToken);

// Initialise the map object, use as a coordinate "Concepcion, Chile" (as returned when searched in google maps) 
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox:'+map_style,
  center: mapC0,
  zoom: 12,
});

let initMrkr = addMarker(map, mapC0, descripC0);
initMrkr.togglePopup(true);
el = initMrkr.getElement();
el.className = 'mainMarker';

// Initialise the timer variable which will be used to control the flow when updating the centre
let timer = null;

// And run the queries for ever....
run(transitlandAPI);

function move() {
  map.flyTo({center: mapC0});
}

map.on('click', (e) => {
  // document.getElementById("centrecord").innerHTML = e.lngLat.lat + ',' + e.lngLat.log;
  let textCoord = document.querySelector("#centrecord");
  textCoord.setAttribute("value", e.lngLat.lat + ',' + e.lngLat.lng);
  updateMarker(initMrkr, e.lngLat.wrap());
  initMrkr.setPopup(
    new mapboxgl.Popup({ offset: 5 }) // add popups
    .setText("Click CENTRE MAP to update")
    )
  initMrkr.togglePopup(true);

});
