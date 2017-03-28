console.log("Javascript läuft");

// BEISPIEL FÜR MAP MIT EINEM ODER MEHREREN INFOWINDOWS

var map;
//blank Array, in das später die einzelnen Marker gepackt werden
var markers=[];
function initMap(){

    //Hier kreieren wir unseren Map-Style in einem eigenen Array
    var style = [
    {
        featureType: "water",
        stylers: [
            { color: "#19a0d8" }
            ]
    },{
        featureType: "administrative",
        elementType: "labels.text.stroke",
        stylers: [
            {color: "#fff"}
        ]
    }


    ]



    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 40.7413549, lng: -73.9980244},
        styles: style,
        mapTypeControl: false,
        zoom: 13
    });

    var locations = [
        {title: "Park Av Penthouse", location: {lat: 40.7713024, lng: -73.9632393}},
        {title: "Chelsea Loft", location: {lat: 40.7444883, lng: -73.9949465}},
        {title: "Union Square Open Floor Plan", location: {lat: 40.7347062, lng: -73.9895759}},
        {title: "East Village Hip Studio", location: {lat: 40.7281777, lng: -73.984377}},
        {title: "Tribeca Artsy Bachelor Pad", location: {lat: 40.7195264, lng: -77.0089934}},
        {title: "Chinatown Homey Space", location: {lat: 40.7180628, lng: -73.9961237}}

    ];

    var largeInfowindow = new google.maps.InfoWindow();

    var bounds = new google.maps.LatLngBounds();

    //hier wird das Array mit den Markern erstellt
    for (var i= 0; i<locations.length; i++){
        var position = locations[i].location;
        var title = locations[i].title;

        // Hier wird ein Marker pro Location erstellt und ins Marker-Array geschoben
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        //Push into Markers Array
        markers.push(marker);

        bounds.extend(marker.position);
        //Creating an onclick-Event for every Marker
        marker.addListener("click", function(){
            populateInfoWindow(this, largeInfowindow)
        });
    }


    // Diese Funktion füllt jetzt das Infowindow mit den entsprechenden
    // Inhalten. Wir in marker.addListener aufgerufen.

    function populateInfoWindow(marker, infowindow){
        if (infowindow.marker !=marker){
            infowindow.marker = marker;
            infowindow.setContent("<div>"+ marker.position + " " +marker.title +"</div>");
            infowindow.open(map, marker);

            // Make sure the marker porperty is cleared if the infowindow is closed
            infowindow.addListener("closeclick", function(){
                infowindow.setMarker(null);
            });
            // hier kreieren wir ein StreetViewService-object
            // das holt sich die Koordinaten des Markers
            var streetViewService = new google.maps.StreetViewService();

            // hier definieren wir einen Radius von 50 Metern, falls an der
            // exakten Position kein Bild zu bekommen ist.
            var radius = 50;

            // dann definieren wir eine getStreetView-Function, die später die
            //ganze Arbeit macht.
            function getStreetView(data, status){
                if (status == google.maps.StreetViewStatus.OK){
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(                     nearStreetViewLocation, marker.position);
                        infowindow.setContent("<div>" + marker.title + "</div>" + "<div id='pano'></div>");
                        var panoramaOptions = {
                            position: nearStreetViewLocation,
                            pov: {
                                heading: heading,
                                pitch: 30
                            }
                        };
                    var panorama = new google.maps.StreetViewPanorama(
                        document.getElementById("pano"), panoramaOptions);
                }else{
                    infowindow.setContent("<div>" + marker.title + "</div>" + "<div>No Street View Found</div>");

                }
                }
            }

            // hier holen wir uns das street-view-Image im Radius von 50 Metern
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        }
    }

    function showListing(){
        var bounds = new google.maps.LatLngBounds();
        for (var i=0; i<markers.length; i++){
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }

    function hideListing(){
        for (var i=0; i<markers.length; i++){
            markers[i].setMap(null);
        }


    document.getElementById("show-listings").addEventListener("click", showListing);
    document.getElementById("hide-listings").addEventListener("click", hideListing);

    map.fitBounds(bounds);
}


// ERSTELLUNG EINES EINZELNEN MARKERS

//     var tribeca = {lat: 40.719526, lng: -74.0089934};
//     var marker = new google.maps.Marker({
//         position: tribeca,
//         map: map,
//         title: "My first Marker"
//     });

//     var infowindow = new google.maps.InfoWindow({
//         content: "Das hier ist mein erstes Info-Window"
//     });

//     marker.addListener("click", function(){
//         infowindow.open(map, marker);
//     });
