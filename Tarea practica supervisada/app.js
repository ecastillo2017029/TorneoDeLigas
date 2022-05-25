const express = require('express');
const cors = require('cors');
var app = express();


const UsuarioRutas = require('./src/routes/usuario.routes');
const EquipoRutas =require('./src/routes/equipo.routes');
const PartidosRutas =require('./src/routes/partidos.routes');
const JornadasRutas =require('./src/routes/jornadas.routes');
const LigasRutas =require('./src/routes/ligas.routes');



app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(cors());

// CARGA DE RUTAS localhost:3000/api/obtenerProductos
app.use('/api', EquipoRutas, UsuarioRutas,PartidosRutas,JornadasRutas,LigasRutas);


module.exports = app;s