import {MapLocation} from "./MapLocation";
import {ImageService} from "./ImageService";

export function createHtml(locations: MapLocation[]) {
    const version = Date.now();
    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Sea of Thieves - Map locations</title>
    <meta name="description" content="Display all the map locations of Sea of Thieves at one glance."/>
    <meta name="author" content="Nicholas Berube"/>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inknut+Antiqua:wght@300&display=swap" rel="stylesheet">
    <link href="index.css?v=${version}" rel="stylesheet"/>
</head>
<body>
<header>
    <a class="brand" href="/" title="Sea of Thieves">Sea of Thieves</a>
    <span class="title">Map locations</span>
    <input class="search" type="search" placeholder="Search..." />
</header>
<main class="locations">${locations.map(location => `
    <div class="location" data-name="${location.name}" data-type="${location.type}" data-coordinates="${location.coordinates}">
        <img class="img" src="images/${ImageService.getFileName(location)}" alt="${location.name}" />
        <a class="name" title="${location.name}" href="${location.uri}">${location.name}</a>
        <span class="coordinates">${location.coordinates}</span>
    </div>`).join("")}
</main>
<script src="index.js?v=${version}"></script>
</body>
</html>`;
}