import React from 'react';
import { firebase, auth } from '../firebase';
import { withRouter } from "react-router-dom";
import { dblClick } from '@testing-library/user-event/dist/click';
//import { useHistory } from 'react-router-dom';

const Login = (props) => {
    
    //const history = useHistory();
    const [email, setEmail] = React.useState('');
    const [pass, setPass] = React.useState('');
    const [error, setError] = React.useState(null);
    const [esRegistro, setEsRegistro] = React.useState(true);
    const db = firebase.firestore()


    const procesarDatos = e => {
        e.preventDefault()
        if (!email.trim()) {
            setError('Ingrese un Email')
            return
        }
        if (!pass.trim()) {
            setError('Ingrese Contraseña')
            return
        }
        if (pass.length < 6) {
            setError('Contraseña menor a 6 caracteres')
            return
        }
        setError(null)

        if (esRegistro) {
            registrar()
        } else {
            login()
        }
    }

    const login = React.useCallback(async () => {
        try {
            await auth.signInWithEmailAndPassword(email, pass);
            setEmail('');
            setPass('');
            setError(null);
            //history.push('/admin')
            props.history.push("/admin")

        } catch (error) {
            if (error.code === 'auth/invalid-email') {
                setError('Email no valido')
            }
            if (error.code === 'auth/user-not-found') {
                setError('Email no registrado')
            }
            if (error.code === 'auth/wrong-password') {
                setError('Contraseña incorrecta')
            }
        }


    }, [email, pass, props.history])

    const registrar = React.useCallback(async () => {
        try {
            const res = await auth.createUserWithEmailAndPassword(email, pass)
            await firebase.firestore().collection('usuarios').doc(res.user.email).set({
                email: res.user.email,
                uid: res.user.uid
            })
            db.collection(res.user.email).add({
                Titulo: 'Reserva 10',
                Descripcion: 'Activa',
                Fecha: '28/06/2022',
                Hora: '20:30'
            })
            setEmail('')
            setPass('')
            setError(null)
            props.history.push("/admin")

        } catch (error) {
            if (error.code === 'auth/invalid-email') {
                setError('Email no valido')
            }
            if (error.code === 'auth/email-already-in-use') {
                setError('Este correo ya esta registrado')
            }
        }

    }, [email, pass, props.history])

    return (
        <div className='mt-5'>
            <h3 className='text-center'>
                {
                    esRegistro ? "Registro de Usuario" : "Login de acceso"
                }
            </h3>
            <hr />
            <div className="row justify-content-center">
                <div className="col-12 col-sm-12 col-md-6 col-xl-4 mt-2">
                    <form onSubmit={procesarDatos}>

                        {
                            error && (
                                <div className="alert alert-danger">{error}</div>
                            )
                        }

                        <input
                            type="email" className='form-control mb-2'
                            placeholder='Ingrese un email'
                            onChange={e => setEmail(e.target.value)}></input>
                        <input
                            type="password" className='form-control mb-2'
                            placeholder='Ingrese un password'
                            onChange={e => setPass(e.target.value)}></input>
                        <button className='btn btn-dark btn-lg btn-block ' type='submit'>
                            {
                                esRegistro ? 'Registrase' : 'Acceder'
                            }
                        </button>
                        <button
                            className='btn btn-info btn-sm btn-block '
                            onClick={() => setEsRegistro(!esRegistro)}
                            //onClick={handleClick}
                            type='button'>
                            {
                                esRegistro ? '¿Ya estas registrado?' : '¿No tienes Cuenta?'
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login)