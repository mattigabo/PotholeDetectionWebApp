
export class CoordinatesService {

  constructor (map) {

    map.on('click', function(coordinates) {

      console.log(coordinates)

      document.getElementById('coordinates-overlay').style.display = "block";

      if (coordinates.latlng) {
        document.getElementById("coordinates-overlay-lat").innerHTML =
          coordinates.latlng.lat.toFixed(4).toString() + '<strong> N </strong> ';
        document.getElementById("coordinates-overlay-lng").innerHTML =
          coordinates.latlng.lng.toFixed(4).toString() + '<strong> E </strong> ';

      }
    });

    document
      .getElementById('coordinates-overlay')
      .addEventListener( 'click', function() {

        let
          lat = document.getElementById('coordinates-overlay-lat'),
          lng = document.getElementById('coordinates-overlay-lng');

        window.prompt(
          "Press Ctrl+C to copy coordinates",
          lat.textContent.trim() + ',' + lng.textContent.trim()
        );
      });

  }
}
