import React, { useContext, useEffect, useState } from 'react'

import clienteAxios from '../../config/axios';
import FormSearchProduct from './FormSearchProduct';
import Swal from 'sweetalert2'
import FormProductQuatity from './FormProductQuatity';
import { withRouter } from 'react-router-dom'

//Importar context
import { CRMContext } from './../../context/CRMContext';

const NewOrder = (props) => {

    //Utilizar valores del context
    const [ auth, guardarAuth ] = useContext(CRMContext);

    //Extraer id del cliente
    const { id } = props.match.params;

    //State cliente
    const [client, setClient] = useState({});
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
      //Obtener el cliente 
      const consultAPI = async () => {
          
          //Consultar cliente actual
          const result = await clienteAxios.get(`/clientes/${id}`, {
            headers: {
                Authorization : `Bearer ${auth.token}`
            }
          });
        //   console.log(auth.token)

          setClient(result.data);
      }
      
      consultAPI();
      
      //Actualizar total
      updateTotal();

    }, [products]);

    const searchProduct = async (e) => {
        e.preventDefault();

        const resultData = await clienteAxios.post(`/productos/busqueda/${search}`, {
            headers: {
                Authorization : `Bearer ${auth.token}`
            }
        });
        
        //Si no hay resultados manda alerta
        if(resultData.data[0]){

            let productResult = resultData.data[0];

            //Agregar la llave producto
            productResult.producto = resultData.data[0]._id;
            productResult.cantidad = 0;
        
            //Poner objeto en el state
            setProducts([...products, productResult])

        }else{
            //No hay resultados de la busqueda
            Swal.fire({
                icon: 'error',
                title: 'No hay resultados!',
                text: 'No se ha encontrado este producto.'
            })
        }

    }
    
    //Almacenar una busqueda en el state
    const readData = (e) => {
        setSearch(e.target.value);
    }

    //Actualizar cantidad de productos
    const restarProductos = (i) => {
        //Copiar el arreglo original
        const allProducts = [...products];

        //Validar si esta en 0 no puede restar mas
        if(allProducts[i].cantidad === 0) return;

        //Restar si se cumple lo de arriba
        allProducts[i].cantidad --;

        //Guardarlo en el state
        setProducts(allProducts);

    }

    const sumarProductos = (i) => {
        //Copiar el arreglo original
        const allProducts = [...products];

        //Restar si se cumple lo de arriba
        allProducts[i].cantidad ++;

        //Guardarlo en el state
        setProducts(allProducts);

    }

    //Eliminar producto del state
    const deleteProductOrder = (id) => {
        const allProducts = products.filter(product => product._id !== id)
        setProducts(allProducts);
    }

    //Actualizar total a pagar
    const updateTotal = () => {
        //Si el arreglo de productos es 0
        if(products.length === 0) {
            setTotal(0);
        }
        //Calcular total
        let newTotal = 0; 

        //Recorrer productos y sus cantidades y precios
        products.map(product => newTotal += (product.cantidad * product.precio));

        //Guardar nuevo total
        setTotal(newTotal);

    }

    //Almacenar pedido en la BD
    const handleSubmit = async (e) => {
         e.preventDefault();

         //Extraer id del cliente
         const { id } = props.match.params;

         //Construir objeto
         const order = {

            "cliente" : id,
            "pedido" : products,
            "total" : total
        }

        //Almacenar en la BD
        const result = await clienteAxios.post(`/pedidos/${id}`, order, {
            headers: {
                Authorization : `Bearer ${auth.token}`
            }
        });

        //Leer resultado
        if(result.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Correcto!',
                text: result.data.message
            })

        }else{
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error!',
                text: 'Vuelva a intentarlo.'
            })
        }

        //Redireccionar
        props.history.push("/orders")

    }

    //Verificar si el usuario esta autenticado o no
    if(!auth.auth && (localStorage.getItem('token') === auth.token)) props.history.push('/login');
    
  return (
    <div className='container'>
        <h1 className='text-center my-5 display-4 fw-bold'>Nuevo Pedido</h1>
        <div className='cont-principal d-flex'>
            <div>
                <h3 className='lead fw-bold'>Datos del cliente:</h3>
                <p><span className='fw-bold '>Nombre: </span>{client.nombre} {client.apellido}</p>
                <p><span className='fw-bold '>Telefono: </span>{client.telefono}</p>
            </div>

            <FormSearchProduct 
                searchProduct={searchProduct}
                readData={readData}                
            />

            <div>
                <h3 className='lead fw-bold'>Resumen:</h3>

                    <ul className='d-flex my-3 list-unstyled'>
                        {products.map((product, index) => ( 
                            <FormProductQuatity 
                                key={product.producto}
                                product={product}
                                restarProductos={restarProductos}
                                sumarProductos={sumarProductos}
                                index={index}
                                deleteProductOrder={deleteProductOrder}
                            />
                        ))}
                    </ul>

                    <div className='text-center'>
                        <p className='lead fw-bold'>Total a pagar: <span className='lead'>${total}</span></p>
                    
                    {total > 0 && (
                        <form onSubmit={handleSubmit}>
                            <input type="submit"
                                value="Realizar pedido"
                                className='btn btn-primary' />
                        </form>
                    )}
                    </div>

            </div>
        </div>
    </div>
  )
}

export default withRouter(NewOrder)