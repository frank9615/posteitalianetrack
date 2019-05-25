/*   POSTE ITALIANE STATUS CODE TRACK*/

const request = require('request')

function getTrack(code){
    request.post(' https://www.poste.it/online/dovequando/DQ-REST/ricercasemplice', {
    json: {
        tipoRichiedente:'WEB',
        codiceSpedizione:code,
        periodoRicerca:1
    }
    }, (error, res, body) => {
        var json_track = JSON.stringify(body);
        track = JSON.parse(json_track);
        console.log(resolveStatusCode(track.stato));
    });
}

function resolveStatusCode(code){
    switch(parseInt(code)){
        case 2: return "Presa in Carico";
        case 3: return "In Transito";
        case 4: return "In Consegna";
        case 5: return "Consegnato";
        default: return "Impossible to resolve Status Code";
    }
}

