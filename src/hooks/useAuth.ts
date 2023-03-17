import { useContext } from 'react'
import { AuthContext } from '../components/AuthProvider'

const useAuth = () => {
    const { user } = useContext(AuthContext)
    if (!user) {
        return {
            uid: 'unknown',
            isLoggedIn: false,
        }
        throw new Error('useAuth was called when user was not authenticated')
    }

    return { ...user, isLoggedIn: true }
}

export default useAuth
