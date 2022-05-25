
const Ligas = require('../models/ligas.models');
const Equipos = require('../models/equipo.models');
const PDF = require('pdfkit');
const fs = require('fs');

const bcrypt = require('bcrypt-nodejs');


function AgregarLiga(req, res) {
    ;
    var parametros = req.body;
    var ligasModelo = new Ligas();

    if (parametros.nombreLiga) {
        ligasModelo.nombreLiga = parametros.nombreLiga;
        ligasModelo.idUsuarios = req.user.sub;

        ligasModelo.save((err, ligaGuardada) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!ligaGuardada) return res.status(404).send({ mensaje: "Error, no se agrego ningun equipo" });

            return res.status(200).send({ liga: ligaGuardada });
        })
    }
}



function ObtenerLigas(req, res) {
    Ligas.find((err, ligasObtenidas) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        for (let i = 0; i < ligasObtenidas.length; i++) {
            console.log(ligasObtenidas[i].nombreLiga)
        }

        return res.send({ equipos: ligasObtenidas })

    })
}


function tabla(req, res) {
    var idLiga = req.params.idLigas;
    var parametros = req.body;

    Ligas.findOne(idLiga, (err, ligaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!ligaEncontrada) return res.status(404).send({ mensaje: 'Error al obtener los datos1' });

        Equipos.find(parametros.idLigas, (err, equiposEncontrados) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!equiposEncontrados) return res.status(404).send({ mensaje: 'Error al obtener los datos' });

            return res.status(200).send({ liga: ligaEncontrada, equipos: equiposEncontrados })
        })
    })
}

function EditarLiga(req, res) {
    var idLiga = req.params.idLigas;
    var parametros = req.body;

    if (req.user.rol !== "Administrador") {
        Ligas.findOneAndUpdate({ _id: idLiga, idUsuarios: req.user.sub }, { nombreLiga: parametros.nombreLiga }, { new: true }, (err, ligaActualizada) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!ligaActualizada) return res.status(500).send({ mensaje: "Unicamente el Administrador puede editar ligas de todos los usuarios" })

            return res.status(200).send({ liga: ligaActualizada })
        })
    } else {
        Ligas.findByIdAndUpdate(idLiga, parametros, { new: true }, (err, ligaActualizada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!ligaActualizada) return res.status(404).send({ mensaje: 'Error al Editar la Liga' });

            return res.status(200).send({ liga: ligaActualizada });
        });
    }
}

function EliminarLiga(req, res) {
    var idLiga = req.params.idLigas;

    if (req.user.rol !== "Administrador") {
        Ligas.findOneAndDelete({ _id: idLiga, idUsuarios: req.user.sub }, (err, ligaEliminada) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!ligaEliminada) return res.status(500).send({ mensaje: "Unicamente el Administrador puede eliminar ligas de otro usuario" })

            return res.status(200).send({ liga: ligaEliminada })
        })
    } else {
        Ligas.findByIdAndDelete(idLiga, (err, ligaEliminada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!ligaEliminada) return res.status(404).send({ mensaje: 'Error al eliminar la Liga' });

            return res.status(200).send({ liga: ligaEliminada });
        })
    }
}
function EjemploParametroRuta(req, res) {
    var id = req.params.idKinal;

    res.send("Hola Mundo, el id obtenido es: " + id);
}

function EjemploParametroRutaOpcional(req, res) {
    var idOp = req.params.idOpcional;

    if (idOp) {
        res.send("Hola Mundo, el id Opcional obtenido es: " + idOp);
    } else {
        res.send("El correo del Usuario es: " + req.user.email)
    }
}

module.exports = {
    ObtenerLigas,
    EjemploParametroRuta,
    EjemploParametroRutaOpcional,
    AgregarLiga,
    EditarLiga,
    EliminarLiga,
    tabla,
}