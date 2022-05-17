import React, { useContext, useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faPlus} from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import clienteAxios from '../../config/axios';
import './Clients.css'

//Importar context
import { CRMContext } from './../../context/CRMContext'

const Client = ({cliente}) => {

    let history = useHistory();

    //Utilizar valores del context
    const [ auth, guardarAuth ] = useContext(CRMContext);

    //Badge estado
    const [badge, setBadge] = useState(true);

    //extraer información del cliente
    const {_id, nombre, apellido, empresa, email, telefono} = cliente;

    const deleteClient = (idCliente) => {
        Swal.fire({
            title: '¿Estas seguro?',
            text: "Un cliente eliminado no se puede recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {

            if (result.isConfirmed) {
                //llamado a axios
                clienteAxios.delete(`/clientes/${idCliente}`, {
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

    //Verificar si el usuario esta autenticado o no
    if(!auth.auth && (localStorage.getItem('token') === auth.token)) history.push('/login');

  return (
    <>
      <tr>
        <td className='text-center'>{nombre} {apellido}</td>
        <td className='text-center'>{empresa}</td>
        <td className='text-center'>{email}</td>
        <td className='text-center'>{telefono}</td>
        <td className='text-center'>
                {!badge ? (<button onClick={() => setBadge(!badge)} className='badge badge-danger'>Inactivo</button>) : (<button onClick={() => setBadge(!badge)} className='badge badge-success'>Activo</button>)}   
            </td>
        <td>
            <div className='actionsContainer d-flex'>
                <Link className='btn btn-primary' to={`/orders/new-order/${_id}`}>Nuevo pedido <FontAwesomeIcon icon={faPlus} /></Link>
                <Link className='btn btn-warning mx-4' to={`/clients/edit-client/${_id}`}>Editar cliente <FontAwesomeIcon icon={faPenToSquare}/></Link>
                <button className='btn btn-danger' onClick={() => deleteClient(_id)}>Eliminar cliente <FontAwesomeIcon icon={faTrashCan} /></button>
            </div>            
        </td>
      </tr> 
    </>
  )
}

export default Client