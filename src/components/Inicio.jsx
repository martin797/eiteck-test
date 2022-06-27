import React from 'react'
import { nanoid } from 'nanoid'
import { firebase } from "../firebase"

const Inicio = (props) => {

    const [titulo, setTitulo] = React.useState('')
    const [descripcion, setDescripcion] = React.useState('')
    const [fecha, setFecha] = React.useState('')
    const [hora, setHora] = React.useState('')


    //Para Verificar que el formulario no este vacio..
    const [error, setError] = React.useState(null)

    //Lista para agregar reservas en arrays..
    const [reservas, setReservas] = React.useState([])
    const [reservasAdmin, setReservasAdmin] = React.useState([])
    const [modoEdicion, setModoEdicion] = React.useState(false)
    const [id, setId] = React.useState('')

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


    //Evento Formulario..
    const agregarReserva = async (e) => {
        e.preventDefault()
        if (!titulo.trim() || !descripcion.trim() || !fecha.trim()) {
            console.log('Elemento Vacio')
            setError('Existen campos vacios...')
            return
        } 

        try {

            const db = firebase.firestore()
            const nuevaReserva = {
                Titulo: titulo,
                Descripcion: descripcion,
                Fecha: fecha,
                Hora: hora
            }


            const data = await db.collection(props.user.uid).add(nuevaReserva)
            const data2 = await db.collection('reservaciones').add(nuevaReserva)

            setReservas([
                ...reservas,
                { ...nuevaReserva, id: data.id }
            ])
            setReservasAdmin([
                ...reservasAdmin,
                { ...nuevaReserva, id: data2.id }
            ])

            //Limpiar Formulario..
            setTitulo('')
            setDescripcion('')
            setFecha('')
            setHora('')
            setError(null)
        } catch (error) {
            console.log(error)
        }


    }

    const eliminarReserva = async (id) => {

        try {
            const db = firebase.firestore()
            await db.collection(props.user.uid).doc(id).delete()
            await db.collection('reservaciones').doc(id).delete()
            const arrayFiltrado = reservas.filter(item => item.id !== id)
            const arrayFiltradoAdmin = reservasAdmin.filter(item => item.id !== id)
            setReservas(arrayFiltrado)
            setReservasAdmin(arrayFiltradoAdmin)
        } catch (error) {

        }

    }

    //Evento click editar..
    const editar = (item) => {
        setModoEdicion(true)
        setTitulo(item.Titulo)
        setDescripcion(item.Descripcion)
        setFecha(item.Fecha)
        setHora(item.Hora)
        setId(item.id)
    }

    //Evento Formulario Editar..
    const editarReserva = e => {
        e.preventDefault()
        if (!titulo.trim() || !descripcion.trim() || !fecha.trim()) {
            console.log('Elemento Vacio')
            setError('Existen campos vacios...')
            return
        }

        try {
            const db = firebase.firestore()
            db.collection(props.user.uid).doc(id).update({
                Titulo: titulo,
                Descripcion: descripcion,
                Fecha: fecha,
                Hora: hora
            })
            db.collection('reservaciones').doc(id).update({
                Titulo: titulo,
                Descripcion: descripcion,
                Fecha: fecha,
                Hora: hora
            })
            //Editar Array..
            const arrayEditado = reservas.map(
                item => item.id === id ? { id, Titulo: titulo, Descripcion: descripcion, Fecha: fecha, Hora: hora } : item)
            const arrayEditadoAdmin = reservasAdmin.map(
                item => item.id === id ? { id, Titulo: titulo, Descripcion: descripcion, Fecha: fecha, Hora: hora } : item)
            setReservas(arrayEditado)
            setReservasAdmin(arrayEditadoAdmin)
            setModoEdicion(false)
            setTitulo('')
            setDescripcion('')
            setFecha('')
            setHora('')
            setId('')
            setError(null)

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div>


            <div className="container mt-3">
                <h1 className='text-center'>RESERVAS</h1>
                <hr />

                <div className='conatainer'>
                    <h3>Usuario: {props.user.email}</h3>
                    <hr />
                    <div className="row">
                        {
                            props.user.email === 'admin@admin.com' ? 
                            (<div className="col-8">
                                <h4 className="text-center">Lista de Reservas</h4>
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
                                                    <button
                                                        className="btn btn-danger btn-sm float-right mt-2 mx-2"
                                                        onClick={() => eliminarReserva(item.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                    <button
                                                        className="btn btn-warning btn-sm float-right mt-2 mx-2"
                                                        onClick={() => editar(item)}
                                                    >
                                                        Editar
                                                    </button>
                                                </tr>
                                            ))


                                        }
                                    </tbody>
                                </table>
                            </div>) 
                            : 
                            (<div className="col-8">
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
                                                    <button
                                                        className="btn btn-danger btn-sm float-right mt-2 mx-2"
                                                        onClick={() => eliminarReserva(item.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                    <button
                                                        className="btn btn-warning btn-sm float-right mt-2 mx-2"
                                                        onClick={() => editar(item)}
                                                    >
                                                        Editar
                                                    </button>
                                                </tr>
                                            ))


                                        }
                                    </tbody>
                                </table>
                            </div>)
                        }

                        <div className="col-3 offset-1">
                            <h4 className="text-center">
                                {
                                    modoEdicion ? 'Editar Tarea' : 'Agregar Tarea'
                                }
                            </h4>
                            <form onSubmit={modoEdicion ? editarReserva : agregarReserva}>

                                {
                                    error ? <span className='text-danger'>{error}</span> : null
                                }

                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Ingrese Titulo"
                                    onChange={e => setTitulo(e.target.value)}
                                    value={titulo}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Ingrese Descripción"
                                    onChange={e => setDescripcion(e.target.value)}
                                    value={descripcion}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Ingrese Fecha"
                                    onChange={e => setFecha(e.target.value)}
                                    value={fecha}
                                />

                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Ingrese Hora"
                                    onChange={e => setHora(e.target.value)}
                                    value={hora}
                                />

                                {
                                    modoEdicion ?
                                        (<button className="btn btn-warning btn-block" type='submit'>Editar</button>)
                                        :
                                        (<button className="btn btn-dark btn-block" type='submit'>Agregar</button>)
                                }

                            </form>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="col-12">
                    <a href="/detalle" type="button" class="btn btn-success btn-lg btn-block">Ver Detalle de las Reservas</a>
                </div>
            </div>



        </div>
    )
}

export default Inicio
