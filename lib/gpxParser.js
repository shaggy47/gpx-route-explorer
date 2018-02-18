var xml2Js = require('xml2js');
var fs = require('fs');
var xmlParser = new xml2Js.Parser({mergeAttrs:true,parseNumbers:true, trim:true,explicitArray:false});

module.exports.trackPoint = {
    lat:0.00,
    lon:0.00,
    elev:0.0,
    time:''
};

module.exports.trackPoints = [];
module.exports.getFirstPoint = function(){
    return trackPoints[0];
};

module.exports.getLastPoint=function(){
    var len = trackPoints.length;
    if(len > 0)
        return trackPoints[len-1];
    else 
        return 0;
};

module.exports.getPointsData=function(filePath, callback){
    var xmlData = fs.readFileSync(filePath,'utf-8');
    var pointsData =[]; 
    xmlParser.parseString(xmlData,function(err,data){
        // console.log(data.gpx.trk.trkseg.trkpt.length);
      for(var i = 0; i < data.gpx.trk.trkseg.trkpt.length; i++){
            var element = data.gpx.trk.trkseg.trkpt[i];
            pointsData.push({
                lat:element.lat,
                lon:element.lon,
                elev:element.ele,
                time: Date.parse(element.time)
            });
        } 
        callback(pointsData);      
    });

    return this.trackPoints;
};