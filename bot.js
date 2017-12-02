const path = require('path');
const CronJob = require('cron').CronJob;
const Poloniex = require('poloniex-api-node');
const mysql_modul = require(path.join(__dirname, 'module', 'mysql_modul'));

const key = process.env.POLONIEX_KEY; // API Key
const secret = process.env.POLONIEX_SECRET; // API Private Key

const poloniex = new Poloniex(key, secret);

var job = new CronJob('*/1 * * * * *', () => {
  mysql_modul.get_choice().then( results => {
    if(results[0].status == 0){
      //console.log('jetzt wird gehandelt');
      poloniex.returnBalances().then((balances) => {
        //console.log(balances.BTC/results[0].btceth)
        if(balances.BTC > 0.001){
          poloniex.buy('BTC_ETH', results[0].btceth, (balances.BTC/results[0].btceth), true, false, false, function(err, data){
            if(err){
              console.error(err);
            } else {
              console.log(data);
              poloniex.buy('ETH_ZEC', results[0].ethzec, (balances.ETH/results[0].ethzec), true, false, false, function(err, data){
                if(err){
                  console.error(err);
                } else {
                  console.log(data);
                  poloniex.sell('BTC_ZEC', results[0].btczec, balances.ZEC, true, false, false, function(err, data){
                    if(err){
                      console.error(err);
                    } else {
                      console.log(data);
                      mysql_modul.update_choice(results[0].id).then( suc => {
                        console.log(suc);
                      }).catch((err) => {
                        console.error(err);
                      });
                    }
                  });
                }
              });
            }
          });
        } else if(balances.ETH > 0.02) {
          poloniex.buy('ETH_ZEC', results[0].ethzec, (balances.ETH/results[0].ethzec), true, false, false, function(err, data){
            if(err){
              console.error(err);
            } else {
              console.log(data);
              poloniex.sell('BTC_ZEC', results[0].btczec, balances.ZEC, true, false, false, function(err, data){
                if(err){
                  console.error(err);
                } else {
                  console.log(data);
                  mysql_modul.update_choice(results[0].id).then( suc => {
                    console.log(suc);
                  }).catch((err) => {
                    console.error(err);
                  });
                }
              });
            }
          });
        } else if(balances.ZEC > 0.05) {
          poloniex.sell('BTC_ZEC', results[0].btczec, balances.ZEC, true, false, false, function(err, data){
            if(err){
              console.error(err);
            } else {
              console.log(data);
              mysql_modul.update_choice(results[0].id).then( suc => {
                console.log(suc);
              }).catch((err) => {
                console.error(err);
              });
            }
          });
        }
      }).catch((err) => {
        console.log(err.message);
      });
    } else {
      console.log('jetzt wird nicht gehandelt');
    }
  });
}, null, true);
