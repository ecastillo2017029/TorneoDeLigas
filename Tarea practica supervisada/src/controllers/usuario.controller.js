import Usuario, { find, findOne, findByIdAndUpdate, findById, findByIdAndDelete } from '../models/usuario.model';
import PDF from 'pdfkit';
import fs from 'fs';  

import { hash, compare } from 'bcrypt-nodejs';
import { crearToken } from '../services/jwt';

function Registrar(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuario();

    if(parametros.nombre && parametros.apellido && 
        parametros.email && parametros.password ) {
            usuarioModel.nombre = parametros.nombre;
            usuarioModel.apellido = parametros.apellido;
            usuarioModel.email = parametros.email;
            usuarioModel.rol = "Usuario";

            find({ email : parametros.email }, (err, usuarioEncontrado) => {
                if ( usuarioEncontrado.length == 0 ) {

                    hash(parametros.password, null, null, (err, passwordEncriptada) => {
                        usuarioModel.password = passwordEncriptada;

                        usuarioModel.save((err, usuarioGuardado) => {
                            if (err) return res.status(500)
                                .send({ mensaje: 'Error en la peticion' });
                            if(!usuarioGuardado) return res.status(500)
                                .send({ mensaje: 'Error al agregar el Usuario'});
                            
                            return res.status(200).send({ usuario: usuarioGuardado });
                        });
                    });                    
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
                }
            })
    }
}

function RegistrarAdministrador(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuario();

            usuarioModel.nombre = 'ADMIN';
            usuarioModel.email = 'admin@gmail.com';
            usuarioModel.rol = 'Administrador';

            find({ nombre : 'ADMIN' }, (err, usuarioEncontrado) => {
                if ( usuarioEncontrado.length == 0 ) {

                    hash('123456', null, null, (err, passwordEncriptada) => {
                        usuarioModel.password = passwordEncriptada;

                        usuarioModel.save((err, usuarioGuardado) => {
                            if (err) return res.status(500)
                                .send({ mensaje: 'Error en la peticion' });
                            if(!usuarioGuardado) return res.status(500)
                                .send({ mensaje: 'Error al agregar el Usuario'});
                            
                            return res.status(200).send({ usuario: usuarioGuardado });
                        });
                    });                    
                } else {
                    return res.status(500)
                        .send({ mensaje: 'Este nombre de usuario, ya se encuentra utilizado' });
                }
            })
    
}

function Login(req, res) {
    var parametros = req.body;
    const usuarioId = req.params.idUsuario;

    findOne({ nombre : parametros.nombre }, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(usuarioEncontrado){
            compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword)=>{
                    if ( verificacionPassword ) {
                        if(parametros.obtenerToken === 'true'){
                            return res.status(200)
                                .send({ token: crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return  res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }

                        
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide'});
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra registrado.'})
        }
    
    })
    /*Factura.find({idUsuario:usuarioId}, (err, facturaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!facturaEncontrada) return res.status(404).send( { mensaje: 'Error al obtener los datos' });
        return res.status(200).send({ facturas: facturaEncontrada });
    })*/
      
}
function editarRol(req, res) {
    const usuarioId = req.params.idUsuario;
    const rolUsuario = req.params.rol;
    const parametros = req.body;

    findByIdAndUpdate(usuarioId, { rol: parametros.rol } , { new: true },
    (err, usuarioModificado) => {
        if(req.user.rol == "Administrador") return res.status(400)
        .send({mensaje:'No se puede modificar al Administrador'})

            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!usuarioModificado) return res.status(500).send({ mensaje: 'Error al editar el rol del Usuario'});
}
    )



function EditarUsuario(req, res) {
    var idUser = req.params.idUsuario
    var parametros = req.body;

    if (req.user.rol == "Cliente") {
        if (idUser !== req.user.sub) {
            return res.status(500).send({ mensaje: "No puede editar a otros Usuarios." })
        } else {
            if (parametros.rol) {
                return res.status(500).send({ mensaje: "Un cliente no puede modificar su rol." })
            } else {
                findByIdAndUpdate(req.user.sub, parametros, { new: true }, (err, usuarioActualizado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
                    if (!usuarioActualizado) return res.status(500).send({ mensaje: 'Error al editar el Usuario' })
                    return res.status(200).send({ usuario: usuarioActualizado })
                })
            }
        }

    } else {

        findById(idUser, (err, usuarioEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!usuarioEncontrado) return res.status(500).send({ mensaje: "No se encontro el Usuario" })

            if (usuarioEncontrado.rol !== "Administrador") {
                findByIdAndUpdate(idUser, parametros, { new: true }, (err, usuarioModificado) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
                    if (!usuarioModificado) return res.status(500).send({ mensaje: "Error al Actualizar el Usuario" })

                    return res.status(200).send({ usuario: usuarioModificado })
                })
            } else {
                if(idUser == req.user.sub){
                    if (parametros.rol) {
                        return res.status(500).send({ mensaje: "No puede modificar su rol" })
                    } else {
                        findByIdAndUpdate(req.user.sub, parametros, { new: true }, (err, usuarioActualizado) => {
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
                            if (!usuarioActualizado) return res.status(500).send({ mensaje: 'Error al editar el usuario' })
                            return res.status(200).send({ usuario: usuarioActualizado })
                        })
                    }

                }else{
                    return res.status(500).send({ mensaje: "No se puede editar un usuario Administrador"})
                }
            }
        })

    } 
}



function EliminarUsuario(req, res) {
    var idUser = req.params.idUsuario

    if (req.user.rol !== "Administrador") {
        if (idUser != req.user.sub) {
            return res.status(500).send({ mensaje: "No puede Eliminar a otros Usuarios." })
        } else {
           
                findByIdAndDelete(req.user.sub, { new: true }, (err, usuarioActualizado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
                    if (!usuarioActualizado) return res.status(500).send({ mensaje: 'Error al eliminar el Usuario' })
                    return res.status(200).send({ usuario: usuarioActualizado })
                })
            
        }

    } else {

        findById(idUser, (err, usuarioEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!usuarioEncontrado) return res.status(500).send({ mensaje: "No se encontro el Usuario" })

            if (usuarioEncontrado.rol !== "Administrador") {
                findByIdAndDelete(idUser, { new: true }, (err, usuarioModificado) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
                    if (!usuarioModificado) return res.status(500).send({ mensaje: "Error al Eliminar el Usuario" })

                    return res.status(200).send({ usuario: usuarioModificado })
                })
            } else {
                
                    return res.status(500).send({ mensaje: "No se puede eliminar a un usuario Administrador"})
                
            }
        })

    } 
}
}


module.exports = {
    Registrar,
    Login,
    EditarUsuario,
    RegistrarAdministrador,
    EliminarUsuario,
}