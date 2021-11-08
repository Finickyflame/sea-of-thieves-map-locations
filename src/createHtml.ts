import {MapLocation} from "./MapLocation";

export function createHtml(locations: MapLocation[]) {
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
    <link href="index.css" rel="stylesheet"/>
</head>
<body>
<h1>Sea of Thieves</h1>
<h2>Map locations</h2>
<table class="locations">
    <thead>
        <tr>
            <th>Name</th>
            <th>Coordinates</th>
            <th>Type</th>
        </tr>
    </thead>
    <tbody>${locations.map(location => `
        <tr>
            <td class="name">
                <a title="${location.name}" href="${location.uri}">${location.name}</a>
            </td>
            <td class="coordinates">${location.coordinates}</td>
            <td class="type">${location.type}</td>
        </tr>`).join("")}
    </tbody>
</table>
</body>
</html>`;
}