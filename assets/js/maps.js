// <!-------------- Google Maps API --------------->

// Initialize the map
async function initMap() {
	try {
		// Load the Google Maps JavaScript API libraries
		const { Map } = await google.maps.importLibrary("maps");
		const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

		// Load the MarkerClusterer library from CDN
		await new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src = "https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js";
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});

		const location = { lat: 40.785091, lng: -73.968285 };
		const map = new Map(document.getElementById("map"), {
			zoom: 6,
			center: location,
			mapId: "DEMO_MAP_ID",
		});

		// Example locations
		var labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var locations = [
			{ lat: 40.785091, lng: -73.968285 },
			{ lat: 41.084045, lng: -73.874245 },
			{ lat: 40.754932, lng: -73.984016 },
		];

		// Create markers
		// Create markers with labels
		const markers = locations.map((location, index) => {
			const markerDiv = document.createElement("div");
			// Style the marker using inline styles
			markerDiv.innerHTML = `
            <div style="
            background-color: #e67e22;
            color: white;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">${labels[index % labels.length]}</div>
        `;
			// Create a new AdvancedMarkerElement with the custom markerDiv
			const marker = new AdvancedMarkerElement({
				position: location,
				content: markerDiv.firstElementChild,
				title: location.title,
			});

			// Add click event listener to the marker
			marker.addListener("click", () => {
				map.setZoom(15);
				map.setCenter(location);
			});

			return marker;
		});

		// Create marker clusterer
		new markerClusterer.MarkerClusterer({
			map,
			markers,
			renderer: {
				render: ({ count, position }) => {
					const clusterDiv = document.createElement("div");
					clusterDiv.innerHTML = `
                        <div style="
                            background-color: #4285F4;
                            color: white;
                            width: 36px;
                            height: 36px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                            border: 2px solid white;
                        ">${count}</div>
                    `;

					const clusterMarker = new AdvancedMarkerElement({
						position,
						content: clusterDiv.firstElementChild,
					});

					clusterMarker.addListener("gmp-click", () => {
						map.setZoom(map.getZoom() + 2);
						map.setCenter(position);
					});

					return clusterMarker;
				},
			},
		});
	} catch (error) {
		console.error("Error loading Google Maps:", error);
		const mapContainer = document.getElementById("map");
		if (mapContainer) {
			mapContainer.innerHTML = '<div class="alert alert-danger">Error loading map: ' + error.message + "</div>";
		}
	}
}

// Load Google Maps API
((g) => {
	var h,
		a,
		k,
		p = "The Google Maps JavaScript API",
		c = "google",
		l = "importLibrary",
		q = "__ib__",
		m = document,
		b = window;
	b = b[c] || (b[c] = {});
	var d = b.maps || (b.maps = {}),
		r = new Set(),
		e = new URLSearchParams(),
		u = () =>
			h ||
			(h = new Promise(async (f, n) => {
				await (a = m.createElement("script"));
				e.set("libraries", [...r] + "");
				for (k in g)
					e.set(
						k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
						g[k]
					);
				e.set("callback", c + ".maps." + q);
				a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
				d[q] = f;
				a.onerror = () => (h = n(Error(p + " could not load.")));
				a.nonce = m.querySelector("script[nonce]")?.nonce || "";
				m.head.append(a);
			}));
	d[l] ? console.warn(p + " only loads once. Ignoring:", g) : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
})({
	key: "AIzaSyCQ9rFO8aSVU2_5FAB4Rsgr-I9-a8gwbL4",
	v: "weekly",
	libraries: ["marker"], // Only official Google libraries here
});

document.addEventListener("DOMContentLoaded", initMap);

window.addEventListener("load", function () {
	setTimeout(function () {
		if (!window.google || !google.maps) {
			const mapContainer = document.getElementById("map");
			if (mapContainer) {
				mapContainer.innerHTML = '<div class="alert alert-warning">Google Maps could not be loaded.</div>';
			}
		}
	}, 3000);
});
