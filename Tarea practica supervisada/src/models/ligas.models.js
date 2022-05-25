const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LigasSchema = Schema({
    nombreLiga: String,
    
    idUsuarios: {type: Schema.Types.ObjectId, ref: 'Usuarios'}
});

module.exports = mongoose.model('Ligas', LigasSchema);