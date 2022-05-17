import React, { useContext, useState } from 'react'

import Swal from 'sweetalert2'
import clienteAxios from '../../config/axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faEye} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

//Importar context
import { CRMContext } from './../../context/CRMContext'

const DetailsOrder = ({ order }) => {
console.log(order)
  let history = useHistory();

  //Utilizar valores del context
  const [ auth, guardarAuth ] = useContext(CRMContext);

  //Badge estado
  const [badge, setBadge] = useState(true);

  //Modal
  const [show, setShow] = useState(false);

  const {cliente} = order;
  
  const deleteOrder = (idOrder) => {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Un pedido eliminado no se puede recuperar!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (result.isConfirmed) {
          //llamado a axios
          clienteAxios.delete(`/pedidos/${idOrder}` , {
            headers: {
              Authorization : `Bearer ${auth.token}`
          }
          })
          .then(res => {
              Swal.fire(
                  'Eliminado!',
                  res.data.message,
                  'success'
                )
                window.location.reload();
          })
      }
    })
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



      //Verificar si el usuario esta autenticado o no
      if(!auth.auth && (localStorage.getItem('token') === auth.token)) history.push('/login');

  return (
    <>
      <tr>
        <td className='text-center'>{order._id}</td>
        <td className='text-center'>{cliente.nombre} {cliente.apellido}</td>
        <td className='text-center'>{order.createdAt.split('T')[0]}</td>
        <td className='text-center'>${order.total}</td>
        <td className='text-center'>
                {!badge ? (<button onClick={() => setBadge(!badge)} className='badge badge-danger'>Inactivo</button>) : (<button onClick={() => setBadge(!badge)} className='badge badge-success'>Activo</button>)}   
            </td>
        <td>
            <div className='buttonsContainer d-flex'>
              <button className='btn btn-secondary' onClick={handleShow}>Ver detalles <FontAwesomeIcon icon={faEye} /></button>
              <button className='btn btn-danger' onClick={() => deleteOrder(order._id)}>Eliminar pedido <FontAwesomeIcon icon={faTrashCan} /></button>
            </div>            
        </td>
      </tr> 
      
      {/* Modal para detalles */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle de la venta</Modal.Title>
        </Modal.Header>
          <Modal.Body>               
            <table className="table">
                    <thead className='text-center'>
                      <tr>
                        <th scope="col">Producto</th>
                        <th scope="col">Valor</th>
                        <th scope="col">Cantidad</th>
                      </tr>
                    </thead>
                  <tbody className='text-center'>
                  {order.pedido.map(article => (
                    <tr key={order._id+article.producto._id}>
                      <th>{article.producto.nombre}</th>
                      <td>${article.producto.precio}</td>
                      <td>{article.cantidad}</td>
                    </tr>
                    ))}
                  </tbody>
                </table>
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

export default DetailsOrder