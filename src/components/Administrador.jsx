import React from 'react'
import { withRouter } from 'react-router-dom'
import { auth } from '../firebase'
import Inicio from './Inicio';

function Administrador(props) {

    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        if (auth.currentUser) {
            console.log('Existe usuario')
            setUser(auth.currentUser)
        } else {
            console.log('No existe');
            props.history.push('/login')
        }
        console.log(setUser)
    }, [props.history])

  return (
    <div className='mt-5'>
        {
            user && (
                <Inicio user={user}/>
            )
        }
    </div>

  )    
    
}

export default withRouter(Administrador)