import {JSDOM} from "jsdom";
import {Logger} from "./Logger";
import {MapLocation} from "./MapLocation";


export class SeaOfThievesWikiCrawler {

    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    public async getLocationsAsync(): Promise<MapLocation[]> {
        const document = await this.getContentDocumentAsync("https://seaofthieves.fandom.com/wiki/Locations");
        const result = [];
        for await(const location of this.getLocations(document)) {
            rewrite(location);
            result.push(location);
        }
        result.sort((a, b) => a.name.localeCompare(b.name));
        return result;
    }

    async getContentDocumentAsync(url: string): Promise<Document> {
        try {
            this.logger.info(`getContentDocumentAsync(${url})`);
            const response = await JSDOM.fromURL(url);
            return response.window.document;
        }
        catch (ex) {
            this.logger.error(ex);
            throw ex;
        }
    }


    async* getLocations(document: Document): AsyncIterable<MapLocation> {
        yield* this.getLocationsType(document, "Outposts");
        yield* this.getLocationsType(document, "Seaposts");
        yield* this.getLocationsType(document, "Fortresses");
        yield* this.getLocationsType(document, "Islands");
        yield* this.getLocationsType(document, "Sunken Kingdom");
    }

    // https://seaofthieves.fandom.com/wiki/Locations#Outposts
    async* getLocationsType(document: Document, type: string): AsyncIterable<MapLocation> {
        this.logger.info(`getLocationsType(document, ${type})`);
        const headline = document.querySelector(`.wds-tab__content #${type.replace(" ", "_")}`);
        const container = headline.parentElement.parentElement;
        const items = Array.from(container.querySelectorAll("tbody tr"));
        for (const item of items) {
            const link = item.querySelector<HTMLAnchorElement>("td:first-child a");
            if (link) {
                const coordinates = item.querySelector("td:nth-child(2)")?.textContent.replace("\n", "");
                yield {
                    name: link.title,
                    uri: link.href,
                    type,
                    coordinates
                }
            }
        }
    }

    async getLocation(name: string, uri: string): Promise<MapLocation> {
        const document = await this.getContentDocumentAsync(uri);
        const info = document.querySelector(".infoboxtable");
        try {
            const rows = Array.from(info.querySelectorAll<HTMLTableRowElement>("tr"));
            const typeRow = rows.find(row => row.querySelector("th")?.textContent.startsWith("Type"));
            const typeElement = typeRow.querySelector<HTMLAnchorElement>("a");
            const coordinatesRow = rows.find(row => row.querySelector("th")?.textContent.startsWith("Coordinates"));
            const coordinates = coordinatesRow.querySelector("b")?.textContent;
            return {
                name,
                uri,
                type: typeElement.title,
                typeUri: typeElement.href,
                coordinates
            };
        }
        catch (ex) {
            this.logger.error();
        }
    }
}

function rewrite(location: MapLocation) {
    switch (location.name){
        case "Old Boot Fort":
            location.name = "Fort of the Damned";
            break;
    }
}