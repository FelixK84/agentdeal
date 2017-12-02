const Poloniex = require('poloniex-api-node');
const key = process.env.POLONIEX_KEY; // API Key
const secret = process.env.POLONIEX_SECRET; // API Private Key

const poloniex = new Poloniex(key, secret);

module.exports = {
    buy: poloniex.buy,
    sell: poloniex.sell,
    balances: poloniex.returnBalances
};
