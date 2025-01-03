const baseMaps = {
    "Google": L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: '© Google'
    }),
    "Opensteermap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }),
    "Satellite": L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        attribution: '© Google',
    }),
};
// Finland coordinates
let coordinates = [65.0, 27.0];
let zoom = 4;
if (campgrounds.length === 1) {
    const geometry = campgrounds[0].location.geometry;
    coordinates = [geometry.coordinates[1], geometry.coordinates[0]];
    zoom = 13;
}

const map = L.map('map', {
    center: coordinates,
    zoom: zoom,
    layers: [baseMaps["Opensteermap"]]
});
L.control.layers(baseMaps).addTo(map);

map.addControl(new L.Control.Fullscreen({
    title: {
        'false': 'Kokonäyttötila',
        'true': 'Poistu kokonäyttötilasta'
    }
}));

const markers = L.markerClusterGroup();

for (let campground of campgrounds) {
    const mapPoint = campground.location.mapPoint;
    const marker = L.marker(mapPoint.coordinates).bindPopup(mapPoint.popupText);
    markers.addLayer(marker);
}

map.addLayer(markers);

if (campgrounds.length > 1) {
    const bounds = markers.getBounds();
    map.fitBounds(bounds);
    map.setZoom(zoom);
}