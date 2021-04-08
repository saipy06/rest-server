const { Schema, model } = require('mongoose');

const ArticuloSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    promocion: {
        type: Boolean,
        default: false,
        required: true
    },
    ranking:{type:Number},
    codigo:{type:Number},
    descripcion: { type: String },
    disponible: { type: Boolean, defult: true },
    img: { type: String },
});


ArticuloSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Articulo', ArticuloSchema );
