import React, { useContext, useEffect, useState } from 'react'
import clienteAxios from '../../config/axios'
import Product from './Product'
import Spinner from '../Spinner'
import './Products.css'

//importar el context
import { CRMContext } from '../../context/CRMContext'


const Products = (props) => {

  const [products, setProducts] = useState([])

  //Actualizar valores del context
  const [ auth, guardarAuth ] = useContext(CRMContext);

  //consultar api
  useEffect(() => {

    //soluciona problema de escape de memoria de react
    let isMounted = false;
    //qery a la API
    setTimeout(() => {
      if(!isMounted){

        if(auth.token !== '' ){
          const consultAPI = async () =>  {
            try {

              const productsConsult = await clienteAxios.get('/productos', {
                headers: {
                  Authorization : `Bearer ${auth.token}`
                }
              });

              setProducts(productsConsult.data);

            } catch (error) {
              
              //Ocurre algun problema con el token
              if(error.response.status === 500) {
                props.history.push('/login')
                localStorage.setItem('token', '')
              }
            }
          }
          consultAPI();
        }else{
          props.history.push('/login')
        }
      }

    }, 100);

    return () => {
      isMounted = true;
    };
  }, []);
  

  const handleClick = () => {
    props.history.push("new-product");
  }

    //Validar nuevamente si ya se inicio sesion
    if(!auth.token) props.history.push('/login');

    //Spinner de carga
    if(!products.length) return <Spinner />

  return (
    <div className='container'>
      
      <h1 className='text-center my-5 display-4 fw-bold'>Productos</h1>

      <button className='btn btn-primary' onClick={handleClick}>Nuevo producto</button>
      <div className='table-responsive'>
        <table className='table mt-5 mx-auto'> 
              <thead className='table-dark text-center'>
                  <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acción</th>
                  </tr>
              </thead>
              <tbody >
                {products.map(product => (
                  <Product
                    key={product._id}
                    product={product}
                  />
                ))} 
              </tbody>  
        </table>
      </div>
    </div>
  )
}

export default Products