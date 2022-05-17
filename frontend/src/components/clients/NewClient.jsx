import React, { useContext, useState } from 'react'

import clienteAxios from '../../config/axios'
import { withRouter} from 'react-router-dom'
import './NewClient.css'

import Swal from 'sweetalert2'

//Importar context
import { CRMContext } from '../../context/CRMContext'


const NewClient = ({ history }) => {

    //Utilizar valores del context
    const [ auth, guardarAuth ] = useContext(CRMContext);

    const [cliente, setCliente] = useState({
        nombre: '',
        apellido: '',
        empresa: '',
        email: '',
        telefono: ''
    });

    const handleChange = (e) =>{
        //guardar lo que el usuario escribe
        setCliente({
            ...cliente,
            [e.target.name] : e.target.value
        });
    }

    const validateClient = () => {
        const {nombre, apellido, empresa, email, telefono} = cliente;

        //revisar que las propiedades del objeto sean validas
        let valido = !nombre.length || !apellido.length || !empresa.length || !email.length || !telefono.length;
                     
        return valido
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        clienteAxios.post('/clientes', cliente, {
            headers: {
                Authorization : `Bearer ${auth.token}`
            }
        })
            .then(res => {
                if (res.data.code === 11000) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Hubo un error',
                        text: 'Este cliente ya esta registrado'
                    })
                }else{
                    Swal.fire(
                        'Se agrego el cliente!',
                         res.data.message,
                        'success'
                      )
                }
                // redireccionar
                history.push('/clients')
            })
    }

    //Verificar si el usuario esta autenticado o no
    if(!auth.auth && (localStorage.getItem('token') === auth.token)) history.push('/login');

  return (
      <div className='container'>

        <h1 className='text-center my-5 display-4 fw-bold'>Nuevo cliente</h1>

        <div className='cont-form'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 w-50">
                    <label htmlFor="exampleFormControlInput1" className="form-label lead">Nombres</label>
                    <input type="text" 
                        className="form-control" 
                        name="nombre"
                        onChange={handleChange} 
                        placeholder="Nombres cliente" 
                        autoComplete='off'/>
                </div>
                <div className="mb-3 w-50">
                    <label htmlFor="exampleFormControlInput1" className="form-label lead">Apellidos</label>
                    <input type="text" 
                        className="form-control" 
                        name="apellido"
                        onChange={handleChange} 
                        placeholder="Apellidos cliente" 
                        autoComplete='off'/>
                </div>
                <div className="mb-3 w-50">
                    <label htmlFor="exampleFormControlInput1" className="form-label lead">Empresa</label>
                    <input type="text" 
                        className="form-control" 
                        name="empresa"
                        onChange={handleChange} 
                        placeholder="Empresa cliente" 
                        autoComplete='off'/>
                </div>
                <div className="mb-3 w-50">
                    <label htmlFor="exampleFormControlInput1" className="form-label lead">Email</label>
                    <input type="email" 
                        className="form-control" 
                        name="email"
                        onChange={handleChange} 
                        placeholder="Email cliente" 
                        autoComplete='off'/>
                </div>
                <div className="mb-3 w-50">
                    <label htmlFor="exampleFormControlInput1" className="form-label lead">Telefono</label>
                    <input type="tel" 
                        className="form-control" 
                        name="telefono"
                        onChange={handleChange} 
                        placeholder="Telefono cliente" 
                        autoComplete='off'/>
                </div>
                <div className="mt-5 text-center">
                    <input type="submit" 
                        className="btn btn-primary" 
                        value="Agregar cliente"
                        disabled={validateClient()}/>
                </div>
            </form>
        </div>
      </div>
  )
}

//HOC, es una funicon que toma un componente y retorna uno nuevo
export default withRouter(NewClient);