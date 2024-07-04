import supertest, { Test } from 'supertest';

import AirQualityService from '@src/services/AirQualityService';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { IQAirPollution } from '@src/models/IQAir';
import Paths from 'spec/support/Paths';
import { TApiCb } from 'spec/types/misc';
import TestAgent from 'supertest/lib/agent';
import { defaultErrMsg as ValidatorErr } from 'jet-validator';
import apiCb from 'spec/support/apiCb';
import app from '@src/server';

const getDummyPollution = () => {
  return {
    ts: '2024-07-03T20:00:00.000Z',
    aqius: 77,
    mainus: 'p2',
    aqicn: 33,
    maincn: 'p2',
  } as IQAirPollution;
};

// Tests
describe('UserRouter', () => {

  let agent: TestAgent<Test>;

  beforeAll(done => {
    agent = supertest.agent(app);
    done();
  });
  
  describe(`"GET:${Paths.AirQuality.NearestCity}"`, () => {
    const LATITUDE_VALIDATION_ERROR_MSG = `${ValidatorErr}"latitude".`
    const LONGITUDE_VALIDATION_ERROR_MSG = `${ValidatorErr}"longitude".`
    
    // Setup API
    const callApi = (
      latitude: number | undefined,
      longitude: number | undefined,
      cb: TApiCb,
    ) => 
      agent
        .get(Paths.AirQuality.NearestCity)
        .query({ latitude: latitude, longitude: longitude })
        .end(apiCb(cb));

    // Success
    it('should return a JSON object with pollution info and a status code ' + 
    `of "${HttpStatusCodes.OK}" if the request was successful.`, (done) => {
      // Create dummy pollution
      const data = getDummyPollution();
  
      // Create findByCoordinates function spy
      spyOn(AirQualityService, 'findByCoordinates').and.resolveTo(data);
      
      // Call API
      callApi(48.8566, 2.3522, res => {
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body).toEqual({ pollution: data });
        done();
      });
    });

    // Missing latitude param
    it('should return a JSON object with an error message of' + 
      `${LATITUDE_VALIDATION_ERROR_MSG} and a status code of ` +
      `${HttpStatusCodes.BAD_REQUEST} if the latitude param was missing.`
    , (done) => {
      // Call API
      callApi(undefined, 2.3522, res => {
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe(LATITUDE_VALIDATION_ERROR_MSG);
        done();
      });
    });

    // Missing longitude param
    it('should return a JSON object with an error message of' + 
      `${LONGITUDE_VALIDATION_ERROR_MSG} and a status code of `+
      `${HttpStatusCodes.BAD_REQUEST} if the longitude param was missing.`,
    (done) => {
      // Call API
      callApi(48.8566, undefined, res => {
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(res.body.error).toBe(LONGITUDE_VALIDATION_ERROR_MSG);
        done();
      });
    });
  });
});