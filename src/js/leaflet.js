
import * as L from 'leaflet';

let mymap;

function initLeaflet() {
    mymap = L.map('mapid', {
        center: [48.856667, 2.333333],
        zoom:13
    });
    L.tileLayer('https://api.mapbox.com/styles/v1/ancdev/ck4h9u474101g1co78r1b0pi1/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW5jZGV2IiwiYSI6ImNrNGg5a2J0MDE0NGczc283em50Nm42YnUifQ.pqwstgKJQ9ORs-rYPdHWtA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: 'pk.eyJ1IjoiYW5jZGV2IiwiYSI6ImNrNGg5a2J0MDE0NGczc283em50Nm42YnUifQ.pqwstgKJQ9ORs-rYPdHWtA'
    }).addTo(mymap);

   
}

function addMarker(lat, lng, color) {
   let circle = L.circle([lat, lng], 100, {color: color, weight: 10, fillColor: color});
   circle.addTo(mymap);
}

function addLink(lat1, lng1, lat2, lng2) {}

export { initLeaflet, addMarker, addLink };