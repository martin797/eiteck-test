import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Barra from './components/Barra';
import Login from './components/Login';
import { auth } from './firebase';
import Administrador from './components/Administrador';
import Detalle from './components/Detalle';
function App() {

  const [firebaseUser, setFireUser] = React.useState(false)

  React.useEffect(()=>{
    auth.onAuthStateChanged(user=>{
      console.log(user)
      if(user){
        setFireUser(user)
      }else{
        setFireUser(null)
      }
    })
  },[])

  return firebaseUser !== false ? (
    <Router>
      <Barra firebaseUser={firebaseUser}/>
      <Switch>
        <Route path="/" exact>
          <h1>Bienvenido</h1>
          <hr />
          <h3>Correo Admin: admin@admin.com || Contraseña: 123123</h3>
          <hr />
          <h3>Correo Prueba1: prueba1@ucuenca.com || Contraseña: 123123</h3>
          <hr />
          <h3>Correo Prueba2: prueba2@ucuenca.com || Contraseña: 123123</h3>
        </Route>
        <Route path="/admin">
          <Administrador/>
        </Route>
        <Route path="/detalle">
          <Detalle user={firebaseUser}/>
        </Route>
        <Route path="/login">
          <Login />
        </Route>
      </Switch>
    </Router>
  ):(
    <h1>Cargando..</h1>
  )
}

export default App;
