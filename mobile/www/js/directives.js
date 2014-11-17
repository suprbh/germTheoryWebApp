angular.module('app.directives', [])
  .directive('spotsMap', function(Config, $http) {

    return {
      restrict: 'E',
      scope: {
      },
      link: function ($scope, $element, $attr) {
        function initialize() {
          var mapOptions = {
            center: new google.maps.LatLng(37.7836830,-122.4092210),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          var map = new google.maps.Map($element[0], mapOptions);


         $http.get(Config.url+'/api/cases').then(function(resp){
           data = resp.data;
           for(var i = 0; i < data.length; i++){
             var report = data[i];
             var marker = new google.maps.Marker({
               position: new google.maps.LatLng(report.latitude, report.longitude),
               map: map,
               title:report.description
             });
           }

         });

          // Stop the side bar from dragging when mousedown/tapdown on the map
          google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
            e.preventDefault();
            return false;
          });
        }

        if (document.readyState === "complete") {
          initialize();
        } else {
          google.maps.event.addDomListener(window, 'load', initialize);
        }
      }
    }
  });

