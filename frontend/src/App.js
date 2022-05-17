import React, { useContext } from 'react'
import Header from './components/Header'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Clients from './components/clients/Clients'
import NewClient from './components/clients/NewClient'
import EditClient from './components/clients/EditClient'

import Products from './components/products/Products'
import NewProduct from './components/products/NewProduct'
import EditProduct from './components/products/EditProduct'

import Orders from './components/orders/Orders'
import NewOrder from './components/orders/NewOrder'

import Login from './components/auth/Login'

import { CRMContext, CRMProvider } from './context/CRMContext'

const App = () => {

  //Utilizar context en el componente
  const [ auth, guardarAuth ] = useContext(CRMContext)
  
  return (
    <Router>
      <>
        <CRMProvider value={[ auth, guardarAuth ]}>
        <Header />    
          <Switch>
            <Route exact path={"/"} component={Products} />
            <Route exact path={"/new-product"} component={NewProduct} />
            <Route exact path={"/edit-product/:id"} component={EditProduct} />

            <Route exact path={"/clients"} component={Clients} />
            <Route exact path={"/clients/new-client"} component={NewClient} />
            <Route exact path={"/clients/edit-client/:id"} component={EditClient} />
            
            <Route exact path={"/orders"} component={Orders} />
            <Route exact path={"/orders/new-order/:id"} component={NewOrder} />
          
            <Route exact path={"/login"} component={Login} />

          </Switch>
        </CRMProvider>
      </>
    </Router>

  )
}

export default App
