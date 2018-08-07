//const express = require('express'); //old version JS
import express from 'express'
import fs from 'fs'
const app = express()


app.get('/ping', (req, res) => {
    /*     res
            .status(200)
            //.setHeader('content-type', 'text/html')
        res.send('pong') */
    readJSONFile('public/data/moviesTab.json', (err, json) => {
        if (err) { throw err; }
        //console.log(json);
        res.json(json)
    })
})
/**
 * 
 * @param {*} filename 
 * @param {*} callback 
 */
function readJSONFile(filename, callback) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            callback(err)
            return
        }
        try {
            callback(null, JSON.parse(data));
        } catch (exception) {
            callback(exception)
        }
    })
}

app.listen(5000)

