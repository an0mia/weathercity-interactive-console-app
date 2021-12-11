require('dotenv').config();
require('colors');

const { inquirerMenu, pausa, leerInput, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async() => {

    const busquedas = new Busquedas;
    let opt;
 
    do {

        //imprimir menú
        opt = await inquirerMenu();
        
        switch (opt) {
            
            case 1: //buscar lugar
                //mostrar mensaje input
                const termino = await leerInput('Ciudad:');
                
                //buscar lugar
                const lugares = await busquedas.lugar( termino );
                
                //seleccionar lugar
                const id = await listarLugares(lugares);
                if ( id === '0' ) continue;

                //guardar data
                const lugarSel = lugares.find( l => l.id === id );
                
                busquedas.agregarHistorial( lugarSel.name );
                
                //clima
                const clima = await busquedas.climaLugar( lugarSel.lat, lugarSel.lon )
                //console.log( clima );

                //mostrar resultados
                console.log('\nInformación\n'.green);
                console.log('Ciudad:', lugarSel.name.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Lon:', lugarSel.lon);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Como está el clima:', clima.desc.green);
            break;

            case 2: //historial
            
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const index = `${ i + 1 }`.green;
                    console.log( `${ index } ${ lugar }` );    
                });       
                
            break;

            case 3: //
                console.log('opt=' + opt);
            break;
        }

        if (opt !== 0) await pausa();

    } while (opt !== 0);

}

main()

