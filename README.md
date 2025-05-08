# TasksApp

- Project solution for Atom Challenge. It's using Angular 19, Typescript, Express, Firestore, Hosting and Firebase Cloud Functions.
- It has configured a github action to build and deploy the angular dist folder when there is a push to main branch.

### Deployed here
-> https://fir-tasks-app.web.app/

## API

The API is hosted in two different cloud functions, one for user authentication endpoints and the other for task crud operations.

Operations:
- Obtener la lista de todas las tareas.
- Agregar una nueva tarea.
- Actualizar los datos de una tarea existente.
- Eliminar una tarea existente.
- Busca el usuario si ha sido creado
- Agrega un nuevo usuario


## Development server

Use your firebase credentials to run this project, run:

```bash
firebase login
```

it might be necessary to run previously:

```bash
npm i -g firebase-tools
```

To start a local development server, run:

```bash
npm start
```

To run locally firebase emulators, move to functions folder and run:


```bash
npm ci
npm run build

```

Move back to root folder and run


```bash
npm run firebase:emulators
```