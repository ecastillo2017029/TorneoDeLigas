
const Equipo = require('../models/equipo.models');
const bcrypt = require('bcrypt-nodejs');
const { param } = require('express/lib/request');


function AgregarEquipo (req, res){
    
    var parametros = req.body;
    var equipoModelo = new Equipo();

    if( parametros.nombreEquipo) {
        equipoModelo.nombreEquipo = parametros.nombreEquipo;
        equipoModelo.puntos = 0;
        equipoModelo.golesFavor = 0;
        equipoModelo.golesContra = 0;
        equipoModelo.difenreciaGoles = 0;
        equipoModelo.partidosJugados = 0;
        equipoModelo.idUsuarios = req.user.sub;
        equipoModelo.idLigas = parametros.idLigas;
        
        Equipo.find((err, equiposObtenidos) => {
            if (err) return res.send({ mensaje: "Error: " + err })

        if(equiposObtenidos.length < 3){
        equipoModelo.save((err, equipoGuardado) => {
           
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!equipoGuardado) return res.status(404).send( { mensaje: "Error, no se agrego ningun equipo"});
        
        
            return res.status(200).send({ equipo: equipoGuardado });
       
        })
    }else{
        res.status(500).send( { mensaje: "Ya agrego más de 3 equipos"});
   }
})
    }

}



function ObtenerEquipos (req, res) {
    Equipo.find((err, equiposObtenidos) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        for (let i = 0; i < equiposObtenidos.length; i++) {
            console.log(equiposObtenidos[i].nombreEquipo)
        }

        return res.send({ equipos: equiposObtenidos })
        
    })
}
function EditarEquipo(req, res) {
    var idEqui = req.params.idEquipo;
    var parametros = req.body;

    if (req.user.rol !== "Administrador") {
        Equipo.findOneAndUpdate({ _id: idEqui, idUsuarios: req.user.sub }, 
        { nombreEquipo: parametros.nombreEquipo, puntos: parametros.puntos, 
        golesFavor: parametros.golesFavor,golesContra: parametros.golesContra,
        diferenciaGoles: parametros.diferenciaGoles,partidosJugados: parametros.partidosJugados,
        idUsuarios:parametros.idUsuarios,idLigas:parametros.idLigas }, { new: true }, (err, equipoActualizado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!equipoActualizado) return res.status(500).send({ mensaje: "Unicamente el Administrador puede editar empleados de otra empresa" })

            return res.status(200).send({ equipo: equipoActualizado })
        })
    } else {
        Equipo.findByIdAndUpdate(idEqui, parametros, { new: true } ,(err, equipoActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!equipoActualizado) return res.status(404).send( { mensaje: 'Error al Editar el Equipo'});
    
            return res.status(200).send({ equipo: equipoActualizado});
        });
    }
}

function EliminarEquipo(req, res) {
    var idEqui = req.params.idEquipo;
    var parametros = req.body;

    if (req.user.rol !== "Administrador") {
        Equipo.findOneAndDelete({ _id: idEqui, idUsuarios: req.user.sub }, (err, equipoEliminado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!equipoEliminado) return res.status(500).send({ mensaje: "Unicamente el Administrador puede eliminar equipos de otros usuarios" })

            return res.status(200).send({ equipo: equipoEliminado })
        })
    } else {
        Equipo.findByIdAndDelete(idEqui, (err, equipoEliminado) => {
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
            if(!equipoEliminado) return res.status(404).send( { mensaje: 'Error al eliminar el Equipo'});
    
            return res.status(200).send({ equipo: equipoEliminado});
        })
    }
}


function verEquipoLiga(req, res) {
    var idLiga = req.params.idLigas;

    Equipo.find( { liga : { $regex: idLiga, $options: 'i' } }, (err, equipoLigaEncontrado) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!equipoLigaEncontrado) return res.status(404).send({ mensaje: "Error, no se encontraron productos" });

        return res.status(200).send({ equipos: equipoLigaEncontrado });
    })
}



function EjemploParametroRuta (req, res) {
    var id = req.params.idKinal;

    res.send("Hola Mundo, el id obtenido es: " + id);
}


function EjemploParametroRutaOpcional (req, res) {
    var idOp = req.params.idOpcional;

    if(idOp) {
        res.send("Hola Mundo, el id Opcional obtenido es: " + idOp);
    } else {
        res.send("El correo del Usuario es: " + req.user.email)
    }    
}
module.exports = {
    ObtenerEquipos,
    EjemploParametroRuta,
    EjemploParametroRutaOpcional,
    AgregarEquipo,
    EditarEquipo,
    EliminarEquipo,
    verEquipoLiga
}