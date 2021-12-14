import { useContext } from 'react'
import { AuthContext } from '../components/AuthGate'

const useAuth = () => {
    const { user } = useContext(AuthContext)

    return user
}

export default useAuth
