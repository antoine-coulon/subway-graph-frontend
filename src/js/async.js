import * as axios from 'axios';
import 'babel-polyfill';

const url = 'http://localhost:8080/subway_graph_project_war_exploded';

export default async function getLignes() {
    return axios.get(`${url}/stations`);
}