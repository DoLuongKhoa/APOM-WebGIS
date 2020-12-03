import './map.html';

Template.map.rendered = function () {
  window.require([
    "esri/Map",
    "esri/widgets/BasemapToggle",
    "esri/widgets/Legend",
    "esri/layers/FeatureLayer",
    "esri/widgets/TimeSlider",
    "esri/widgets/Search",
    "esri/views/MapView",
    "esri/layers/MapImageLayer",
    "esri/tasks/Locator",
    "dojo/domReady!"
  ], function (Map, BasemapToggle, Legend, FeatureLayer, TimeSlider, Search, MapView, MapImageLayer, Locator) {

    // hiển thị phần bản đồ chính

    var layer = new MapImageLayer({
      //   url: "http://113.175.118.161:6080/arcgis/rest/services/PM25_time/MapServer",
      url: "http://113.175.118.161:6080/arcgis/rest/services/mergePolygon_10days/MapServer",
      opacity: 0.5,
    });
    var map = new Map({
      basemap: "streets",

      layers: [layer]
    });
    var view = new MapView({
      container: "viewDiv",
      map: map,
      zoom: 5,
      center: [107.590866, 16.463713]
    });

    // Thêm một bản đồ nền để chuyển đổi
    var toggle = new BasemapToggle({
      view: view,
      nextBasemap: "gray-vector"
    });

    view.ui.move("zoom", "bottom-left");

    // Thêm chú thích
    var legend = new Legend({
      view: view,
      layerInfos: [
        {
          layer: layer,
          opacity: 1.0,
          title: "Chỉ số PM 2.5"
        }
      ]
    });

    // tạo và thêm thanh search cho bản đồ

    var searchWidget = new Search({
      view: view
    });

    view.ui.add(searchWidget, {
      position: "top-right"
    });

    // thêm bản đồ nền tạo ở trên vào bản đồ

    view.ui.add(toggle, "top-left");

    // thêm phần chú thích tạo ở trên vào bản đồ

    view.ui.add(legend, "bottom-right");

    // tạo featureLayer để lấy dữ liệu

    var featureLayer = new FeatureLayer({
      //   url: "http://113.175.118.161:6080/arcgis/rest/services/PM25_time/MapServer/0",
      url: "http://113.175.118.161:6080/arcgis/rest/services/mergePolygon_10days/MapServer",
      opacity: 0.5,
      timeInfo: {
        startField: "time", // name of the date field
        interval: {
          // set time interval to one day
          unit: "days",
          value: 1
        },
        fullTimeExtent: {
          start: new Date(2017, 0, 1),
          end: new Date(2017, 0, 10)
        }
      }
    });

    // sử dụng popupTemplate để hiển thị popup 

    featureLayer.popupTemplate = {
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "GRID_CODE",
              label: "Chỉ số PM2.5",
              format: {
                places: 0,
                digitSeparator: true
              }
            }]
        }
      ]
    };


    // lấy thông tin vị trí địa lý và hiển thị lên popup 

    const locatorTask = new Locator({
      url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
    });
    view.on("click", function (event) {
      // Get the coordinates of the click on the view
      var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
      var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;

      var params = {
        location: event.mapPoint
      };

      // Display the popup
      // Execute a reverse geocode using the clicked location
      locatorTask
        .locationToAddress(params)
        .then(function (response) {
          // If an address is successfully found, show it in the popup's content
          featureLayer.popupTemplate.title = "<table><tr><th>Toạ độ địa lý: </th><td>[" + lon + ", " + lat + "]</td></tr><tr><th>Địa điểm: </th><td>" + response.address + "</td></tr></table>";
        })
        .catch(function (error) {
          // If the promise fails and no result is found, show a generic message
          featureLayer.popupTemplate.title = "Không có địa danh nào cho vị trí này";
        });
    });
    map.add(featureLayer);

    // thêm time slider và hiển thị dữ liệu từ 1/1/2017 đến 10/1/2017

    var timeSlider = new TimeSlider({
      container: "timeSlider",
      view: view,
      mode: "cumulative-from-start",
      tickConfigs: [{
        mode: "position",
        values: [
          new Date(2017, 0, 1), new Date(2017, 0, 2), new Date(2017, 0, 3),
          new Date(2017, 0, 4), new Date(2017, 0, 5), new Date(2017, 0, 6),
          new Date(2017, 0, 7), new Date(2017, 0, 8), new Date(2017, 0, 9),
          new Date(2017, 0, 10)
        ].map((date) => date.getTime()),
        labelsVisible: true,
        labelFormatFunction: (value) => { // get the full year from the date
          const date = new Date(value);
          return `${date.getDate() + "/1"}`; // only display the last two digits of the year
        },
        tickCreatedFunction: (value, tickElement, labelElement) => { // callback for the ticks
          tickElement.classList.add("custom-ticks");  // assign a custom css for the ticks 
          labelElement.classList.add("custom-labels"); // assign a custom css for the labels
        }
      }]

    });


    // wait for the time-aware layer to load
    featureLayer.when(function () {
      // set up time slider properties based on layer timeInfo
      timeSlider.fullTimeExtent = featureLayer.timeInfo.fullTimeExtent;
      timeSlider.stops = {
        interval: featureLayer.timeInfo.interval
      };
    });
    view.ui.add(timeSlider, "bottom-left");

  });
}
