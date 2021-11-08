import {readFileSync, writeFileSync} from "fs";
import {SeaOfThievesWikiCrawler} from "./SeaOfThievesWikiCrawler";
import {ConsoleLogger} from "./ConsoleLogger";
import {MapLocation} from "./MapLocation";
import {createHtml} from "./createHtml";
import {Logger} from "./Logger";


(async (args: string[]) => {
    const logger: Logger = new ConsoleLogger();
    try {
        const [arg] = args;
        logger.info("Started");
        switch (arg) {
            case "json": {
                const locations = await getLocations(logger);
                writeJson("./data/locations.json", locations, logger);
                break;
            }
            case "html": {
                logger.info("Building html...");
                const locations: MapLocation[] = getJsonLocations("locations.json", logger);
                const html = createHtml(locations);
                writeFileSync("./public/index.html", html);
                break;
            }
            default: {
                const locations = await getLocations(logger);
                writeJson("./data/locations.json", locations, logger);
                const html = createHtml(locations);
                writeFileSync("./public/index.html", html);
            }
        }

    }
    catch (ex) {
        logger.error(ex);
    }
    finally {
        logger.info("Completed");
    }
})(process.argv.slice(2));

async function getLocations(logger: Logger): Promise<MapLocation[]> {
    logger.info("Retrieving locations...");
    return await new SeaOfThievesWikiCrawler(logger).getLocationsAsync();
}

function writeJson(filePath: string, locations: MapLocation[], logger: Logger) {
    logger.info("Building json...");
    writeFileSync(filePath, JSON.stringify(locations));
}

function getJsonLocations(filePath: string, logger: Logger): MapLocation[] {
    logger.info("Reading locations from json...");
    return JSON.parse(readFileSync(filePath, {
        encoding: 'utf8',
        flag: 'r'
    }));
}