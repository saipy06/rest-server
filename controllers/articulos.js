const { response } = require('express');
const { Articulo } = require('../models');


const obtenerArticulo = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, articulos ] = await Promise.all([
        Articulo.countDocuments(query),
        Articulo.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip( Number( desde ) )
            .limit(Number( limite ))
    ]);

    res.json({
        total,
        articulos
    });
}

const obtenerArticulos = async(req, res = response ) => {

    const { id } = req.params;
    const producto = await Articulo.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json( producto );

}

const crearArticulo = async(req, res = response ) => {

    const { estado, usuario, ...body } = req.body;

    const articuloDB = await Articulo.findOne({ nombre: body.nombre });

    if ( articuloDB ) {
        return res.status(400).json({
            msg: `El Articulo ${ articuloDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const articulo = new Articulo( data );

    // Guardar DB
    await articulo.save();

    res.status(201).json(articulo);

}

const actualizarArticulo = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ) {
        data.nombre  = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const articulo = await Articulo.findByIdAndUpdate(id, data, { new: true });

    res.json( articulo );

}

const borrarArticulo = async(req, res = response ) => {

    const { id } = req.params;
    const articuloBorrado = await Articulo.findByIdAndUpdate( id, { estado: false }, {new: true });

    res.json( articuloBorrado );
}




module.exports = {
    crearArticulo,
    obtenerArticulos,
    obtenerArticulo,
    actualizarArticulo,
    borrarArticulo
}