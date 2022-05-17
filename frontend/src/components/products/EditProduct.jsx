import React, { useContext, useEffect, useState } from 'react'

// import { withRouter } from 'react-router-dom'
import Swal from 'sweetalert2'
import clienteAxios from '../../config/axios'
import Spinner from '../../components/Spinner'
import './EditProduct.css'

//Importar context
import { CRMContext } from './../../context/CRMContext'

const EditProduct = (props) => {

    //Obtener id
    const { id } = props.match.params

    const [product, setProduct] = useState({
        nombre: '',
        precio: '',
        imagen: ''
    })

    const [imagen, setImagen] = useState('')

    //Utilizar valores del context
    const [ auth, guardarAuth ] = useContext(CRMContext);

    useEffect(() => {
        //Consultar API
        const consultAPI = async () => {
        const productConsult = await clienteAxios.get(`/productos/${id}`, {
            headers: {
                Authorization : `Bearer ${auth.token}`
            }
        });
        setProduct(productConsult.data);
    }
    consultAPI();
    }, [])

    //colocar nuevo valor de los inputs en el state
    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name] : e.target.value
        })
    }

    //colocar imagen en el state
    const leerArchivo = (e) => {
        setImagen(e.target.files[0])

    }

    //Editar producto
    const handleSubmit = async (e) => {
        e.preventDefault();
                //crear form data
                const formData = new FormData();
                formData.append('nombre', product.nombre);
                formData.append('precio', product.precio);
                formData.append('imagen', imagen);
        
                //almacenar en la BD
                try {
                   const res = await clienteAxios.put(`/productos/${id}`, formData, {
                        headers: {
                            Authorization : `Bearer ${auth.token}`,
                            'Content-Type' : 'multipart/form-data'
                        }
                    })
        
                    //Lanzar alerta
                    if(res.status === 200){
                        Swal.fire(
                            'Editado correctamente!',
                            res.data.message,
                            'success'
                        )
                    }
        
                    //Redireccionar
                    props.history.push("/")
                    
                } catch (error) {
                    console.log(error)
                    Swal.fire({
                        type: 'error',
                        title: 'Hubo un error!',
                        text: 'Vuelve a intentarlo'
                    })
                }
    }
    
    if(!product.nombre) return <Spinner />

    //Verificar si el usuario esta autenticado o no
    if(!auth.auth && (localStorage.getItem('token') === auth.token)) props.history.push('/login');

  return (
      <div className='container'>
        <h1 className='text-center my-5 display-4 fw-bold'>Editar producto</h1>
        <div className='cont-form'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleFormControlInput1" className="form-label lead">Nombre producto</label>
                    <input type="text" 
                        className="form-control" 
                        name="nombre"
                        onChange={handleChange} 
                        value={product.nombre}
                        placeholder="Nombre producto" 
                        autoComplete='off'/>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleFormControlInput1" className="form-label lead">Precio producto</label>
                    <input type="number"
                        min="0.0"
                        step="1000" 
                        className="form-control" 
                        name="precio"
                        onChange={handleChange} 
                        value={product.precio}
                        placeholder="Precio producto" 
                        autoComplete='off'/>
                </div>
                <div className="mb-3 w-50">
                    <label htmlFor="exampleFormControlInput1" className="form-label lead">Imagen</label>
                    { product.imagen ? (
                        <img src={`http://localhost:5000/${product.imagen}`} 
                            alt={product.nombre}
                            loading="lazy"
                            width="300px"/>
                    ) : null}
                    <input type="file" 
                        className="form-control lead" 
                        name="imagen"
                        onChange={leerArchivo} 
                        autoComplete='off'/>
                </div>
                <div className="mt-5 text-center">
                    <input type="submit" 
                        className="btn btn-primary" 
                        value="Editar producto"
                        />
                </div>
            </form>
        </div>
      </div>
  )
}

export default EditProduct