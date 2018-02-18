var gpxParser = require('./gpxParser');
const events = require('events');
var emitter = new events.EventEmitter();
class DataEmmiter extends events.EventEmitter{};
function haversine() {
    var radians = Array.prototype.map.call(arguments, function(deg) { return deg/180.0 * Math.PI; });
    var lat1 = radians[0], lon1 = radians[1], lat2 = radians[2], lon2 = radians[3];
    var R = 6372.8; // km
    var dLat = lat2 - lat1;
    var dLon = lon2 - lon1;
    var a = Math.sin(dLat / 2) * Math.sin(dLat /2) + Math.sin(dLon / 2) * Math.sin(dLon /2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.asin(Math.sqrt(a));
    return R * c;
}

module.exports.getTotalDistance = function(pointsData){
    var distance = 0.0;
    var previousPoint = pointsData[0];
    for(var i = 1; i < pointsData.length; i++){
        var currentPoint = pointsData[i];
        distance += haversine(previousPoint.lat,previousPoint.lon, currentPoint.lat,currentPoint.lon);
        previousPoint = currentPoint; 
    }

    return distance;
};

var dataEmiter = new DataEmmiter();
module.exports.pointsData = [];
module.exports.emiter = function(){
    this.dataEmiter = new DataEmmiter();
    return this.dataEmiter;
};


module.exports.loadFile = function(filePath,emiter){
    gpxParser.getPointsData(filePath,function(data){
        this.pointsData = data;
        emiter.emit("data-loaded",data);
    });
};