import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Account from './pages/Account'
import Feed from './pages/Feed'

export const mainRoutes = [
    {
        label: 'Memes',
        path: 'feed',
        component: <Feed />,
    },
    {
        label: 'Gyckel',
        path: 'gyckel',
        component: <Account />,
    },
]

const Router = () => {
    return (
        <Routes>
            {mainRoutes.map((route) => (
                <Route path={route.path} element={route.component} />
            ))}
            <Route path="*" element={<Navigate replace to="/feed" />} />
        </Routes>
    )
}

export default Router
