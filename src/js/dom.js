import getLignes from './async';
import {addMarker} from './leaflet';

const populate = document.getElementById('populate');
const diameter = document.getElementById('diameter');
const ssp = document.getElementById('ssp');

const populateEvent = populate.addEventListener('click', populateFromApi);
const diameterEvent = populate.addEventListener('click', diameterFromApi);
const sspEvent = populate.addEventListener('click', toggleSSP);


function populateFromApi(event) {
    getLignes()
        .then((lignes) => {
            lignes.data.forEach((ligne) => {
                
                const color = ligneColor(parseInt(ligne.num));
                ligne.routes[0].forEach((station) => {
                     addMarker(station.lat, station.lng, color);
                })
           })
        })
        .catch((err) => {
            console.log(err);
        })
}
function diameterFromApi(event) {}
function toggleSSP(event) {}

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