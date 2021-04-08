
const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const { crearArticulo,
        obtenerArticulos,
        obtenerArticulo,
        actualizarArticulo, 
        borrarArticulo } = require('../controllers/articulos');


//ToDo: Cargar en helpers

const { existeCategoriaPorId, existeArticuloPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', obtenerArticulos );

// Obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeArticuloPorId ),
    validarCampos,
], obtenerArticulo );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearArticulo );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    // check('categoria','No es un id de Mongo').isMongoId(),
    check('id').custom( existeArticuloPorId ),
    validarCampos
], actualizarArticulo );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeArticuloPorId ),
    validarCampos,
], borrarArticulo);


module.exports = router;