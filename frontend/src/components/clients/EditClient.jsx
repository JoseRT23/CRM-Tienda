import React, { useState, useEffect, useContext } from 'react'

import clienteAxios from '../../config/axios'
import { withRouter } from 'react-router-dom'
import './EditClient.css'

//Importar context
import { CRMContext } from './../../context/CRMContext'

import Swal from 'sweetalert2'

const EditClient = (props) => {

    //Utilizar valores del context
    const [ auth, guardarAuth ] = useContext(CRMContext);

    //obtener id
    // const location = useLocation();
    // console.log(location);
    const { id } = props.match.params;

    const [datosCliente, setDatosCliente] = useState({
        nombre: '',
        apellido: '',
        empresa: '',
        email: '',
        telefono: ''
    });

    const consultAPI = async () => {
        const consulta = await clienteAxios.get(`/clientes/${id}`, {
            headers: {
                    Authorization : `Bearer ${auth.token}`
                }
        });
        setDatosCliente(consulta.data);
    }

    useEffect(() => {
        consultAPI();
    }, [])
    

    const handleChange = (e) =>{
        //guardar lo que el usuario escribe
        setDatosCliente({
            ...datosCliente,
            [e.target.name] : e.target.value
        });
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        clienteAxios.put(`/clientes/${datosCliente._id}`, datosCliente, {
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
                    'Correcto!',
                     'Se actualizo correctamente',
                    'success'
                  )
            }

            //redireccionar
            props.history.push("/clients");
        })
    }

    const validateClient = () => {
        const {nombre, apellido, empresa, email, telefono} = datosCliente;

        //revisar que las propiedades del objeto sean validas
        let valido = !nombre.length || !apellido.length || !empresa.length || !email.length || !telefono.length;
                     
        return valido
    }

    //Verificar si el usuario esta autenticado o no
    if(!auth.auth && (localStorage.getItem('token') === auth.token)) props.history.push('/login');

  return (
      <div className='container'>
        <h1 className='text-center my-5 display-4 fw-bold'>Editar cliente</h1>
        <div className='cont-form'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 w-50">
                    <label className="form-label lead">Nombres</label>
                    <input type="text" 
                        className="form-control" 
                        name="nombre"
                        onChange={handleChange}
                        value={datosCliente.nombre} 
                        placeholder="Nombres cliente" 
                        autoComplete='off'/>
                </div>
                <div className="mb-3 w-50">
                    <label className="form-label lead">Apellidos</label>
                    <input type="text" 
                        className="form-control" 
                        name="apellido"
                        onChange={handleChange}
                        value={datosCliente.apellido}  
                        placeholder="Apellidos cliente" 
                        autoComplete='off'/>
                </div>
                <div className="mb-3 w-50">
                    <label className="form-label lead">Empresa</label>
                    <input type="text" 
                        className="form-control" 
                        name="empresa"
                        onChange={handleChange}
                        value={datosCliente.empresa}  
                        placeholder="Empresa cliente" 
                        autoComplete='off'/>
                </div>
                <div className="mb-3 w-50">
                    <label className="form-label lead">Email</label>
                    <input type="email" 
                        className="form-control" 
                        name="email"
                        onChange={handleChange} 
                        value={datosCliente.email}  
                        placeholder="Email cliente" 
                        autoComplete='off'/>
                </div>
                <div className="mb-3 w-50">
                    <label className="form-label lead">Telefono</label>
                    <input type="tel" 
                        className="form-control" 
                        name="telefono"
                        onChange={handleChange}
                        value={datosCliente.telefono}  
                        placeholder="Telefono cliente" 
                        autoComplete='off'/>
                </div>
                <div className="mt-5 text-center">
                    <input type="submit" 
                        className="btn btn-primary" 
                        value="Guardar cambios"
                        disabled={validateClient()}/>
                </div>
            </form>
        </div>
      </div>
  )
}

//HOC, es una funicon que toma un componente y retorna uno nuevo
export default withRouter(EditClient);