import inquirer from 'inquirer';
import colors from 'colors';

const menuOpt = [
    {
        type: 'list',
        name: 'options',
        loop: false,
        message: 'What do you want to do?',
        choices: [
            {
                value: 1,
                name: `${'    1.- '.green} Search city`
            },
            {
                value: 2,
                name: `${'    2.- '.green} History`
            },
            {
                value: 3,
                name: `${'    3.- '.green} Exit`
            }
        ]

    }
];


const inquirerMenu = async () => {
    console.clear();
    console.log('============================'.green);
    console.log('   Weather application'.white);
    console.log('============================\n'.green);

    const { options } = await inquirer.prompt(menuOpt);
    return options;
};

const pause = async () => {
    const pauseOpt = [
        {
            type: 'input',
            name: 'enter',
            message: `Type ${'ENTER'.green} to continue...`
        }
    ];
    console.log('\n');
    await inquirer.prompt(pauseOpt);
};

const readInput = async (message) => {
    const question = [
        {
            type: 'input',
            name: 'description',
            message: message,
            /*validate(value) {
                if (value.length === 0) {
                    return ' Campo requerido'.red;
                }
                return true;
            }*/
        }
    ];

    const { description } = await inquirer.prompt(question);
    return description;
};

const listPlaces = async (places = []) => {
    const choices = places.map( (place, i) => {
        const index = `${i+1}. `.green;
        return {
            value: place.id,
            name: `${index} ${place.name}`
        }
    });

    choices.unshift({
      value: '0',
      name: `${'0. '.green} Cancelar.`  
    })
    const questions = [{
        type: 'list',
        name: 'id',
        loop: false,
        message: 'SELECT a place...'.magenta,
        choices
    }];
    const {id} = await inquirer.prompt(questions);
    return id;
};

const confirm = async(message) => {
    console.log('');
    const question = [{
        type: 'confirm',
        name: 'ok',
        message
    }];

    const {ok} = await inquirer.prompt(question);
    return ok;
};

const listadoTareasCheckList = async (tareas = []) => {
    const choices = tareas.map( (tarea, i) => {
        const index = `${i+1}. `.green;
        return {
            value: tarea.id,
            name: `     ${index} ${tarea.description}`,
            loop: false,
            checked: (tarea.completedAt)?true:false
        }
    });
    choices.unshift(new inquirer.Separator('-----------------'));

    const questions = [{
        type: 'checkbox',
        name: 'ids',
        message: 'Select options...'.red,
        choices
    }];
    const {ids} = await inquirer.prompt(questions);
    return ids;
};


export {
    inquirerMenu,
    pause,
    readInput,
    listPlaces,
    confirm,
    listadoTareasCheckList
};