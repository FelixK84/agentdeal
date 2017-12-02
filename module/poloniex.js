const Poloniex = require('poloniex-api-node');
const key = process.env.POLONIEX_KEY; // API Key
const secret = process.env.POLONIEX_SECRET; // API Private Key

const poloniex = new Poloniex(key, secret);

module.exports = {
    buy: buy,
    sell: sell,
    balances: poloniex.returnBalances
};


function buy(pair, limit, quantity, fillorkill, p, q){
    return new Promise((resolve,reject)=>{
        poloniex.buy(pair, limit, quantity, 1, false, false, function(error, data){
            if(error){
                reject(Error(error.message));
            } else {
                resolve(data);
            }
        });
    });
}

function sell(pair, limit, quantity, fillorkill, p, q){
    return new Promise((resolve,reject)=>{
        poloniex.sell(pair, limit, quantity, 1, false, false, function(error, data){
            if(error){
                reject(Error(error.message));
            } else {
                resolve(data);
            }
        });
    });
}
