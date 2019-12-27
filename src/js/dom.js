import {getLignes, getDiameter, getShortestPath } from './async';
import {addMarker, addLink, getMarkers, animatePathOfMarkers, highlightMarker } from './leaflet';

const details = document.getElementById('populate');
const diameter = document.getElementById('diameter');
const ssp = document.getElementById('ssp');
const sourceInput = document.getElementById('source-input');
const destinationInput = document.getElementById('destination-input');
const sourceSelect = document.getElementById('source-select');
const destinationSelect = document.getElementById('destination-select');
sourceSelect.addEventListener('change', updateSourceChoices);
destinationSelect.addEventListener('change', updateDestinationChoices);


window.addEventListener('DOMContentLoaded', populateFromApi);
//const populateEvent = details.addEventListener('click', dataDetails);
const diameterEvent = diameter.addEventListener('click', diameterFromApi);
const sspEvent = ssp.addEventListener('click', toggleSSP);
const sourceSearchInput = sourceInput.addEventListener('input', filterStations);
const destinationSearchInput = destinationInput.addEventListener('input', filterStations);



let stationsAndLignes = new Map();
let linksBetweenStations = new Map();
let staticLignes = [];
let sourceStation = 1;
let destinationStation = 1;
let validSrc = false;
let validDest = false;

function populateFromApi(event) {
    getLignes()
        .then((lignes) => {
            lignes.data.map(ligne => staticLignes[ligne.num] = ligne);
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
                    animatePathOfMarkers(ligneNumber, diamStation.num, false); 
                }, index * 1000)
            });
        })
        .catch((err) => {
            console.log(err);
        })
}
function toggleSSP(event) {
    const actionBloc = document.getElementById('actions-bloc');
    $(actionBloc).slideToggle();

    const elems = document.getElementsByClassName('lignes-select');
    for(let elem of elems) {
        appendOptionsToSelect(elem);
    }
}

function appendOptionsToSelect(select) {
    staticLignes.forEach((ligneData, index) => {
        const childOption = document.createElement('option');
        childOption.value = ligneData.num;
        childOption.textContent = `Ligne : ${ligneData.num}`;
        select.appendChild(childOption);
    });
    select.selectedIndex = 0;
}

function updateSourceChoices(event) {
    const divEncap = document.getElementsByClassName(`text-zone-source`);
    divEncap[0].innerHTML = "";
    sourceStation = event.target.value;
}

function updateDestinationChoices(event) {
    const divEncap = document.getElementsByClassName(`text-zone-destination`);
    divEncap[0].innerHTML = "";
    destinationStation = event.target.value;
}

function filterStations(event) {
    const divResults = event.target.id === "source-input" ? "text-zone-source" : "text-zone-destination"; 

    const divEncap = document.getElementsByClassName(`${divResults}`);

    divEncap[0].innerHTML = "";

    const input = event.target.value;
   
    if(input.length > 0) {
        

        const sourceOrDest = event.target.id === "source-input" ? sourceStation : destinationStation; 
 
        let stationsByLigne = staticLignes[sourceOrDest];
         
        const results = stationsByLigne.routes[0].filter(station => station.nom.substr(0, event.target.value.length).toLowerCase() === event.target.value.toLowerCase());
    
        if(results.length > 0) {divEncap[0].style.display = "block";} else { divEncap[0].style.display = "none"; }
        const ulResults = document.createElement('ul');
        ulResults.setAttribute('class', 'result-style');
    
        results.forEach((result) => {
            const liElement = document.createElement('li');
            liElement.addEventListener('click', setStation);
            liElement.setAttribute('id', result.num);
            liElement.setAttribute('class', divResults);
            const ligneNumber = stationsAndLignes.get(result.num);
    
            const statusLigne = event.target.id === "source-input" && parseInt(ligneNumber) !== parseInt(sourceStation) ? sourceStation : false;
            const statusDest = event.target.id === "destination-input" && parseInt(ligneNumber) !== parseInt(destinationStation) ? destinationStation : false;
    
            let bbis;
            if(statusLigne !== false) bbis = createBElementWithStyle(statusLigne, event.target.value.length); 
            if(statusDest !== false) bbis = createBElementWithStyle(statusDest, event.target.value.length); 
    
            const ligneIcon = createBElementWithStyle(ligneNumber);
            const parentElement = document.createElement('p');
            liElement.innerHTML = result.nom;
            parentElement.appendChild(ligneIcon);
            if(bbis) parentElement.appendChild(bbis);
            liElement.appendChild(parentElement);
            ulResults.appendChild(liElement);
        })
        divEncap[0].append(ulResults);
    } else {
        divEncap[0].style.display = "none";

    }
      
}

function createBElementWithStyle(ligneNumber, wordLength) {
    const ligneIcon = document.createElement('b');
    const paddingIcon = ligneNumber.length > 1 ? "5px 7px" : "5px 11px";
    ligneIcon.innerHTML = ligneNumber;
    ligneIcon.style.backgroundColor = ligneColor(ligneNumber);
    ligneIcon.style.padding = paddingIcon;
    ligneIcon.setAttribute('class', 'roundedIcon');
    return ligneIcon;
}

function setStation(event) {
    const station = event.target.id;
    const selectTarget = event.target.className;

    const typeSelect = event.target.className === "text-zone-source" ? "source-input" : "destination-input";

    typeSelect.startsWith('source') ? setCurrentMarker(station, 'source', sourceStation) : setCurrentMarker(station, 'dest', destinationStation);
    const select = document.getElementById(`${typeSelect}`);
    select.value = event.target.id + " - " + event.target.firstChild.textContent;
    const divToHide = document.getElementsByClassName(`${selectTarget}`);
    divToHide[0].style.display = 'none';
    checkForAvailibity();
}

function setCurrentMarker(id, status, ligne) {
    highlightMarker(ligne, id, status);
}

function checkForAvailibity() {
    const sourceInputValue = sourceInput.value.split('-')[0].trim();
    const destinationInputValue = destinationInput.value.split('-')[0].trim();


    if(sourceInputValue && destinationInputValue) {
        const validSourceStation = stationsAndLignes.get(sourceInputValue.toString()) || null;
        const validDestStation = stationsAndLignes.get(sourceInputValue.toString()) || null;

        if(validSourceStation && validDestStation) {
           getShortestPath(sourceInputValue.toString(), destinationInputValue.toString(), document.getElementById('modeSelect').value)
                .then((stations) => {
                    const shortestPathStations = stations.data;
                    shortestPathStations.forEach((diamStation, index) => {
                        if(index !== 0 || index === shortestPathStations.length - 1) {
                            setTimeout(() => {
                                let ligneNumber = stationsAndLignes.get(diamStation.num);
                                animatePathOfMarkers(ligneNumber, diamStation.num, true);
                            }, index * 500)

                        }
                  
                    });
                    showShortestPath(shortestPathStations);
                })
                .catch((err) => {
                    console.log(err)
                });
        }
    }
}

function populateMap(ligne, station) {
    stationsAndLignes.set(station, ligne);
}

function showShortestPath(shortestPathStations) {
    document.getElementById('snackbar-success').style.display = "flex";

    setTimeout(() => {
        document.getElementById('snackbar-success').style.display = "none";
    }, shortestPathStations.length * 500);
}

function ligneColor(num) {
    let color;
    switch(parseInt(num)) {
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