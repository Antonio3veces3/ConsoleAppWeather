import 'dotenv/config';
import { inquirerMenu, listPlaces, pause, readInput, confirm } from "./helpers/inquirer.js";
import Searches from './models/searches.js';

const main = async() => {
    const searches = new Searches();
    let opt;
    do {
        //opcion del menu seleccionada
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //city to search
                const place_searched = await readInput('Type a city: '.bold);
                if(place_searched == ''){
                    console.log('The city name is required'.red);
                    continue;
                } 
                //places with the city name
                const places = await searches.cities(place_searched);
                
                //list places, create a new list menu
                const id = await listPlaces(places);
                if(id == '0') continue;
                //Obtain only the place selected
                const placeSelected = places.find( place => place.id === id);
                
                //Save on the DB.
                searches.addHistory(placeSelected.name);

                console.log('   Loading...'.italic.green);
                //Obtain only the weather
                const weather = await searches.weather(placeSelected.lat, placeSelected.lng);

                //Mostramos la informacion
                console.clear();
                console.log('---------------------------------'.blue);
                console.log(`Information about ${place_searched.bold}`.cyan);
                console.log('City: ', placeSelected.name.green);
                console.log('Lat: ', placeSelected.lat);
                console.log('Lng: ', placeSelected.lng);
                console.log('Temperature: ', weather.temp, "°C".yellow);
                console.log('Min: ', weather.min, "°C".yellow);
                console.log('Max: ', weather.max, "°C".yellow);
                console.log('Desc: ', weather.desc.green);
                break;
            case 2:
                searches.capitalizedHistory.forEach((place,index)=>{
                    const i = `${index+1}. `.green;
                    console.log(`${i} ${place}`);
                });

                const ok = await confirm('Do you want to delete the history? ');
                if(ok){
                    const sure = await confirm('Are you sure? '.green);
                    if(sure){
                        searches.deleteHistory();
                        console.log('Deleted succesfully!!!'.green);
                    }
                }
                break;
        }
        if(opt != 3) await pause();
    }while(opt != 3);

    console.clear();
};

main();