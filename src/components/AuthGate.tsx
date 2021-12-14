import { getAuth, User } from 'firebase/auth'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import Login from '../pages/Login'

const auth = getAuth()

export type AuthContextType = {
    user: User | null
}

export const AuthContext = React.createContext<AuthContextType>({
    user: null,
})

const AuthGate: React.FC = ({ children }) => {
    const [user, loading, error] = useAuthState(auth)

    const value = React.useMemo(() => ({ user: user ?? null }), [user])

    if (error) {
        console.error(error)
    }

    if (loading) return null

    if (!user) {
        return <Login />
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthGate
