
const Jornadas = require('../models/jornadas.models');

const bcrypt = require('bcrypt-nodejs');

function AgregarJornada (req, res){
  
    var parametros = req.body;
    var jornadasModelo = new Jornadas();

    if( parametros.jornadaNo) {
        jornadasModelo.jornadaNo = parametros.jornadaNo;
        jornadasModelo.idUsuarios = parametros.idUsuarios;
        jornadasModelo.idLigas = parametros.idLigas;
        
        jornadasModelo.save((err, jornadaGuardada) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!jornadaGuardada) return res.status(404).send( { mensaje: "Error, no se agrego ninguna jornada"});

            return res.status(200).send({ jornada: jornadaGuardada });
        })
    }  else {
        return res.status(500).send({ mensaje: "debe llenar todos los campos necesarios" })
    }
}


module.exports = {
    AgregarJornada
}
    