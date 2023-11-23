import inquirer from 'inquirer';

inquirer.prompt([
    {
        type: 'input',
        name: 'someSetting',
        message: '¿Cuál es la configuración X para tu proyecto?'
    }
    // más preguntas según sea necesario
]).then(answers => {
    console.log('Respuesta: '+ JSON.stringify(answers))
    // Procesa las respuestas
});