let mysql_modul = require('./module/mysql_modul'),
    timer = require('./module/timer'),
    exchange = require('./module/poloniex');

var job = timer('*/1 * * * * *', () => {
    mysql_modul.get_choice()
        .then((results) => workToDo(results))
        .then(results => exchange.balances()
            .then((balances) => {
                if (balances.BTC > 0.001) {
                    return exchange.buy('BTC_ETH', results[0].btceth, (balances.BTC / results[0].btceth), 1, 0, 0)
                        .then(() => exchange.buy('ETH_ZEC', results[0].ethzec, (balances.ETH / results[0].ethzec), 1, 0, 0))
                        .then(() => exchange.sell('BTC_ZEC', results[0].btczec, balances.ZEC, 1, 0, 0));
                } else if (balances.ETH > 0.02) {

                    return exchange.buy('ETH_ZEC', results[0].ethzec, (balances.ETH / results[0].ethzec), 1, 0, 0)
                        .then(() => exchange.sell('BTC_ZEC', results[0].btczec, balances.ZEC, 1, 0, 0));
                } else if (balances.ZEC > 0.05) {
                    return exchange.sell('BTC_ZEC', results[0].btczec, balances.ZEC, 1, 0, 0);
                }
                return null;
            })
            .then((result) => {
                mysql_modul.update_choice(results[0].id);
                console.log(result);
            })
        )
        .catch(console.error);
}, null, true);

function workToDo(result) {
    if (result[0].status == 0)
        return Promise.resolve(result);
    else
        return Promise.reject(Error('NOTHING_TO_DO'));
}
