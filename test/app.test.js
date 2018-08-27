import supertest from 'supertest'
import app from '../src/app.js'
import should from 'should'
import fs from 'fs'
import config from 'config'

beforeEach('Reset Movie List', () => {
    fs.copyFileSync('public/data/moviesTabInit.json', config.get('jsonFile'))
})

describe('GET /movies', () => {
    it('should send a list of movies', done => {
        supertest(app)
        .get('/movies')
        .expect(200)
        .expect(res => {
            should.exist(res.body)
            res.body.should.be.a.Array
            res.body.length.should.be.above(0)
            res.body[0].should.have.only.keys('title', 'poster', 'alt', 'id')
            res.body.length.should.be.equal(6)
        })
        .end(done)
    })
})

describe('GET /movie/:id', () => {
    it('should send a description', done => {
        supertest(app)
        .get('/movie/0')
        .expect(200)
        .expect(({ body }) => {
            should.exist(body)
            body.should.be.a.Array
            body.should.have.keys('synopsis')
        })
        .end(done)
    })
    it('should send a 404 error', done => {
        supertest(app)
        .get('/movie/10')
        .expect(404)
        .expect(({ text }) => {
            should.exist(text)
            text.should.not.be.empty
        })
        .end(done)
    })
})

describe('POST /MovieForm', () => {
    it('should display error messages', done => {
        supertest(app)
        .post('/MovieForm')
        .expect(400)
        .expect(({ body }) => {
            should.exist(body)
            body.should.be.a.Array
            body.length.should.be.above(0)
        })
        .end(done)
    })
    it('should add a movie to the database', done => {
        supertest(app)
        .post('/MovieForm')
        .send({
            "title": "Inception",
            "poster": "https://www.imdb.com/title/tt1375666/mediaviewer/rm3426651392?ref_=tt_ov_i",
            "alt": "Inception",
            "link": "https://www.imdb.com/title/tt1375666/mediaviewer/rm3426651392?ref_=tt_ov_i",
            "synopsis": "A thief who steals corporate secrets through \
            the use of dream-sharing technology is given the inverse task \
            of planting an idea into the mind of a CEO.",
            })
        .expect(200)
        .expect(({ body }) => {
            should.exist(body)
            console.log(body)
            //body.id.should.be.above(0)
        })
        .end(done)
    })
})