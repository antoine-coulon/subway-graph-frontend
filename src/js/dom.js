import {getLignes, getDiameter} from './async';
import {addMarker, addLink, getMarkers, animatePathOfMarkers } from './leaflet';

const details = document.getElementById('populate');
const diameter = document.getElementById('diameter');
const ssp = document.getElementById('ssp');


window.addEventListener('DOMContentLoaded', populateFromApi);
const populateEvent = details.addEventListener('click', dataDetails);
const diameterEvent = diameter.addEventListener('click', diameterFromApi);
const sspEvent = ssp.addEventListener('click', toggleSSP);

let stationsAndLignes = new Map();
let linksBetweenStations = new Map();


function populateFromApi(event) {
    getLignes()
        .then((lignes) => {
            lignes.data.forEach((ligne) => {
                const color = ligneColor(parseInt(ligne.num));
                ligne.routes[0].forEach((station, index) => {
                     addMarker(station.lat, station.lng, color, {name: station.nom, ligne: ligne.num, num: station.num});
                     populateMap(ligne.num, station.num);
                     if(index !== 0) {
                         addLink(
                             station.lat, station.lng, 
                             ligne.routes[0][index - 1].lat, ligne.routes[0][index - 1].lng, color, ligne.num, station.num);
                     }
                });
           });
        })
        .catch((err) => {
            console.log(err);
        })
}
function diameterFromApi(event) {
    getDiameter()
        .then((stations) => {
            const diameterStations = stations.data;
            diameterStations.forEach((diamStation, index) => {
                setTimeout(() => {
                    let ligneNumber = stationsAndLignes.get(diamStation.num);
                    animatePathOfMarkers(ligneNumber, diamStation.num);
                   
                }, index * 1000)
            });
        })
        .catch((err) => {
            console.log(err);
        })
}
function toggleSSP(event) {
    getMarkers()
}
function dataDetails(event) {
    getMarkers();
}

function populateMap(ligne, station) {
    stationsAndLignes.set(station, ligne);
}

function ligneColor(num) {
    let color;
    switch(num) {
        case 1 :
            color = "#fec20f"; 
            break;
        case 2 :
            color = "#126da5"; 
            break;
        case 3 :
            color = "#9b8d3c"; 
            break;
        case 4 :
            color = "#b44c95"; 
            break;
        case 5 :
            color = "#eb9011"; 
            break;
        case 6 :
            color = "#83b989"; 
            break;
        case 7 :
            color = "#f49db0"; 
            break;
        case 8 :
            color = "#bb9dc9"; 
            break;
        case 9 :
            color = "#b7ba33"; 
            break;
        case 10 :
            color = "#bea351"; 
            break;
        case 11 :
            color = "#8b663c"; 
            break;
        case 12 :
            color = "#09875b"; 
            break;
        case 13 :
            color = "#a0d5d0"; 
            break;
        case 14 :
            color = "#66328b"; 
            break;
    }
    return color;
}