var path = require('path');
var mysql = require('mysql');
var dbc = require(path.join(__dirname, '..', 'config', 'dbc'));

var Mysql_modul = {

  insert_factor: (factor, da, callback) => {


    /*  the datum var has the format dd.MM.yyyy when it comes.
        for the query i need either integer or the timestamp format!  */
    dbc.getconnection((err, con) => {
        con.connect();

        var queryString = "INSERT INTO choises SET ?";

        var values = {
          factor: factor,
          etceth: da[0].etceth,
          ethxbt: da[2].ethxbt,
          etcxbt: da[1].etcxbt
        };

        con.query(queryString, values, (err, results, fields) => {
          con.end();
          if(err){
            callback(err);
          } else {
            callback(null, true)
          }
        });
    });
  },

  get_choice: () => {
    return new Promise((resolve, reject)=>{
      dbc.getconnection((err, con) => {
          con.connect();

          var queryString = "SELECT * FROM choices where id = (select max(id) from choices)";

          /*var values = {

          };*/

          con.query(queryString, /*values,*/ (err, results, fields) => {
            con.end();
            if(err){
              reject(err);
            } else {
              resolve(results);
            }
          });
      });
    });
  },

  update_choice: (id) => {
    return new Promise((resolve, reject)=>{
      dbc.getconnection((err, con) => {
          con.connect();

          var queryString = "UPDATE choices SET status = ? WHERE id = ?";

          var values = [
            true,
            id
          ];

          con.query(queryString, values, (err, results, fields) => {
            con.end();
            if(err){
              reject(err);
            } else {
              resolve(true);
            }
          });
      });
    });
  },

  getrate_etcxbt: (callback) => {
    dbc.getconnection((err, con) => {
        con.connect();

        var queryString = "SELECT * FROM etc_xbt where id = (select max(id) from etc_xbt)";

        /*var values = {

        };*/

        con.query(queryString, /*values,*/ (err, results, fields) => {
          con.end();
          if(err){
            callback(err);
          } else {
            callback(null, results)
          }
        });
    });
  },

  getrate_ethxbt: (callback) => {
    dbc.getconnection((err, con) => {
        con.connect();

        var queryString = "SELECT * FROM eth_xbt where id = (select max(id) from eth_xbt)";

        /*var values = {

        };*/

        con.query(queryString, /*values,*/ (err, results, fields) => {
          con.end();
          if(err){
            callback(err);
          } else {
            callback(null, results)
          }
        });
    });
  },

  update_time: (id, date, from, to, callback) => {

    dbc.getconnection((err, con) => {
      con.connect();

      var queryString = "UPDATE times SET arbeitsbeginn = ?, arbeitsende = ? WHERE id = ?";

      //console.log(Time_modul.makedateobj(date, from));

      var values = [
        Time_modul.makedateobj(date, from),
        Time_modul.makedateobj(date, to),
        id
      ];

      //console.log(values[0]);
      //console.log(values[1]);
      //console.log(values.id);
      //console.log(values.arbeitsbeginn);
      //console.log(values.arbeitsende);

      con.query(queryString, values, (err, results, fields) => {
        con.end();
        if(err){
          callback(err);
        } else {
          callback(null, true)
        }
      });
    });
  }
}

module.exports = Mysql_modul;
