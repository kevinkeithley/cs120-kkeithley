let map;

const car_icon = "car.png"

function initMap() {
  map = new google.maps.Map(document.getElementById("map"));

  navigator.geolocation.getCurrentPosition(function (position) {
    var initLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var initLat = position.coords.latitude;
    var initLng = position.coords.longitude;
    var closestLoc;

    map.setCenter(initLoc);
    map.setZoom(2);

    const init_marker = new google.maps.Marker({
      position: initLoc,
      map: map,
    });

    const xhr = new XMLHttpRequest();
    const url = 'https://sleepy-atoll-74388.herokuapp.com/rides';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        const carData = JSON.parse(xhr.responseText);
        // create markers and calc shortest path
        var closestCar;
        let closestDist = 999999999;

        const infoWindow = new google.maps.InfoWindow();
        for (let i = 0; i < carData.length; i++) {
          // let LatLng = { lat: carData[i]['lat'], lng: carData[i]['lng'] };
          let LatLng = new google.maps.LatLng(carData[i]['lat'], carData[i]['lng']);

          new google.maps.Marker({
            position: LatLng,
            map: map,
            title: carData[i]['username'],
            icon: car_icon,
          });

          let distToInit = google.maps.geometry.spherical.computeDistanceBetween(initLoc, LatLng) * 0.000621371;
          if (distToInit < closestDist) {
            closestCar = carData[i]['username'];
            closestDist = distToInit;
            closestLoc = i;
          };

          var contentString =
            '<div id= "content">' +
            '<h2>From this location...</h2>' +
            `<p> The closest vehicle is ${closestCar}.</p>` +
            `<p>It is ${closestDist.toFixed(1)} miles away.</p>` +
            '</div>';
          infoWindow.setContent(contentString);
          init_marker.addListener("click", () => {
            infoWindow.close();
            infoWindow.open({
              anchor: init_marker,
              map: map,
            });
          });
        };

        let closeCoords = '{"lat": ' + carData[closestLoc]["lat"] + ', "lng": ' + carData[closestLoc]["lng"] + '}';
        let initCoords = '{"lat": ' + initLat + ', "lng": ' + initLng + '}';
        const pathCoords = [
          JSON.parse(initCoords),
          JSON.parse(closeCoords)
        ];

        let drivePath = new google.maps.Polyline({
          path: pathCoords,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });

        drivePath.setMap(map);
      };
    };



    xhr.send("username=8SeyrexS&lat=" + position.coords.latitude + "&lng=" + position.coords.longitude);
  });

};

window.initMap = initMap;