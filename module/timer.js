const CronJob = require('cron').CronJob;

module.exports=(interval,func,p,q)=>{
    return new CronJob(interval, func, p, q);
};
