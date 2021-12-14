import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import Account from './pages/Account'
import Feed from './pages/Feed'

export const mainRoutes = [
    {
        label: 'Memes',
        path: 'feed',
        component: <Feed />,
        inSidebar: true,
        icon: HomeIcon,
    },
    {
        label: 'Gyckel',
        path: 'gyckel',
        component: <Account />,
        inSidebar: true,
        icon: HomeIcon,
    },
    {
        label: 'Account',
        path: 'account',
        component: <Account />,
    },
]

const Router = () => {
    return (
        <Routes>
            {mainRoutes.map((route) => (
                <Route
                    path={route.path}
                    element={route.component}
                    key={route.path}
                />
            ))}
            <Route path="*" element={<Navigate replace to="/feed" />} />
        </Routes>
    )
}

export default Router
