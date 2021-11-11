import {JSDOM} from "jsdom";
import {Logger} from "./Logger";
import {MapLocation} from "./MapLocation";

export class MapLocationService {

    constructor(private logger: Logger) {
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
        const items = Array.from(container.querySelectorAll<HTMLTableRowElement>("tbody tr"));
        for (const item of items) {
            const location = await this.getLocation(item, type);
            if (location) {
                yield location;
            }
        }
    }

    async getLocation(item: HTMLTableRowElement, type: string): Promise<MapLocation | undefined> {
        const link = item.querySelector<HTMLAnchorElement>("td:first-child a");
        if (link) {
            const name = link.title;
            const uri = link.href;
            const coordinates = item.querySelector("td:nth-child(2)")?.textContent.replace("\n", "");            
            const imgUri = getImgUri(uri.substr(uri.lastIndexOf("/") + 1).replace(/%27|_|-/g, ""));
            
            return {
                name,
                uri,
                type,
                coordinates,
                imgUri
            }
        }
    }
}

/*
 * e.g. https://seaofthieves.fandom.com/wiki/Galleon%27s_Grave_Outpost => https://ddc5e4l4zgom9.cloudfront.net/images/info/islands/small/galleonsgraveoutpost.png
 */
function getImgUri(name: string) {
    return `https://ddc5e4l4zgom9.cloudfront.net/images/info/islands/small/${name.toLowerCase()}.png`;
}

function rewrite(location: MapLocation) {
    switch (location.name) {
        case "Old Boot Fort":
            location.name = "Fort of the Damned";
            break;
        case "Blind Man's Lagoon":
            location.imgUri = getImgUri("blindmanlagoon");
            break;
        case "Forsaken Brink":
            location.imgUri = getImgUri("theforsakenbrink");
            break;
        case "Kraken Watchtower":
            location.imgUri = getImgUri("krakenswatchtower");
            break;
        case "Sailor's Knot Stronghold":
            location.imgUri = getImgUri("sailorsknowstronghold");
            break;
        case "Scurvy Isley":
            location.imgUri = getImgUri("scurvyisland");
            break;
        case "Three Paces East Seapost":
            location.imgUri = getImgUri("thethreepaceseastemporium");
            break;
            
    }
}