const Partidos = require('../models/partidos.models')
const Equipo = require('../models/equipo.models')
const Liga = require('../models/ligas.models')
const Jornadas = require('../models/jornadas.models')


function AgregarPartido(req, res) {
    var parametros = req.body;
    var partidoModelo = new Partidos();
    var maximoPartidos = 0;

    if (parametros.equipo1 && parametros.equipo2) {
        Jornadas.findById(parametros.jornada, (err, jornadaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Rrror en la peticion' });
            if (!jornadaEncontrada) return res.status(500).send({ mensaje: 'Error, no se encontró la jornada' });

            Equipo.findById(parametros.equipo1, { usuario: jornadaEncontrada.idUsuarios }, (err, equipo1Encontrado) => { /*IdUsuarios*/
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
                if (!equipo1Encontrado) return res.status(500).send({ mensaje: 'No se encontró este equipo' })

                Equipo.findById({ _id: parametros.equipo2, usuario: jornadaEncontrada.idUsuarios }, (err, equipo2Encontrado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
                    if (!equipo2Encontrado) return res.status(500).send({ mensaje: 'No se encontró este equipo' })
                    Liga.findById(equipo2Encontrado.idLigas, (err, ligaEncontrada) => {

                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
                        if (!ligaEncontrada) return res.status(500).send({ mensaje: 'No se encontro ninguna li' })

                        if (req.user.sub != ligaEncontrada.idUsuarios) return res.status(500).send({ mensaje: 'No se puede realizar' })

                        Equipo.find({ idLigas: ligaEncontrada._id }, (err, equiposEncontrados) => {
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })


                            if (equiposEncontrados.length % 2 == 0) {
                                maximoPartidos = equiposEncontrados.length / 2
                            } else {
                                maximoPartidos = (equiposEncontrados.length - 1) / 2
                            }

                            Partidos.findOne({ equipo1: parametros.equipo1, jornada: parametros.jornadaNo }, (err, partidosEncontrados1) => {
                                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
                                if (!partidosEncontrados1) {
                                    Partidos.findOne({ equipo2: parametros.equipo2, Jornada: parametros.jornadaNo }, (err, partidosEncontrados2) => {
                                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
                                        if (!partidosEncontrados2) {
                                            partidoModelo.equipo1 = parametros.equipo1;
                                            partidoModelo.resultadoEquipo1 = 0;
                                            partidoModelo.equipo2 = parametros.equipo2;
                                            partidoModelo.resultadoEquipo2 = 0;
                                            partidoModelo.jornada = parametros.jornada;
                                            partidoModelo.liga = jornadaEncontrada.idLigas;

                                            partidoModelo.save((err, partidoAgregado) => {
                                                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
                                                if (!partidoAgregado) return res.status(500).send({ mensaje: 'No se pudo agregar el partido' })

                                                return res.status(200).send({ partido: partidoAgregado })
                                            })
                                        } else {
                                            return res.status(500).send({ mensaje: 'El equipo 2 ya jugó en esta jornada' })
                                        }

                                    })

                                } else {
                                    return res.status(500).send({ mensaje: 'El equipo 1 ya jugó en esta jornada' })
                                }

                            })

                        })
                    })

                })
            })

        })

    } else {
        return res.status(500).send({ mensaje: 'No se llenaron los campos correspondientes' })
    }
}




function EditarPartido(req, res) {
    var parametros = req.body;
    var idPart = req.params.idPartidos;

    if (parametros.equipo1 && parametros.equipo2) {
        return res.status(500).send({ mensaje: 'Los equipos no pueden ser modificados' })
    } else {
        Partidos.findById(idPart, (err, partidoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
            if (!partidoEncontrado) return res.status(500).send({ mensaje: 'No se encontró el partido' })

            Liga.findById({ _id: partidoEncontrado.liga }, (err, ligaEncontrada) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })

                if (!ligaEncontrada) return res.status(500).send({ mensaje: 'no se encontro la liga del partido' })

                if (ligaEncontrada.idUsuarios != req.user.sub) return res.status(500).send({ mensaje: 'No le pertenece' })

                Partidos.findByIdAndUpdate({ _id: idPart }, parametros, { new: true }, (err, partidoActualizado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })

                    if (!partidoActualizado) return res.status(500).send({ mensaje: 'Error al actualizar partido' })


                    var puntos1;
                    var puntos2;

                    if (partidoActualizado.resultadoEquipo1 > partidoActualizado.resultadoEquipo2) {
                        puntos1 = 3;
                        puntos2 = 0;
                    } else if (partidoActualizado.resultadoEquipo1 < partidoActualizado.resultadoEquipo2) {
                        puntos1 = 0;
                        puntos2 = 3
                    } else {
                        puntos1 = 1;
                        puntos2 = 1;
                    }

                    actualizarDatos(puntos1, partidoActualizado.resultadoEquipo1, partidoActualizado.resultadoEquipo2, partidoActualizado.equipo1);
                    actualizarDatos(puntos2, partidoActualizado.resultadoEquipo2, partidoActualizado.resultadoEquipo1, partidoActualizado.equipo2)
                    return res.status(200).send({ partido: partidoActualizado })
                })
            })
        })
    }
}

function actualizarDatos(pts, golesF, golesC, idEquipo) {
    var diferenciaGoals;

    Equipo.findByIdAndUpdate({ _id: idEquipo }, { $inc: { golesFavor: golesF, golesContra: golesC, partidosJugados: 1, puntos: pts } }, { new: true }, (err, equipoActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })

        diferenciaGoals = equipoActualizado.golesFavor - equipoActualizado.golesContra

        Equipo.findByIdAndUpdate({ _id: idEquipo }, { $inc: { diferenciaGoles: diferenciaGoals } }, (err, equipoActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
            if (!equipoActualizado) return res.status(500).send({ mensaje: 'Error al agregar datos en equipo' })
        })
    })
}

module.exports = {
    AgregarPartido,
    EditarPartido
}