import React from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";

const FormProductQuatity = (props) => {
    // console.log(product, 'producto')
    const {product, sumarProductos, restarProductos, index, deleteProductOrder} = props;
  
    return (
    <>
        <li className='mx-4'>
            <div>
                <p>{product.nombre}</p>
                <p>${product.precio}</p>
                <div className='d-flex'>
                    <FontAwesomeIcon icon={faMinus}
                                     className="btn-primary" 
                                     onClick={() => restarProductos(index)}/>

                    <p className='mx-5'>{product.cantidad}</p>

                    <FontAwesomeIcon icon={faPlus}
                                     className="btn-primary" 
                                     onClick={() => sumarProductos(index)} />
                </div>
                <div className='text-center'>
                    <button className='btn btn-danger my-4' onClick={() => deleteProductOrder(product._id)}>Eliminar producto</button>
                </div>
            </div>
        </li>
    </>
  )
}

export default FormProductQuatity