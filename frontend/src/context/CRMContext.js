import React, { useState } from 'react'

const CRMContext = React.createContext([ {}, () => {} ]);

const CRMProvider = props => {
    
    const token = localStorage.getItem('token');

    //Definir state inicial
    const [auth, guardarAuth] = useState({
        token: token,
        auth: token ? true : false
    });

    return (
        <CRMContext.Provider value={[auth, guardarAuth]}>
           {props.children} 
        </CRMContext.Provider>
    )
}

export { CRMContext, CRMProvider };