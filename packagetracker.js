/*   POSTE ITALIANE STATUS CODE TRACK*/
var request = require('sync-request');
var sleep = require('thread-sleep');
const notifier = require('node-notifier');
const path = require('path');

function getTrack(idtrack){
    var res = request('POST', 'https://www.poste.it/online/dovequando/DQ-REST/ricercasemplice', {
        json: {
            tipoRichiedente:'WEB',
            codiceSpedizione:idtrack,
            periodoRicerca:1
        }
    });
    var json_track = res.getBody('utf8');
    track = JSON.parse(json_track);
    return track;
}
function getStato(track){
    if(track){
        return parseInt(track.stato);
    }
}
function resolveStatusCode(code){
    console.log(code);
    switch(code){
        case 2: return "Presa in Carico";
        case 3: return "In Transito";
        case 4: return "In Consegna";
        case 5: return "Consegnato";
        default: return "Impossible to resolve Status Code";
    }
}
function checkValidity(track){
    var res = track.esitoRicerca;
    if(res == 3){
        return true;
    }
    return false;
}

function mynotify(message){
    notifier.notify(
        {
          title: "Poste Italiane Tracker Package",
          message: message,
          icon: path.join(__dirname, 'truck_icon.ico'), 
          sound: true
        });
}

function main(){
    var idtrack = process.argv[2];
    var track = getTrack(idtrack);
    if(!checkValidity(track)){
        console.log("Error, Invalid Code");
        return ;
    }
    var statuscode = getStato(track);
    while(statuscode!=5){
        sleep(10000); //update every 10 minute
        var code = getStato(getTrack(idtrack));
        if(code!=statuscode ){
            mynotify(resolveStatusCode(code));
            statuscode=code;
        } 
    }
    if (statuscode==5){
        mynotify(resolveStatusCode(statuscode));
    }
}

main();
