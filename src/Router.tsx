import HomeIcon from '@mui/icons-material/Home'
import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Account from './pages/Account'
import Comments from './pages/Comments'
import Feed from './pages/Feed'
import CreatePost from './pages/Feed/CreatePost'
import Gyckel from './pages/Gyckel'

export const routes = [
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
        component: <Gyckel />,
        inSidebar: true,
        icon: HomeIcon,
    },
    {
        label: 'Konto',
        path: 'account',
        component: <Account />,
    },
    {
        label: 'Skapa inlägg',
        path: 'feed/create',
        component: <CreatePost />,
    },
    {
        label: 'Kommentarer',
        path: 'feed/post/:id',
        component: <Comments />,
    },
]

const Router = () => {
    const location = useLocation()
    const currentLabel = routes.find(
        (route) => route.path === location.pathname.substring(1)
    )?.label
    document.title = currentLabel
        ? `${currentLabel} | Lokalvårdarna`
        : 'Lokalvårdarna'
    return (
        <Routes>
            {routes.map((route) => (
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
