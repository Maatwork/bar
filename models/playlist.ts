const { Pool } = require('pg');

const pool = new Pool();
const Logger = require('../models/logger');


module.exports.savePlaylist = function (name, songs, user_id, type, startdatetime, enddatetime, callback: Function) {
    let sql = 'INSERT INTO playlists(id, name, songs, user_id, type, startdatetime, enddatetime) VALUES(uuid_generate_v4(), $1, array[$2]::json[], $3, $4, to_timestamp($5), to_timestamp($6)) returning id, name';
    if (!enddatetime) {
        const sql = 'INSERT INTO playlists(id, name, songs, user_id, type, startdatetime) VALUES(uuid_generate_v4(), $1, array[$2]::json[], $3, $4, to_timestamp($5)) returning id, name';
    }
    pool.query(sql, [name, songs, user_id, type, startdatetime, enddatetime], (err, result) => {
        if (err) {
            Logger.log('error', err);
            callback(err, '');
        } else {
            return callback(err, result);
        }
    })
};
module.exports.saveOrUpdatePlaylist = function (name, songs, user_id, type, startdatetime, enddatetime, callback) {
    var playlistFound = false;
    pool.query("SELECT user_id ,name FROM playlists", function (err, result, fields) {
        if (err) {
            Logger.log('error', err);
            callback(err, '');
        }
        else {
            for (var i = 0; i < result.rows.length; i++) {
                if (result.rows[i].user_id == user_id && result.rows[i].name == name) {
                    var sql = 'DELETE FROM playlists WHERE user_id = $1 AND name = $2';
                    pool.query(sql, [result.rows[i].user_id, result.rows[i].name], function (err, result) {
                        if (err) {
                            Logger.log('error', err);
                            return callback(err, '');
                        }
                        else {
                            playlistFound = true;
                        }
                    });
                }
            }
            if (!playlistFound) {
                var sql = 'INSERT INTO playlists(id, name, songs, user_id, type, startdatetime, enddatetime) VALUES(uuid_generate_v4(), $1, array[$2]::json[], $3, $4, to_timestamp($5), to_timestamp($6)) returning id, name';
                if (!enddatetime) {
                    var sql_2 = 'INSERT INTO playlists(id, name, songs, user_id, type, startdatetime) VALUES(uuid_generate_v4(), $1, array[$2]::json[], $3, $4, to_timestamp($5)) returning id, name';
                }
                pool.query(sql, [name, songs, user_id, type, startdatetime, enddatetime], function (err, result) {
                    if (err) {
                        Logger.log('error', err);
                        return callback(err, '');
                    }
                });
            }
        }
    });
};