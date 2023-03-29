let map;

const car_icon = "car.png"

function initMap() {
  map = new google.maps.Map(document.getElementById("map"));

  navigator.geolocation.getCurrentPosition(function (position) {
    var initLoc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    map.setCenter(initLoc);
    map.setZoom(2);

    const xhr = new XMLHttpRequest();
    const url = 'https://jordan-marsh.herokuapp.com/rides';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        const carData = JSON.parse(xhr.responseText);
        // create markers
        for (let i = 0; i < carData.length; i++) {
          let LatLng = { lat: carData[i]['lat'], lng: carData[i]['lng'] };
          new google.maps.Marker({
            position: LatLng,
            map: map,
            title: carData[i]['username'],
            icon: car_icon,
          });
        }
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

};

window.initMap = initMap;