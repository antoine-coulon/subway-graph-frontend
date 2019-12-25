import * as axios from 'axios';
import 'babel-polyfill';

const url = 'http://localhost:8080/subway_graph_project_war_exploded';

async function getLignes() {
    return axios.get(`${url}/stations`);
}

async function getDiameter() {
    return axios.get(`${url}/actions`);
}

export {getLignes, getDiameter};