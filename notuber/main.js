let map;

const carIds = ["mXfkjrFw", "nZXB8ZHz", "Tkwu74WC", "5KWpnAJN", "uf5ZrXYw", "VMerzMH8"];
const carLocs = {
  "mXfkjrFw": [42.3453, -71.0464],
  "nZXB8ZHz": [42.3662, -71.0621],
  "Tkwu74WC": [42.3603, -71.0547],
  "5KWpnAJN": [42.3472, -71.0802],
  "uf5ZrXYw": [42.3663, -71.0544],
  "VMerzMH8": [42.3542, -71.0704]
};

const car_icon = "car.png"

function initMap() {
  map = new google.maps.Map(document.getElementById("map"));

  navigator.geolocation.getCurrentPosition(function (position) {
    var initLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    map.setCenter(initLoc);
    map.setZoom(4);

    const xhr = new XMLHttpRequest();
    const url = 'https://jordan-marsh.herokuapp.com/rides';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText)
      }
    };

    xhr.send("username=8SeyrexS&lat=" + position.coords.latitude + "&lng=" + position.coords.longitude);

    const contentString =
      '<div id= "content">' +
      '<h2>From this location...</h2>' +
      '<p>The closest vehicle is</p>' +
      '<p>It is miles away</p>' +
      '</div>';

    const infoWindow = new google.maps.InfoWindow({
      content: contentString,
    });

    const init_marker = new google.maps.Marker({
      position: initLoc,
      map: map,
    });

    init_marker.addListener("click", () => {
      infoWindow.open({
        anchor: init_marker,
        map: map,
      });
    });
  });

  // create markers
  for (let i = 0; i < carIds.length; i++) {
    let LatLng = { lat: carLocs[carIds[i]][0], lng: carLocs[carIds[i]][1] };
    new google.maps.Marker({
      position: LatLng,
      map: map,
      title: carIds[i],
      icon: car_icon,
    });
  }
}

window.initMap = initMap;