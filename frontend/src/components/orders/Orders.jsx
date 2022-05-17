import React, { useContext, useEffect, useState } from 'react'

import clienteAxios from '../../config/axios';
import DetailsOrder from './DetailsOrder';

// import Spinner 
import './Orders.css'

//Importar context
import { CRMContext } from '../../context/CRMContext';

const Orders = (props) => { 

  const [orders, setOrders] = useState([]);

  //Utilizar valores del context
  const [ auth, guardarAuth ] = useContext(CRMContext);

  useEffect(() => {
    let isMounted = false;
    setTimeout(() => {
      if(!isMounted) {
          if (auth.token !== '') {
            const consultAPI = async () => {
              try {

                const result = await clienteAxios.get('/pedidos', {
                  headers: {
                    Authorization : `Bearer ${auth.token}`
                  }
                });

                setOrders(result.data);
                
              } catch (error) {

                //Ocurre algun problema con el token
                if(error.response.status = 500) {
                  props.history.push('/login')
                }
                
              }
            }
            consultAPI();
          }else{
            props.histoy.push('/login')
            localStorage.setItem('token', '')
          }
      }
    }, 100);

    return () => {
      isMounted = true;
      };

  }, []);

  return (
    <div className='container'>
      {orders.length === 0 && (<h1 className='text-center my-5 display-4 fw-bold'>No hay pedidos</h1>)}
      
      <h1 className='text-center my-5 display-4 fw-bold'>Ventas</h1>
      
      <div className='table-responsive'>
          <table className='table mt-5 mx-auto'> 
                <thead className='table-dark text-center'>
                    <tr>
                    <th scope="col">No. venta</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Total venta</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Acción</th>
                    </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <DetailsOrder key={order._id}
                            order={order}/>
                  ))}
                </tbody>  
          </table>
        </div> 
    </div>
  )
}

export default Orders