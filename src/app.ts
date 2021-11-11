import {readFileSync, writeFileSync, rmSync, mkdirSync} from "fs";
import {MapLocationService} from "./MapLocationService";
import {ConsoleLogger} from "./ConsoleLogger";
import {MapLocation} from "./MapLocation";
import {createHtml} from "./createHtml";
import {Logger} from "./Logger";
import {ImageService} from "./ImageService";

const locationFilePath = "./data/locations.json";
const htmlFilePath = "./public/index.html";
const imagesPath = "./public/images";


(async (args: string[]) => {
    const logger: Logger = new ConsoleLogger();
    try {
        const [arg] = args;
        logger.info("Starting");
        logger.info(`Building ${arg ? `only ${arg}` : "all"}...`);
        switch (arg) {
            case "json": {
                const locations = await getLocations(logger);
                writeJson(locationFilePath, locations, logger);
                break;
            }
            case "html": {
                const locations: MapLocation[] = getJsonLocations(locationFilePath, logger);
                writeHtml(htmlFilePath, locations, logger);
                break;
            }
            case "images": {
                const locations: MapLocation[] = getJsonLocations(locationFilePath, logger);
                await writeImages(imagesPath, locations, logger);
                break;
            }
            default: {
                const locations = await getLocations(logger);
                writeJson(locationFilePath, locations, logger);
                writeHtml(htmlFilePath, locations, logger);
                await writeImages(imagesPath, locations, logger);
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
    return await new MapLocationService(logger).getLocationsAsync();
}

function writeJson(filePath: string, locations: MapLocation[], logger: Logger) {
    logger.info(`Writing ${filePath}...`);
    writeFileSync(filePath, JSON.stringify(locations));
}

function getJsonLocations(filePath: string, logger: Logger): MapLocation[] {
    logger.info(`Reading locations from ${filePath}...`);
    return JSON.parse(readFileSync(filePath, {
        encoding: 'utf8',
        flag: 'r'
    }));
}

function writeHtml(filePath: string, locations: MapLocation[], logger: Logger){
    logger.info(`Writing ${filePath}...`);
    const html = createHtml(locations);
    writeFileSync(htmlFilePath, html);
}

async function writeImages(folderPath: string, locations: MapLocation[], logger: Logger) {
    logger.info(`Deleting ${folderPath}...`);
    rmSync(folderPath, {recursive: true, force: true});
    mkdirSync(folderPath);
    
    for await(const image of new ImageService(logger).getImagesAsync(locations)) {
        const filePath = `${folderPath}/${image.fileName}`;
        logger.info(`Writing ${filePath}...`);
        writeFileSync(filePath, image.content, {});
    }
}