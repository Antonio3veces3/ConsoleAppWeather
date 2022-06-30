import fs from 'fs';
import axios from 'axios';
class Searches {
    history = [];
    dbPath= './db/database.json';

    constructor(){
        //llamamos a this.readDB();
        this.readDB();
    }

    get paramsMapbox(){
        return {
            'limit': 5,
            'language': 'en',
            'access_token': process.env.MAPBOX_KEY
        };
    }

    get paramsWeather(){
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
        }
    }

    get capitalizedHistory(){
        return this.history.map( place => {
            let words = place.split(' ');
            words = words.map( word => word[0].toUpperCase() + word.substring(1));

            return words.join(' ');
        })
    }

    async cities( place = ''){
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapbox
            });

            const res = await instance.get();
            return res.data.features.map( place => ({
                id: place.id,
                name: place.place_name_en,
                lng: place.center[0],
                lat: place.center[1],
            }));
        } catch (error) {
            return [];
        }
    }

    async weather(lat, lon){
        try {

            const instance = axios.create({
                baseURL: "https://api.openweathermap.org/data/2.5/weather",
                params: {lat, lon, ...this.paramsWeather} //desestructura el getter
            })

            const res = await instance.get();
            const {weather, main} = res.data;
            return {
                temp: main.temp,
                min: main.temp_min,
                max: main.temp_max,
                desc: weather[0].description
            }

        } catch (error) {
            console.log('ERROR EN EL CLIMA'.red);
        }
    };

    addHistory(place = ''){
        if(this.history.includes(place.toLocaleLowerCase())){
            return;
        }
        this.history = this.history.splice(0,6);
        this.history.unshift(place.toLocaleLowerCase());

        this.saveDB();
    }

    saveDB(){
        const payload = {
            history: this.history
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    readDB(){
        //Verificar si existe la DB, si no, no hacemos nada
        if(!fs.existsSync(this.dbPath)) return;

        //Si existe, cargar info.
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);
        this.history = data.history;
    }

    deleteHistory(){
        this.history = [];
        const payload = {
            history: this.history
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    

}

export default Searches;