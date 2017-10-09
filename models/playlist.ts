const { Pool } = require('pg');

const pool = new Pool();

module.exports.savePlaylist = function (name, songs, user_id, type, startdatetime, enddatetime, callback: Function) {
    let sql = 'INSERT INTO playlists(id, name, songs, user_id, type, startdatetime, enddatetime) VALUES(uuid_generate_v4(), $1, array[$2]::json[], $3, $4, to_timestamp($5), to_timestamp($6)) returning id, name';
    if (!enddatetime) {
        const sql = 'INSERT INTO playlists(id, name, songs, user_id, type, startdatetime) VALUES(uuid_generate_v4(), $1, array[$2]::json[], $3, $4, to_timestamp($5)) returning id, name';
    } else {}
    pool.query(sql, [name, songs, user_id, type, startdatetime, enddatetime], (err, result) => {
        if (err) {
            console.log(err);
            callback(err, '');
        } else {
            return callback(err, result);
        }
    })
};