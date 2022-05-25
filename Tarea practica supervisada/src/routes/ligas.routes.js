const express = require('express');
const ligasControlador = require('../controllers/ligas.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/agregarLiga',md_autenticacion.Auth, ligasControlador.AgregarLiga);
api.get('/ligas', ligasControlador.ObtenerLigas);
api.get('/tabla/:idLiga', ligasControlador.tabla);


api.put('/editarLiga/:idLigas', md_autenticacion.Auth, ligasControlador.EditarLiga);

api.delete('/eliminarLiga/:idLigas', md_autenticacion.Auth, ligasControlador.EliminarLiga);



module.exports = api;