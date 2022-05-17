import React, { useContext, useState } from 'react'
import Swal from 'sweetalert2'
import clienteAxios from '../../config/axios'
import { withRouter } from 'react-router-dom'
import './Login.css'

//Context
import { CRMContext } from '../../context/CRMContext'

const Login = (props) => {

    //Auth y token
    const [ auth, guardarAuth ] = useContext(CRMContext);

    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name] : e.target.value
        })
    }

    //Iniciar sesion
    const handleSubmit = async (e) => {
        e.preventDefault();

        //Autenticar el usuario
        try {
            const response = await clienteAxios.post('/iniciar-sesion', credentials)
            
            //Extraer token y guardarlo en localStorage
            const { token } = response.data; 
            localStorage.setItem('token', token);
            
            //Colocar informacion en el state del context
            guardarAuth({
                token: token,
                auth: true
            })

            Swal.fire({
                icon: 'success',
                title: 'Login correcto!',
                text: 'Has iniciado sesión'
            })

            //Redireccionar
            props.history.push('/')

        } catch (error) {
            if (error.response) {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: error.response.data.message
                })
            }else {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'Hubo un error'
                })
            }

        }
    }

  return (
    <>
        <h1 className='text-center my-5 display-4 fw-bold'>Inicia Sesión</h1>

        <div className='login mt-5'>
            <div className="cont-form d-flex">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="form-label lead">Email</label>
                        <input type="email"
                               name="email"
                               className='form-control'
                               placeholder="Ingresa tu email"
                               required
                               onChange={handleChange} />
                    </div>
                    <div>
                    <label className="form-label lead mt-4">Password</label>
                        <input type="password"
                               name="password"
                               className='form-control'
                               placeholder="Ingresa tu email"
                               required
                               onChange={handleChange} />
                    </div>

                    <div className='text-center'>
                    <input type="submit"
                           value="Iniciar sesion"
                           className='btn btn-primary mt-5 lead'
                     />
                    </div>

                </form>
            </div>
        </div>
    </>
  )
}

export default withRouter(Login)