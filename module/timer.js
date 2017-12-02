const CronJob = require('cron').CronJob;

module.exports=(interval,func)=>{
    return new CronJob(interval, func);
};
