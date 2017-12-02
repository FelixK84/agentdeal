let mysql_modul = require('./module/mysql_modul'),
    timer = require('./module/timer'),
    exchange = require('./module/poloniex');

timer('*/1 * * * * *', () => {
    mysql_modul.get_choice()
        .then(results => {
            if (results[0].status == 0) {
                exchange.balances()
                    .then((balances) => {
                        if (balances.BTC > 0.001) {
                            exchange.buy('BTC_ETH', results[0].btceth, (balances.BTC / results[0].btceth), 1, 0, 0)
                                .then(() => exchange.buy('ETH_ZEC', results[0].ethzec, (balances.ETH / results[0].ethzec), 1, 0, 0))
                                .then(() => exchange.sell('BTC_ZEC', results[0].btczec, balances.ZEC, 1, 0, 0))
                                .then((result) => {
                                    mysql_modul.update_choice(results[0].id);
                                    console.log(result);
                                })
                                .catch(console.error);
                        } else if (balances.ETH > 0.02) {

                            exchange.buy('ETH_ZEC', results[0].ethzec, (balances.ETH / results[0].ethzec), 1, 0, 0)
                                .then(() => exchange.sell('BTC_ZEC', results[0].btczec, balances.ZEC, 1, 0, 0))
                                .then((result) => {
                                    mysql_modul.update_choice(results[0].id);
                                    console.log(result);
                                })
                                .catch(console.error);
                        } else if (balances.ZEC > 0.05) {
                            exchange.sell('BTC_ZEC', results[0].btczec, balances.ZEC, 1, 0, 0)
                                .then((result) => {
                                    mysql_modul.update_choice(results[0].id);
                                    console.log(result);
                                })
                                .catch(console.error);
                        }
                    }).catch((err) => {
                        console.log(err.message);
                    });
            } else {
                console.log('jetzt wird nicht gehandelt');
            }
        });
}, null, true);
