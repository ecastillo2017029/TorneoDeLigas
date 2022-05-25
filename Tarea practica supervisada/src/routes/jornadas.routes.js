const express = require('express');
const jornadasControlador = require('../controllers/jornadas.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/agregarJornada',jornadasControlador.AgregarJornada);
api.get('/equipos', equipoControlador.ObtenerEquipos);


api.put('/editarEquipo/:idEquipo', md_autenticacion.Auth, equipoControlador.EditarEquipo);

api.put('/editarRolUsuario/:idUsuario',[md_autenticacion.Auth,md_roles.verAdmin], usuarioControlador.editarRol);
api.delete('/eliminarEquipo/:idEquipo',/* md_autenticacion.Auth, */equipoControlador.EliminarEquipo);



module.exports = api;