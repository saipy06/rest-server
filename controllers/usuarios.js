const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario'); // se crea Usauario en base al modelo



const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }; // es una condicion para indicar que solo los activos.. y no los borrados logicos

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),     // se aplica a los dos la condicionsd
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {
    
    const { nombre, correo, password, rol } = req.body;

/*  tambien podr'ia desestructurar con resto
    const { google, ...resto} = req.body;
*/

    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}

const  usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body; // voy a indicar lo que no quiero que se actualice

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    
    res.json(usuario);
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}