import {Image} from "./Image";
import fetch from "node-fetch";
import {Logger} from "./Logger";
import {MapLocation} from "./MapLocation";
import sharp from "sharp";


export class ImageService {

    public static readonly dimension = 295; 
    
    constructor(private logger: Logger) {
    }

    public async* getImagesAsync(locations: Iterable<MapLocation>): AsyncIterable<Image> {
        for (const location of locations) {
            const image = await this.getImageAsync(location);
            if (image) {
                yield image;
            }
        }
    }

    public async getImageAsync(location: MapLocation): Promise<Image | undefined> {
        const response = await fetch(location.imgUri, {
            headers: {
                Referer: "https://maps.seaofthieves.rarethief.com/"
            }
        });
        //this.logger.info(`getImageAsync(${location.imgUri}, ${location.name}): ${response.status}`);
        if (response.status == 200) {
            return {
                fileName: ImageService.getFileName(location),
                content: await toWebp(response)
            };
        }
        else {
            this.logger.error(`Failed to retrieve image for '${location.name}' at '${location.imgUri}':`, response.status);
        }
    }

    public static getFileName({name}: MapLocation): string {
        return name.replace(/[ '-]/g, "") + ".webp";
    }
}

async function toWebp(response): Promise<Buffer> {
    const data = await response.buffer();
    return new Promise(resolve =>
        sharp(data)
            .resize(ImageService.dimension)
            .webp()
            .toBuffer((err, buffer) => resolve(buffer))
    );
}