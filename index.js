const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs/promises');

const jsonPath = path.resolve('./file/tareas.json');
app.use(express.json());



app.get('/tareas', async (req, res) => {
  const jsonFile = await fs.readFile(jsonPath, 'utf-8');
  res.send(jsonFile);
});


app.post('/tareas', async (req, res) => {
  const tarea = req.body;
  // obtener el arreglo directo desde el json file
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));

  // agregar al usuario en el arreglo

  // generar un nuevo id
  const lastIndex = tasksArray.length - 1;
  const newId = tasksArray[lastIndex].id + 1;
  tasksArray.push({ ...tarea, id: newId });
  // escribir la informacion en json
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));

  console.log(tasksArray);
  res.end();
});

// por el body enviaremos la tarea a actualizar

app.put('/tareas', async (req, res) => {
  // obtener el arreglo desde el json file
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
  const { title, description, status, id } = req.body;
  // buscar el id del usuario dentro del arreglo
  const taskIndex = tasksArray.findIndex(tarea => tarea.id === id);


  if (taskIndex >= 0) {
    tasksArray[taskIndex].title = title;
    tasksArray[taskIndex].description = description;
    tasksArray[taskIndex].status = status;
    tasksArray[taskIndex].id = id;
  };
  // escribir nuevamente el arreglo en el archivo
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));

  console.log(tasksArray);
  res.send('tarea actualizada');
});

app.delete('/tareas',async (req,res)=> {
  //obtener el arreglo
  const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
  //encontrar la tarea a ser eliminada mediante el id
  const {id } = req.body;
  const taskIndex = tasksArray.findIndex(tarea => tarea.id === id);
  // se elimina del arreglo
  tasksArray.splice(taskIndex, 1);

  // se escribe en el json nuevamente
  await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
  res.end();
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`ervidor escuchando en el puerto ${PORT}`)
});