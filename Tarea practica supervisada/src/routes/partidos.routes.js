const express = require('express');
const partidosControlador = require('../controllers/partidos.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/agregarPartido',md_autenticacion.Auth,partidosControlador.AgregarPartido);
//api.get('/equipos', equipoControlador.ObtenerEquipos);

//api.post('/registrarAdministrador', usuarioControlador.RegistrarAdministrador);
//api.post('/login', usuarioControlador.Login);
api.put('/editarPartido/:idPartidos',md_autenticacion.Auth, partidosControlador.EditarPartido);
//api.put('/agregarProductoCarrito', md_autenticacion.Auth, usuarioControlador.agregarProductoCarrito);
//api.put('/carritoAfactura/:idProducto', md_autenticacion.Auth, usuarioControlador.carritoAfactura);
//api.put('/editarRolUsuario/:idUsuario',[md_autenticacion.Auth,md_roles.verAdmin], usuarioControlador.editarRol);
//api.delete('/eliminarEquipo/:idEquipo',/* md_autenticacion.Auth, */equipoControlador.EliminarEquipo);
///api.get('/facturasUsuario/:idUsuario',[md_autenticacion.Auth,md_roles.verAdmin],usuarioControlador.ObtenerFacturasUsuario);
//api.get('/productosFactura/:idFactura',[md_autenticacion.Auth,md_roles.verAdmin],usuarioControlador.ObtenerProductosFacturas);


module.exports = api;