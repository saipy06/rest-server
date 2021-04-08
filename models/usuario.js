
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});



// se sobrescribe el metodo para mostrar solo los datos que quiero


UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario  } = this.toObject(); //se oculta __v, password y _id el resto se muestra igual
    usuario.uid = _id;
    return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema );
//Usuario es el nombre que le doy al modelo para exportar
