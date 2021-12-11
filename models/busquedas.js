const fs = require('fs');

const axios = require('axios');

class Busquedas {


    historial = [];
    dataPath = './data/data.json';

    constructor(){
        //leer data.json
        this.leerData();
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'types': 'place',
            'language': 'es'
        }
    }

    get paramsOpenWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    get historialCapitalizado() {

        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) )

            return palabras.join(' ');

        });
    }

    async climaLugar(lat, lon) {
        try {
            //peticion http
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsOpenWeather, lat, lon }
            });

            const req = await instance.get();
            const { weather, main } = req.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }


        } catch (error) {
            
        }
    }

    async lugar( place = '' ) {

        try {
            //peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ place }.json`,
                params: this.paramsMapbox

            });

            const req = await instance.get();
            //console.log( req.data.features );
            return req.data.features.map( lugar => ({
                id: lugar.id,
                name: lugar.place_name,
                lon: lugar.center[0],
                lat: lugar.center[1]
            }));

        } catch (error) {
            return []; //retornar empty
        }
        
    }

    agregarHistorial( lugar = '') {
        //TODO: prevenir duplicados
        if ( this.historial.includes( lugar.toLocaleLowerCase() )) {
            return;
        }

        this.historial = this.historial.splice( 0, 5 );

        this.historial.unshift( lugar.toLocaleLowerCase( this.dbPath, JSON ) );

        this.guardarData();
    }


    guardarData() {
        
        const payload = {
            historial: this.historial
        };

        try {
            fs.writeFileSync( this.dataPath, JSON.stringify( payload ));
        } catch (error) {
            console.log(error);
        } 
        
    }

    leerData() {

        if ( !fs.existsSync( this.dataPath ) ) return;

        try {

            const info = fs.readFileSync( this.dataPath, {encoding: 'utf-8'});
            const data = JSON.parse( info );
            this.historial = data.historial;
            
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Busquedas;