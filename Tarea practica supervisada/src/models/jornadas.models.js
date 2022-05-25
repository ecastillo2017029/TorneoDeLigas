const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JornadasSchema = Schema({
    jornadaNo: Number,
    idUsuarios: {type: Schema.Types.ObjectId, ref: 'Usuarios'},
    idLigas: {type: Schema.Types.ObjectId, ref: 'Ligas'}
});

module.exports = mongoose.model('Jornadas', JornadasSchema);