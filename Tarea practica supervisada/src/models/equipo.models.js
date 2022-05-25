const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EquipoSchema = Schema({
    nombreEquipo: String,
    puntos: Number,
    golesFavor: Number,
    golesContra: Number,
    diferenciaGoles: Number,
    partidosJugados: Number,
    idUsuarios: {type: Schema.Types.ObjectId, ref: 'Usuarios'},
    idLigas: {type: Schema.Types.ObjectId, ref: 'Ligas'}
});

module.exports = mongoose.model('Equipo', EquipoSchema);