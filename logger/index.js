const devLogger = require('./devLogger')
const productionLogger = require('./productionLogger')

let logger = devLogger();

if(process.env.ENV === "localhost" || process.env.ENV === "dev"){
    logger = devLogger();
}

if(process.env.ENV == "demo"){
    logger = productionLogger();
}

module.exports =  logger;