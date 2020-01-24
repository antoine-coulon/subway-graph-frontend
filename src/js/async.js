const axios = require('axios');
const qs = require('querystring');

const url = 'http://localhost:8080/subway_graph_project_war_exploded';

async function getLignes() {
    return axios.get(`${url}/stations`);
}

async function getDiameter() {
    return axios.get(`${url}/actions`);
}

async function getShortestPath(sourceId, destId, mode) {
    const body = {
        src: sourceId,
        dest: destId,
        mode
    };

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    return axios.post(`${url}/actions`, qs.stringify(body), config);
}
export {getLignes, getDiameter, getShortestPath};