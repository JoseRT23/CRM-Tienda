import React, { useContext, useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faEye} from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import clienteAxios from '../../config/axios';
import Modal from 'react-bootstrap/Modal';
import './Product.css'

//Importar context
import { CRMContext } from './../../context/CRMContext'

const Product = ({ product }) => {

    let history = useHistory();

    //Utilizar valores del context
    const [ auth, guardarAuth ] = useContext(CRMContext);

    //Badge estado
    const [badge, setBadge] = useState(true);

    //Modal
    const [show, setShow] = useState(false);

    const deleteProduct = (idProduct) => {
        Swal.fire({
            title: 'Estas seguro?',
            text: "Un producto eliminado, no se puede eliminar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                //Eliminar de la API
                clienteAxios.delete(`/productos/${idProduct}`, {
                    headers: {
                        Authorization : `Bearer ${auth.token}`
                    }
                })
                .then(res => {
                    if (res.status === 200) {
                        Swal.fire(
                            'Eliminado!',
                            res.data.message,
                            'success'
                          )
                          window.location.reload()
                    }
                })
            }
          })
    }

    //Abrir y cerrar modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Verificar si el usuario esta autenticado o no
    if(!auth.auth && (localStorage.getItem('token') === auth.token)) history.push('/login');

    return (
        <>
          <tr>
            <td className='text-center'>{product.nombre}</td>
            <td className='text-center'>${product.precio}</td>
            <td className='text-center'>
                {!badge ? (<button onClick={() => setBadge(!badge)} className='badge badge-danger'>Inactivo</button>) : (<button onClick={() => setBadge(!badge)} className='badge badge-success'>Activo</button>)}   
            </td>
            <td>
                <div className='actionsContainer d-flex'>

                    <button className='btn btn-secondary' onClick={handleShow}>
                        Ver detalles <FontAwesomeIcon icon={faEye}/>
                    </button>

                    <Link className='btn btn-warning  mx-3' to={`edit-product/${product._id}`}>Editar <FontAwesomeIcon icon={faPenToSquare}/></Link>

                    <button className='btn btn-danger' onClick={() => deleteProduct(product._id)}>
                        Eliminar <FontAwesomeIcon icon={faTrashCan}/>
                    </button>

                </div>            
            </td>
          </tr>

                {/* Modal para detalles */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Detalle del producto</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='text-center'>
                            <h3>{product.nombre}</h3>               
                            {product.imagen ? (
                                <img loading='lazy' src={`http://localhost:5000/${product.imagen}`} alt={product.nombre}/>
                            ) : null}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-primary" onClick={handleClose}>
                            Cerrar
                        </button>
                    </Modal.Footer>
                </Modal>
                {/* Modal para detalles */}  
        </>
  ) 
}

export default Product