import { useContext } from 'react'
import { AuthContext } from '../components/AuthGate'

const useAuth = () => {
    const { user } = useContext(AuthContext)

    if (!user) {
        throw new Error('useAuth was called when user was not authenticated')
    }

    return user
}

export default useAuth
