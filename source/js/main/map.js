function initMap() {
  var myLatLng = { lat: 59.938635, lng: 30.323118 };

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: myLatLng
  });

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'г. Санкт Петербург, ул. Большая Конюшенная, 19/8'
  });
}
