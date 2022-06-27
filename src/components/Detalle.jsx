import React from 'react'
import { firebase, auth } from "../firebase"

const Detalle = (props) => {


  const [reservas, setReservas] = React.useState([])
  const [reservasAdmin, setReservasAdmin] = React.useState([])
  React.useEffect(() => {

    //Titulo de la Pagina...
    document.title = `Reservaciones`
    const obtenerReservas = async () => {
      try {
        //Inicializamos el llamado a Firestore..
        const db = firebase.firestore()
        //Creamos una data
        const data = await db.collection(props.user.uid).get()
        const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        console.log(arrayData)
        setReservas(arrayData)
      } catch (error) {
        console.log(error)
      }
    }
    const obtenerReservasAdmin = async () => {
      try {
        //Inicializamos el llamado a Firestore..
        const db = firebase.firestore()
        //Creamos una data
        const data = await db.collection('reservaciones').get()
        const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        console.log(arrayData)
        setReservasAdmin(arrayData)
      } catch (error) {
        console.log(error)
      }
    }
    obtenerReservas()
    obtenerReservasAdmin()
  }, [])


  return (
    <div className='conatainer'>
      <h3>Usuario: {props.user.email}</h3>
      <hr />
      <div className="row">
        {
          props.user.email === 'admin@admin.com' ?
            (<div className="col-12">
              <h4 className="text-center">Reservas</h4>
              <table className="table">
                <thead className="thead-dark">
                  {
                    reservasAdmin.length === 0 ? (
                      <ul className="list-group">
                        <li className="list-group-item">
                          <h5>No hay Reservas</h5>
                        </li>
                      </ul>
                    ) : (
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">Titulo</th>
                        <th scope="col">Descrpción</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Hora</th>
                        <th scope="col"></th>
                      </tr>
                    )
                  }

                </thead>
                <tbody>
                  {
                    reservasAdmin.map(item => (
                      <tr>
                        <th scope="row" key={item.id}></th>
                        <td>{item.Titulo}</td>
                        <td>{item.Descripcion}</td>
                        <td>{item.Fecha}</td>
                        <td>{item.Hora}</td>

                      </tr>
                    ))


                  }
                </tbody>
              </table>
            </div>)
            :
            (<div className="col-12">
              <h4 className="text-center">Lista de Reservas</h4>
              <table className="table">
                <thead className="thead-dark">
                  {
                    reservas.length === 0 ? (
                      <ul className="list-group">
                        <li className="list-group-item">
                          <h5>No hay Reservas</h5>
                        </li>
                      </ul>
                    ) : (
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">Titulo</th>
                        <th scope="col">Descrpción</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Hora</th>
                        <th scope="col"></th>
                      </tr>
                    )
                  }

                </thead>
                <tbody>
                  {
                    reservas.map(item => (
                      <tr>
                        <th scope="row" key={item.id}></th>
                        <td>{item.Titulo}</td>
                        <td>{item.Descripcion}</td>
                        <td>{item.Fecha}</td>
                        <td>{item.Hora}</td>

                      </tr>
                    ))


                  }
                </tbody>
              </table>
            </div>)
        }
      </div>
    </div>
  )
}

export default Detalle