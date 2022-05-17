import React, { useContext } from 'react'

import { Link, useHistory } from 'react-router-dom'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBoxesStacked, faBook, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import { CRMContext } from '../context/CRMContext';

const Header = () => {

  let history = useHistory();

  const [ auth, guardarAuth ] = useContext(CRMContext);

  const handleClick = () => {
    //auth.auth = false y el token se remueve
    guardarAuth({
      token: '',
      auth: false
    });

    localStorage.setItem('token', '');

    history.push('/login')

  }

  if (!auth.auth || (localStorage.getItem('token') === '')) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to={"/"}>CRM - Administrador de clientes</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to={"/"} >Productos <FontAwesomeIcon icon={faBoxesStacked} /></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/clients"}>Clientes <FontAwesomeIcon icon={faUsers} /></Link>        
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/orders"}>Pedidos <FontAwesomeIcon icon={faBook} /></Link>
              </li>
              
                {auth.auth ? (
                  <li className="nav-item">
                    <button onClick={handleClick} className="btn btn-danger mx-3" to={"/orders"}>Cerrar sesión <FontAwesomeIcon icon={faRightFromBracket} /></button>
                	</li>
                ) : null}
              
            </ul>
          </div>

        </div>
      </nav>
  )
}

export default Header