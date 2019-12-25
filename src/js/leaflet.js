
import * as L from 'leaflet';

let mymap;
let markers = [];
let links = [];
let binks = [];

function initLeaflet() {
    mymap = L.map('mapid', {
        center: [48.856667, 2.35333],
        zoom:13
    });
    L.tileLayer('https://api.mapbox.com/styles/v1/ancdev/ck4h9u474101g1co78r1b0pi1/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW5jZGV2IiwiYSI6ImNrNGg5a2J0MDE0NGczc283em50Nm42YnUifQ.pqwstgKJQ9ORs-rYPdHWtA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: 'pk.eyJ1IjoiYW5jZGV2IiwiYSI6ImNrNGg5a2J0MDE0NGczc283em50Nm42YnUifQ.pqwstgKJQ9ORs-rYPdHWtA'
    }).addTo(mymap);

   
}

function addMarker(lat, lng, color, content) {
   let circle = L.circle([lat, lng], 100, {color: color, weight: 10, fillColor: color,fillOpacity: 0.8
   });
   circle.on('click', () => {}).addTo(mymap);
   binks.push(circle);
   circle.bindPopup(
       `
        <b> Station : ${content.name} </b> <br/>
        <b> Ligne : ${content.ligne} </b> 
       `
   );
   if(!markers[content.ligne]) markers[content.ligne] = [];
   markers[content.ligne] = [...markers[content.ligne], {[content.num]: circle}];
}

function addLink(lat1, lng1, lat2, lng2, color, ligneNumber, stationNumber) {
   let link = L.polyline([[lat1, lng1], [lat2, lng2]], {color: color, weight: 8});
   link.addTo(mymap);
   link.bindPopup(`<b style="color:${color}"> Ligne ${ligneNumber} </b>`);
    if(!links[stationNumber]) links[stationNumber] = [];
    links[stationNumber] = [...links[stationNumber], link];
}

function getMarkers() {
  // let shush = links[1].find(ctn => ctn._leaflet_id == 66)
   console.log(links)
}

function animatePathOfMarkers(ligneNumber, stationNumber) {
    console.log(ligneNumber, stationNumber)
    const idx = markers[ligneNumber].findIndex(mk => Object.keys(mk).toString() === stationNumber)
    let mk = markers[ligneNumber][idx][stationNumber];
    mk.setStyle({color: 'red'});
    mk.bringToFront();
 // mymap.removeLayer(mk);  
  
//     let marker = binks[10];

//    mymap.removeLayer(marker);
    
}



export { initLeaflet, addMarker, addLink, getMarkers, animatePathOfMarkers };