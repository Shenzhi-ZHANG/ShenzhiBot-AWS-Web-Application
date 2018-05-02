var csv = require("csvtojson");
var fs = require('fs');

var stream = fs.createWriteStream("prediction.json", {flags:'a'});

// Convert a csv file with csvtojson
csv()
    .fromFile('ML_output.csv')
    .on("end_parsed",function(jsonArrayObj){ //when parse finished, result will be emitted here.
        stream.write(JSON.stringify(jsonArrayObj, null, 2));
    })