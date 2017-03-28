console.log ("srcipt 2 läuft!");


// Hier wird die Grundkarte erstellt, mit einer globalen map-Variable und einer
// globalen Variable für die Marker
// globale Variable für den Karten-Style
// globale Variable, in der wir gezeichnete Polygone speichern



 var map;
 var markers = [];
 var placeMarkers = [];
 var polygon = null;
 var styles = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];

// Init-Funktion der Karte, in der sich später auch alle anderen Funktionen finden
 function initMap(){
    console.log("initMap() abgefeuert!");

    // Hier wird die Grundmap mit ihren Optionen erstellt. Kann sehr einfach sein,
    // kann man aber auch mit Optionen zuschroten.
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 40.7413549, lng: -73.99802443},
        zoom: 15,
        styles: styles
    });

    // Vorarbeit: Ich erstelle eine Bounds-Objekt. Dort packe später die Grenzen meiner Karte (also die maximale Ausdehnung
    // die durch die Position der Marker vorgegeben ist) in eine Variable.
    // Grund: Später erweitere ich diese Grenzen jeweils um die Position der einzelnen
    // Marker in der for-Schleife und lege dann ganz am Ende damit den
    // Kartenausschnitt fest
    var bounds = new google.maps.LatLngBounds();

    // Hier legen wir zwei Autofills an für die Textboxen
    // ACHTUNG: Dafür muss die google-Places-Library geladen werden

      // This autocomplete is for use in the search within time entry box.
        var timeAutocomplete = new google.maps.places.Autocomplete(
            document.getElementById('search-within-time-text'));
        // This autocomplete is for use in the geocoder entry box.
        var zoomAutocomplete = new google.maps.places.Autocomplete(
            document.getElementById('zoom-to-area-text'));

        // beschränkt die Suche nach Orten, die innerhalb des Kartenausschnitts liegen
        zoomAutocomplete.bindTo("bounce", map);

        // Hier hoelen wir uns die Searchbox
        // dafür müssen weiter unten noch zwei Eventlistener und eine Funktion
        // erstellt werden.
         // Create a searchbox in order to execute a places search
        var searchBox = new google.maps.places.SearchBox(
            document.getElementById('places-search'));
        // Bias the searchbox to within the bounds of the map.
        searchBox.setBounds(map.getBounds());


    // Hier werden die Infowindows erstellt
    // 1. Eine Variable, die ein neues Infowindow-Objekt darstellt.
    var largeInfoWindow = new google.maps.InfoWindow();

    // 2. Dann hole ich die verschiedenen Locations der Marker rein
    var locations = [
        {title: "Park Av Penthouse", location: {lat: 40.7713024, lng: -73.9632393}},
        {title: "Chelsea Loft", location: {lat: 40.7444883, lng: -73.9949465}},
        {title: "Union Square Open Floor Plan", location: {lat: 40.7347062, lng: -73.9895759}},
        {title: "East Village Hip Studio", location: {lat: 40.7281777, lng: -73.984377}},
        {title: "Tribeca Artsy Bachelor Pad", location: {lat: 40.7195264, lng: -77.0089934}},
        {title: "Chinatown Homey Space", location: {lat: 40.7180628, lng: -73.9961237}}
    ];
    console.log ("for-Schleife startet");
    // 3. Ich iteriere über das Location-Array und ziehe die beiden keys-value-pairs raus,
    // also title und location .... MARKERERSTELLUNG
    for (var i=0; i<locations.length; i++){
        var title = locations[i].title;
        var position = locations[i].location;

        // in der for-Schleife erstelle ich einen Marker pro locations-Element, alseo
        // für locations[i]. Dort baue ich die notwendigen Marker-Optionen ein
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });

        // dann füge ich die einzelnen Markerobjekte in das Array markers ein
        // wird später u.a. für show & hide benutzt
        markers.push(marker);

        // jetzt füge ich die Position des neuen Markers in mein Bounds-Objekt ein
        // um später den richtigen Kartenausschnitt zu erhalten.
        bounds.extend(marker.position);

        // jetzt bekommt der einzelne Marker, also jeder Marker, noch ein Click-Event
        // Inhalt: beim Click auf das einzelne Element soll die
        // Funktion populateInfoWindow gezündet werden.
        //Wichtig: addListener, nicht addEventListner. KEINE AHNUNG WARUM!!!
        marker.addListener("click", function(){
            populateInfoWindow(this, largeInfoWindow);
        });

    // Ende der for-Schleife
    }

    // Jetzt schreiben wir die Funktion, die das Infowindow füllt und mit dem Eventhandler
    // verdrahtet ist, der in der For-Schleife jedem Marker einen Eventlistener mitgibt
    // der Parameter marker bezieht sich auf this im Eventlistener, also den einzelnen Marker
    // der Parameter infowindow ist verdrahtet mit der variable largeInfoWindow. Sie ist
    // festgelegt als Aufruf eines neuen InfoWindow-Objekts, also immer des zu sehenden Info-Windows
    //
    function populateInfoWindow(marker, infowindow){


            // ZWEI VARIANTEN
            // VARIANTE A - INFOWINDOW BEKOMMT "NUR" EINEN TEXT

            // Test, ob das Infowindow des jeweiligen Markers nicht schon geöffnet ist
            // nur dann wird ein neues Infowindow erstellt.

                // if (infowindow.marker!=marker){

                    // infowindow.marker = marker;

            //man kann statt .setContent DAten auch direkt in den InfoWindowOptions eingeben
            // also new google.maps.InfoWindow({content: xxxxx}).

                    // infowindow.setContent("<div>" + marker.title + "</div>");


                    //infowindow.open(map, marker);

            // auch hier addListener statt addEventListener KEINE AHNUNG WARUM
            // UND: Udacity hat vorgeschlagen infowindow.setMarker(null),
            // das wirft aber eine Fehlermeldung raus
            // der Marker wird auf null gesetzt und damit versteckt.

                    // infowindow.addListener("closeclick", function(){
                    //     infowindow.marker = null;
                    // });


            // VARIANTE B - EINBINDEN VON STREETVIEW

            // Test, ob das Infowindow des jeweiligen Markers nicht schon geöffnet ist
            // nur dann wird ein neues Infowindow erstellt.

            if (infowindow.marker!=marker){

                //Jetzt leeren wir den Content des InfoWindows
                infowindow.setContent("");

                // Wir schaufeln die aktuellen des i-markers in das Infowindow
                infowindow.marker = marker;

                // Jetzt überprüfen wir, dass das Infowindow geschlossen ist
                infowindow.addListener("closeclick", function(){
                    infowindow.marker = null;
                });

                // jetzt legen wir eine Variable als neues StreetView-Objekt fest
                var streetViewService = new google.maps.StreetViewService();

                // und wir legen eine radius-Variable fest. Hintergrund: Sollte sich
                // an der exakten Position kein Foto finden lassen, sagt der Radius, dass
                // wir ein Bild innerhalb eines Umkreises von 50 Metern nehmen können.
                var radius = 50;

                // Jetzt legen wir die Funktion fest, die schlussendlich Streetview herunter-
                //lädt und einbaut.
                function getStreetView(data, status){
                    // erst checken wir, ob es überhaupt ein Bild gibt
                    if (status==google.maps.StreetViewStatus.OK){
                        // hier rufen wir unsere Position auf und GSV sorgt dafür,
                        // dass wir mit heading von dieser Position auf das Bild blicken,
                        // das für die Position bzw. die nächste Position vorhanden ist.
                        // dafür brauchen wir die Google-Geometry-Librarie, die müssen wir im
                        // HTML-Script mitladen .../api/js?libraries=geometry&key....
                        // dann nutzen wir daraus die computeHeading-Function

                        var nearStreetViewLocation = data.location.latLng;
                        var heading = google.maps.geometry.spherical.computeHeading(
                            nearStreetViewLocation, marker.position);
                            // WICHTIG: NICHT VERGESSEN DEM DIV #PANO IN CSS AUCH EINE GRÖßE ZU GEBEN,
                            // SONST SIEHT MAN NIX!!!!
                            infowindow.setContent("<div>" + marker.title + "</div><div id='pano'></div>");
                            // hier setzen wir die Optionen für unser Panorama. Die Position ist in der
                            //Variable nearStreeViewLocation, gespeichert, pov (Point of View) bestimmt das
                            // heading (das wir durch coumputeHeading errechnet haben) und den pitch (Winkel)
                            var panoramaOptions = {
                                position: nearStreetViewLocation,
                                pov: {
                                    heading: heading,
                                    pitch: 30
                                }
                            };

                            // Hier erstellen wir unser Panorama, nehmen dafür die panorama-Optionen und lassen
                            // das ganze in das div #pano plumpsen, das wir zuvor in der Funktion
                            // getStreetView erstellt haben.
                            var panorama = new google.maps.StreetViewPanorama(
                                document.getElementById('pano'), panoramaOptions);
                    } else { // wenn wir kein Panorama gefunden haben, weisen wir darauf hin
                        infowindow.setContent("<div>" + marker.title + "</div>" +
                            "<div> No Street View Found</div>");
                    }
                }


                // Hier nutzen wir die .getPanoramaByLocation-Function
                // wir geben ihr mit die Marker-Position, den von uns festgelegten radius und
                //unsere weiter oben angelegte getStreetView-Funktion
                streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

                // Hier öffnen wir das Infowindow auf dem richtigen, angewählten Marker
                infowindow.open(map, marker);




        }
    }


    // Hier initialisieren wir den Drawing-Manager
    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_LEFT,
            drawingModes: [
            google.maps.drawing.OverlayType.POLYGON
            // es gibt noch drawing-modes wie rectangluar, marker etc.
            // alle werden etwas unterschiedlich gezeichnet, aber:
            // Polygone sind am schwersten, wenn man die kann, kann man die anderen auch
            ]
        }
    });

    // Diese Funktion ist mit dem Eventhandler für den Drawing-Button verdrahtet, zündet
    // also, wenn der User den Button klickt.

    function toggleDrawing(drawingManager){
        if(drawingManager.map){
            drawingManager.setMap(null);
        } else {
            drawingManager.setMap(map);
        }
    }





    // hier verdrahte ich die beiden Buttons Show & Hide
    // ist so eingestellt, dass die Buttons erstmal zu sehen sind.
    // Ansonsten müsste man vermutlich entweder die for-Schleife in die
    // function showListing() einfügen oder die Funktion hideListing()
    // grundsätzlich aufrufen.

    // erstmal bekommen die Buttons Show & hide einen Eventhandler
    document.getElementById("show-listings").addEventListener("click", showListings);
    document.getElementById("hide-listings").addEventListener("click", hideMarkers(markers));

    // hier ein Event-Listener für die Geocoding-Buttons
    document.getElementById("zoom-to-area").addEventListener("click", function(){
        zoomToArea();
    });

    //hier der Eventlistener für die Distance-Funktionen

    document.getElementById("search-within-time").addEventListener("click", function(){
        searchWithinTime();
    })
    // das hier ist der Eventlistener für unsere Drawing-Funktion. Der Button im
    //HTML wird damit verdrahtet, toggle Drawing wird weiter unten angelegt.

    document.getElementById("toggle-drawing").addEventListener("click", function(){
        toggleDrawing(drawingManager);
    });

    // hier fragen wir den Inhalt der Searchbox ab.
    searchBox.addListener("places_changed", function(){
        searchBoxPlaces(this);
    });

    document.getElementById("go-places").addEventListener("click", textSearchPlaces);


    // der nächste Eventlistener wird aufgerufen, wenn ein Polygon gezeichnet wird
    // in diesem Fall wird die searchWithinPolygon-Funktion aufgerufen. Sie zeigt
    // dann nur noch die Marker an, die im Polygon sind.
    // Wieder: addListener statt addEventListener !!!
    drawingManager.addListener("overlaycomplete", function(event){
        //zunächst schaut die Funktion, ob es bereits ein Polygon gibt
        // Wenn ja, wird es gelöscht und die Marker werden entfernt
        // dafür schauen wir in die globale Polygon-Variable
        // man könnte die Nutzer auch mehrere Polygone zeichnen lassen
        if (polygon){
            polygon.setMap(null);
            hideMarkers(markers);
        }

        // wir gehen davon aus, dass die Nutzer mit Zeichnen fertig sind, wenn
        // das Polygon geschlossen wird
        drawingManager.setDrawingMode(null);

        // dann schaffen wir ein neues, editierbares Polygon aus dem gerade
        // auf dem Overlay gezeichneten Polygons. Dafür nutzen wir den Parameter
        // event, der der Callback-Funktion im Listener mitgegeben wurde
        polygon = event.overlay;
        // wir machen das Polygon editable, könnten es z.B. auch dragable machen
        polygon.setEditable(true);

        // dann legen wir fest, dass nur im Polygon gesucht werden darf
        // diese Funktion legen wir weiter unten fest.
        searchWithinPolygon();

        // hier sichern wir ab, dass die Suche wiederholt wird, wenn sich das Polygon ändert

        polygon.getPath().addListener("set_at", searchWithinPolygon);
        polygon.getPath().addListener("insert_at", searchWithinPolygon);
    });

    // Hier legen wir die Funktion zoomToArea an, die die vom Nutzer eingegebene
    // Adresse nimmt, sie geocodet und dann dafür sorgt, dass wir in das jeweilige
    // Gebiet hineinzoomen.
    function zoomToArea(){
        //Zunächst initialisieren wir den Geocoder
        var geocoder = new google.maps.Geocoder();
        // dann holen wir uns die Adresse aus dem HTML-Element #zoom-to-area-text
        var address = document.getElementById("zoom-to-area-text").value;
        // Erst checken wir dann, dass überhaupt etwas eingetragen wurde
        if (address == ""){
            window.alert("You must enter an area or address.");
        }else{
            //wir nehmen die Adresse aus dem Textfeld und geocoden sie, dann zentrieren
            // wir die Karte und zoomen hinein
            geocoder.geocode(
                {address: address,
                // hier beschränken wir die Ergebnisse auf New York
                componentRestrictions: {locality: "New York"}
            }, function(results, status){
                if (status == google.maps.GeocoderStatus.OK) {
                    // normalerweise spuckit Google mehrere Geolocations als Ergebnis aus
                    //wir nehmen in der Regel das Beste auf der ersten Position, also [0]
                    map.setCenter(results[0].geometry.location);
                    map.setZoom(15);
                }else{
                    window.alert("We could not find that location - try entering an more" + " specific place.");
                }
            });
        }
    }

    // Jetzt legen wir unsere searchWithinPolygon-Funktion an
    function searchWithinPolygon(){
        // wir durchsuchen das markers-Array
        for(var i=0; i<markers.length; i++){
            // falls der marker über die Methode containsLocation entdeckt wird,
            // setzen wir ihn auf die Karte
            if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)){
                markers[i].setMap(map);
            }else{
                markers[i].setMap(null);
            }
        }
    }

    // // Hier legen wir die Funktion toggleDrawing an, sie ist per Eventlistener
    // // mit dem Button toggleDrawing verbunden
    // // Sie checkt, ob der drawingMode eingeschaltet ist oder nicht
    // function toggleDrawing(drawingManager){
    //     console.log ("toggleDrawing gefeuert");
    //     if (drawingManager.map){
    //         drawingManager.setMap(null);
    //         //Wenn der User etwas gezeichnet hat, wird das alte Polygon gelöscht
    //         if (polygon){
    //             polygon.setMap(null);
    //         }else{
    //             drawingManager.setMap(map);
    //         }
    //     }
    // }


    // Hier die Funktionen, um die Marker an- und auszuschalten.

    function showListings(){
        console.log("showListings gefeuert");
        var bounds = new google.maps.LatLngBounds();
        for (var i=0; i<markers.length; i++){
            // .setMap setzt scheinbar automatisch ein Marker-Objekt auf die map
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
            // die Bounds-Befehle sorgen am Ende dafür, dass bei show wieder auf
            // einen Ausschnitt gezoomt wird, in dem alles zu sehen ist.
            map.fitBounds(bounds);
        }
    console.log("showlistings beendet");
    }

    // Diese Funktion loopt durch das Array, das wir ihr mitgeben (in unserem Fall
    // markers) und blendet die Marker aus.
    // Der Vorteil: Wir können auswählen, welches Set von Markern wir ausblenden
    function hideMarkers(markers){

        for (var i=0; i<markers.length; i++){
            markers[i].setMap(null); // versteckt die Marker, löscht sie aber nicht
        }
    }




    //BLOCK DISTANCE
    //hier ist der Code für die Funktion, Entfernungen zu berechnen
    function searchWithinTime(){
        //hier rufen wir den Google Distance Matrix Service
        var distanceMatrixService = new google.maps.DistanceMatrixService;
        var address = document.getElementById("search-within-time-text").value;
        // Zunächst prüfen wir, ob überhaupt etwas eingegeben wurde
        if (address == ""){
            window.alert("Bitte Adresse eingeben");
        }else{
            hideMarkers(markers);
            //Nachdem wir die Marker ausgeblendet haben, nutzen wir die Distance Matrix
            // um die Dauer der STrecken zwischen all unseren Markern und der von uns
            // eingegebenen.
            // wir packen die Positionen aller unserer Marker in ein Array namens origins
            var origins = [];
            for(var i=0; i<markers.length; i++){
                origins[i]=markers[i].position;
            }
            var destination = address;
            //hier holen wir uns den Wert, der bei select angeklickt wurde
            var mode = document.getElementById("mode").value;
            // wir haben den Wert unseres Ursprungs (origin) und unseres Ziels
            //(destination). Jetzt können wir die Distance-Matrix nutzen, indem wir
            // dessen Funktion getDistanceMatrix aufrufen.
            distanceMatrixService.getDistanceMatrix({
                origins: origins,
                destinations: [destination],
                travelMode: google.maps.TravelMode[mode],
                unitSystem: google.maps.UnitSystem.IMPERIAL,
            }, function(response, status){
                if (status!== google.maps.DistanceMatrixStatus.OK){
                    window.alert("Error was: " + status);
                }else{ // bedeutet: Wenn wir Ergebnisse zurückbekommen...
                    console.log("Abfrage erfolgreich, Infowindow zeichnen...")
                    displayMarkersWithinTime(response)
                    // ... und in dieser Funktion steckt die eigentliche Arbeit
                }
            });
        }
    }

    // Diese Funktion zeigt alle Marker in der von uns gewählten Distanz und Reisedauer
    // an.
    function displayMarkersWithinTime(response){
        // zunächst holen wir uns den Wert, den wir bei Reisezeit im HTML anklicken
        var maxDuration = document.getElementById("max-duration").value;
        // Jetzt ziehen wir uns Daten aus der Response von Google auf unsere Abfrage
        // in der oberen Funktion heraus.
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;

        // Jetzt durchsuchen wir die Resultate und holen uns die unterschiedlichen
        // Entfernungen. Es kann sein, dass mehrere Locations in Frage kommen, daher
        // nutzen wir einen nested loop. Dann testen wir, ob mindestens ein Ergebnis
        // den Anforderungen entspricht
        var atLeastOne = false;

        for (var i=0; i<origins.length; i++) {

            var results = response.rows[i].elements;
            console.log(results);
            for (var j = 0; j<results.length; j++){
                var element = results[j];
                console.log("2. for schleife");
                console.log(element.status);
                if (element.status === "OK"){
                    // Achtung, die Entfernung wird in Fuß ausgegeben, das müsste
                    // man noch umrechnen
                    var distanceText = element.distance.text;
                    console.log("if statement Window zeichnen ok");
                    // die Reisezeit wird in Sekunden ausgegeben, die rechnen wir um
                    var duration = element.duration.value / 60;
                    var durationText = element.duration.text;
                    if (duration<=maxDuration){
                        // wenn unsere Position innerhalb der maximalen Dauer liegt
                        markers[i].setMap(map);
                        atLeastOne = true;
                        // Jetzt erstellen wir noch ein Mini-Infowindow,
                        // das sich sofort öffnet und Distance und Duration anzeigt
                        // im zweiten Schritt zeigt es zudem einen Button, mit dem man sich
                        // mögliche Strecken anzeigen lassen kann
                        var infowindow = new google.maps.InfoWindow({
                            content: durationText + " away, " + distanceText + '<div><input type=\"button\" value=\"View Route\" onclick =' +
                    '\"displayDirections(&quot;' + origins[i] + '&quot;);\"></input></div>'
                        });
                        infowindow.open(map, markers[i]);
                        // jetzt noch ein eventhandler der dafür sorgt, dass sich das kleine
                        // Infowindow schließt, wenn der Nutzer auf den Marker klickt und dadurch
                        // das große Infowindow aufruft.
                        markers[i].infowindow = infowindow;
                        google.maps.event.addListener(markers[i], "click", function(){
                            this.infowindow.close();
                        });
                    }
                }
            }
        }
    // hier ein Befehl, der ausgeworfen wird, wenn wir keinen Ort innerhalb der Distanz finden
    if (!atLeastOne){
        window.alert("We couldn´t find any locations within that distance");
    }
    }

    // Diese Funktion wird mit dem Button "View Route" abgefeuert, den wir in die
    // Infowindows eingebaut haben, die bei der Umkreissuche erscheinen.

    function displayDirections(origin) {
        hideMarkers(markers);
        //Hier initialisieren wir den google Directionsservice
        var directionsService = new google.maps.DirectionsService;
        // Get the destination address from the user entered value.
        var destinationAddress = document.getElementById('search-within-time-text').value;
        // Get mode again from the user entered value.
        var mode = document.getElementById('mode').value;
        // Hier kalkulieren wir die Route mit den einge
        directionsService.route({
          // The origin is the passed in marker's position.
          origin: origin,
          // The destination is user entered address.
          destination: destinationAddress,
          travelMode: google.maps.TravelMode[mode]
        }, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            var directionsDisplay = new google.maps.DirectionsRenderer({
              map: map,
              directions: response,
              draggable: true,
              polylineOptions: {
                strokeColor: 'green'
              }
            });
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
    }

    // This function fires when the user selects a searchbox picklist item.
      // It will do a nearby search using the selected query string or place.
      function searchBoxPlaces(searchBox) {
        hideMarkers(placeMarkers);
        var places = searchBox.getPlaces();
        if (places.length == 0) {
          window.alert('We did not find any places matching that search!');
        } else {
        // For each place, get the icon, name and location.
          createMarkersForPlaces(places);
        }
      }
      // This function firest when the user select "go" on the places search.
      // It will do a nearby search using the entered query string or place.
      function textSearchPlaces() {
        var bounds = map.getBounds();
        hideMarkers(placeMarkers);
        var placesService = new google.maps.places.PlacesService(map);
        placesService.textSearch({
          query: document.getElementById('places-search').value,
          bounds: bounds
        }, function(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            createMarkersForPlaces(results);
          }
        });
      }
      // This function creates markers for each place found in either places search.
      function createMarkersForPlaces(places) {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < places.length; i++) {
          var place = places[i];
          var icon = {
            url: place.icon,
            size: new google.maps.Size(35, 35),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 34),
            scaledSize: new google.maps.Size(25, 25)
          };
          // Create a marker for each place.
          var marker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location,
            id: place.place_id
          });
          // Create a single infowindow to be used with the place details information
          // so that only one is open at once.
          var placeInfoWindow = new google.maps.InfoWindow();
          // If a marker is clicked, do a place details search on it in the next function.
          marker.addListener('click', function() {
            if (placeInfoWindow.marker == this) {
              console.log("This infowindow already is on this marker!");
            } else {
              getPlacesDetails(this, placeInfoWindow);
            }
          });
          placeMarkers.push(marker);
          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        }
        map.fitBounds(bounds);
      }
    // This is the PLACE DETAILS search - it's the most detailed so it's only
    // executed when a marker is selected, indicating the user wants more
    // details about that place.
    function getPlacesDetails(marker, infowindow) {
      var service = new google.maps.places.PlacesService(map);
      service.getDetails({
        placeId: marker.id
      }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Set the marker property on this infowindow so it isn't created again.
          infowindow.marker = marker;
          var innerHTML = '<div>';
          if (place.name) {
            innerHTML += '<strong>' + place.name + '</strong>';
          }
          if (place.formatted_address) {
            innerHTML += '<br>' + place.formatted_address;
          }
          if (place.formatted_phone_number) {
            innerHTML += '<br>' + place.formatted_phone_number;
          }
          if (place.opening_hours) {
            innerHTML += '<br><br><strong>Hours:</strong><br>' +
                place.opening_hours.weekday_text[0] + '<br>' +
                place.opening_hours.weekday_text[1] + '<br>' +
                place.opening_hours.weekday_text[2] + '<br>' +
                place.opening_hours.weekday_text[3] + '<br>' +
                place.opening_hours.weekday_text[4] + '<br>' +
                place.opening_hours.weekday_text[5] + '<br>' +
                place.opening_hours.weekday_text[6];
          }
          if (place.photos) {
            innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
                {maxHeight: 100, maxWidth: 200}) + '">';
          }
          innerHTML += '</div>';
          infowindow.setContent(innerHTML);
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
        }
      });
    }
    // Diese Functionen betreuen die Searchbox
    // sucht nach den Orten, die wir in der Searchbox angegeben haben

    map.fitBounds(bounds);

}