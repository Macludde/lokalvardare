import React from 'react'
import useAuth from '../hooks/useAuth'
import Login from '../pages/Login'

const AuthGate: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { isLoggedIn } = useAuth()

    if (!isLoggedIn) {
        return <Login />
    }

    return children
}

export default AuthGate
