import React, { useContext, useEffect, useState } from 'react'

import clienteAxios from '../../config/axios'
import Client from './Client';

import { withRouter } from 'react-router-dom'
import Spinner from '../Spinner';
import './Clients.css'

//Importar context
import { CRMContext } from './../../context/CRMContext'

const Clients = (props) => {
    const [clientes, setClientes] = useState([]);

    //Utilizar valores del context
    const [ auth, guardarAuth ] = useContext(CRMContext);

    useEffect(() => {
      let isMounted = false;
      setTimeout(() => {
        if (!isMounted) {

          if(auth.token !== '') {

            const consultAPI = async () => {
              try {
                const clientesConsulta = await clienteAxios.get('/clientes', {
                  headers: {
                    Authorization : `Bearer ${auth.token}`
                  }
                });
                //colocar resultado al state
                setClientes(clientesConsulta.data);
        
              } catch (error) {
                //Error con authorizacion
                if(error.response.status = 500) {
                  props.history.push('/login')
                  
                }
              }
            }

            consultAPI();   
          }else {
            props.history.push('/login')
          }

        }
      }, 100);
      
        return () => {
          isMounted = true;
          };

    }, []);

    const handleClick = () => {
      props.history.push("clients/new-client");
    }

    //Validar nuevamente si ya se inicio sesion
    if(!auth.token) props.history.push('/login');

    //Si no hay nada en clientes
    if(!clientes.length) return <Spinner />
    
  return (
      <div className='container'>
        <h1 className='text-center my-5 display-4 fw-bold'>Clientes</h1>

        <button className='btn btn-primary' onClick={handleClick}>Nuevo cliente</button>

        <div className='table-responsive'>
          <table className='table mt-5 mx-auto'> 
                <thead className='table-dark text-center'>
                    <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Empresa</th>
                    <th scope="col">Email</th>
                    <th scope="col">Telefono</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Acción</th>
                    </tr>
                </thead>
                <tbody>
                  {clientes.map(cliente => (
                    <Client 
                      key={cliente._id} cliente={cliente}
                    />
                  ))}
                </tbody>  
          </table>
        </div>    
      </div>
  )
}

export default withRouter(Clients)