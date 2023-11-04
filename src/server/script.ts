import { logger, pool, server } from "./server";

pool.query("CREATE TABLE scores (\
    name VARCHAR(2000),\
    SCORE int\
    );")
    .then(() => {
        logger.info("Created table scores")
    })
    .catch((err) => {
        logger.error(`Could not create table scores:\n ${err}`)
})

server.close()