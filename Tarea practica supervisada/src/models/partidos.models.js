const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PartidosSchema = Schema({
    equipo1: {type: Schema.Types.ObjectId, ref: 'Equipo'},
    equipo2: {type: Schema.Types.ObjectId, ref: 'Equipo'},
    resultadoEquipo1: Number,
    resultadoEquipo2: Number,
    jornada: {type: Schema.Types.ObjectId, ref: 'Jornadas'},
    liga: {type: Schema.Types.ObjectId, ref: 'Ligas'}
});

module.exports = mongoose.model('Partidos', PartidosSchema);