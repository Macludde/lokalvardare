import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import React, { useEffect } from 'react'
import Login from '../pages/Login'

const auth = getAuth()

export type AuthContextType = {
    user: User | null
}

export const AuthContext = React.createContext<AuthContextType>({
    user: null,
})

const AuthGate: React.FC = ({ children }) => {
    const [user, setUser] = React.useState<User | null>(null)
    useEffect(() => {
        onAuthStateChanged(auth, (updatedUser) => {
            if (updatedUser) {
                setUser(updatedUser)
            } else {
                setUser(null)
            }
        })
    }, [])

    const value = React.useMemo(() => ({ user }), [user])

    if (!user) {
        return <Login />
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthGate
