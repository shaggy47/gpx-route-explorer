const express = require("express");
const http = require("http");
const path = require("path");
const formidable = require("formidable");
const fs = require("fs");
const gpxParser = require("./lib/gpxParser");
const geoTrackHelper = require("./lib/geoTrackHelper");


var app = express();
app.set("views",path.resolve(__dirname,"views"));
app.set("view engine","ejs");

var staticPath = path.resolve(__dirname,"app");
app.use("/app",express.static(staticPath));

app.get("/",function(req,res){
    res.sendFile(path.resolve(__dirname,"explorer.html"));
});

app.post("/upload",function(req,res){
    console.log("file recieved");
    var form = new formidable.IncomingForm();
    form.parse(req);

    form.on("fileBegin",function(name,file){
        file.path = __dirname + "/tempFiles/"+file.name;
        console.log(file.path);
    });

    form.on("file",function(name,file){
        gpxParser.getPointsData(file.path,function(pointsData){
            var distance = geoTrackHelper.getTotalDistance(pointsData);
            res.render("results",{trackPoints:"Vaibhav",points:pointsData, totalDistance:distance});
        });
    });
});

app.get("/results",function(req,res){
    res.render("results",{name:"Vaibhav"});
});

var server = http.createServer(app).listen(3000,function(){
    console.log("server started");
    //cleanup upload folder on start.
    var directory = path.resolve(__dirname,'tempFiles');
    
    fs.readdir(directory, (err, files) => {
      if (err) throw err;
    
      for (const file of files) {
        fs.unlink(path.join(directory, file), err => {
          if (err) throw err;
        });
        console.log(file);
      }
    });
});

process.on("SIGINT",function(){
    console.log("Process killed");
    server.close();
});