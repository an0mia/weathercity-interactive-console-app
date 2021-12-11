require('colors');
const inquirer = require('inquirer');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
            value: 1,
            name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'X.'.red} Salir`
            }
        ]
    }
]

const inquirerMenu = async() => {
    console.clear();

    console.clear();
    console.log('============================='.green);
    console.log('   Seleccione una opción'.bold);
    console.log('=============================\n'.green);

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;
}

const pausa = async() => {

    const q = [

        {
            type: 'input',
            name: 'enter',
            message: `Presione ${"ENTER".green} para continuar`
        }

    ];

    console.log('\n');
    await inquirer.prompt(q);
}

const leerInput = async (message) => {
    
    const question = [
        {
            type: 'input',
            name: 'descripcion',
            message,
            validate (value){
                if(value.length === 0) {
                    return 'Debe ingresar un valor';
                }
                return true;
            }
        }
    ];

    const { descripcion } = await inquirer.prompt(question);
    
    return descripcion;
}

const listarLugares = async( lugares = [] ) => {
    const choices = lugares.map( (lugar, i) => {

        const index = `${i +1}.`.green;

        return {
            value: lugar.id,
            name: `${index} ${lugar.name}`,
        }
    });

    choices.unshift({
        value: '0',
        name: 'x.'.red + ' Cancelar'
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]

    const { id } = await inquirer.prompt(preguntas);
    return id;
    
}

const confirmar = async(message) => {

    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const { ok } = await inquirer.prompt(question);
    return ok;
}

const mostarListadoCheckList = async( tareas = [] ) => {
    const choices = tareas.map( (tarea, i) => {

        const index = `${i +1}.`.green;

        return {
            value: tarea.id,
            name: `${index} ${tarea.descripcion}`,
            checked: (tarea.completado) ? true : false
        }
    });

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices
        }
    ]

    const { ids } = await inquirer.prompt(pregunta);
    return ids;
    
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostarListadoCheckList
}
