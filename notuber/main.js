let map;

const car_icon = "car.png"

function initMap() {
  map = new google.maps.Map(document.getElementById("map"));

  navigator.geolocation.getCurrentPosition(function (position) {
    var initLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    map.setCenter(initLoc);
    map.setZoom(2);

    const init_marker = new google.maps.Marker({
      position: initLoc,
      map: map,
    });

    const xhr = new XMLHttpRequest();
    const url = 'https://jordan-marsh.herokuapp.com/rides';
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
          let LatLng = { lat: carData[i]['lat'], lng: carData[i]['lng'] };

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
          };
          console.log(carData[i]);
          console.log(`This car id is: ${carData[i]['username']}`)
          console.log(`Distance to origin is: ${distToInit}`);
          console.log(`The current closest distance is: ${closestDist}`);
          console.log(`The closest car is: ${closestCar}`);
          var contentString =
            '<div id= "content">' +
            '<h2>From this location...</h2>' +
            `<p> The closest vehicle is ${closestCar}.</p>` +
            `<p>It is ${closestDist.toFixed(1)} miles away.</p>` +
            '</div>';

          infoWindow.setContent(contentString)
          init_marker.addListener("click", () => {
            infoWindow.close();
            infoWindow.open({
              anchor: init_marker,
              map: map,
            });
          });
        };
      };
    };

    xhr.send("username=8SeyrexS&lat=" + position.coords.latitude + "&lng=" + position.coords.longitude);
  });

};

window.initMap = initMap;