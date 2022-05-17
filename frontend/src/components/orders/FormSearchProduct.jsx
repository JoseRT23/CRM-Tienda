import React from 'react'

const FormSearchProduct = (props) => {

  return (
    <>
        <form onSubmit={props.searchProduct}>
            <h3 className='lead fw-bold'>Busca un producto</h3>
        
        <div>
            <input type="text"
                   className='search form-control'
                   placeholder='Nombre producto'
                   onChange={props.readData} 
                   />
        </div>

        <div>
            <input type="submit"
                   value="Buscar producto"
                   className='btn btn-primary my-4' 
                   />
        </div>

        </form>
    </>
  )
}

export default FormSearchProduct