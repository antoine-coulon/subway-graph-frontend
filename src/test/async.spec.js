const asyncModule = require('../js/async');
const axios = require('axios');


jest.mock('axios');

describe('Testing API calls with Axios', async () => {

    it('Should get all the stations from backend', async () => {
       
        const response = await asyncModule.getDiameter();
        console.log(response);
        const res = await asyncModule.getLignes();
        console.log(res);
        expect(response).toBeDefined();
    })
})