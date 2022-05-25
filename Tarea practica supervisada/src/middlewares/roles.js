exports.verAdmin = function(req, res, next){
    if(req.user.rol !== "Administrador") return res.status(403).send({mensaje: "Solo puede hacerlo el Administrador"})

    next();
}

exports.verUsuario = function(req, res, next){
    if(req.user.rol !== "Usuario") return res.status(403).send({mensaje: "Solo puede hacerlo el Usuario"})

    next();
}