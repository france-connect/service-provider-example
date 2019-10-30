/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import {
  validTokenConf, invalidTokenConf, initializeMocks, cleanMocks,
} from './mock/france-connect';

chai.use(chaiHttp);
const { expect } = chai;

describe('GET /', () => {
  it('should return a 200 OK', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('GET /callback', () => {
  beforeEach(initializeMocks);
  afterEach(cleanMocks);

  it('should return 302 when no code is provided', (done) => {
    chai.request(app)
      .get('/login-callback')
      .redirects(0)
      .end((err, res) => {
        expect(res).to.have.status(302);
        done();
      });
  });

  it('should return 500 when using an invalid code', (done) => {
    chai.request(app)
      .get(`/login-callback?code=${invalidTokenConf.requestBodyQuery.code}&state=customState11`)
      .redirects(0)
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  it('should return 302 when a valid code is provided', (done) => {
    chai.request(app)
      .get(`/login-callback?code=${validTokenConf.requestBodyQuery.code}&state=customState11`)
      .redirects(0)
      .end((err, res) => {
        expect(res).to.have.status(302);
        done();
      });
  });
});

describe('GET /login', () => {
  it('should return a 200 OK', (done) => {
    chai.request(app)
      .get('/login')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should return a 400 OK', (done) => {
    chai.request(app)
      .get('/login?hello=world')
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should return a 400 OK with error well formated', (done) => {
    const desc = 'j%27ai%20trouv%C3%A9%20%2B%20d%27une%20erreur%20%26%20200%20cul-de-sac%20%3D%20un%20probl%C3%A8me%20%23grave%20%40franceconnect%3B%20and%20what%20else%20...';
    chai.request(app)
      .get(`/login?error=access_denied&error_description=${desc}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
