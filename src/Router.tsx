import React, { JSXElementConstructor, ReactElement } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Account from './pages/Account'
import Bonga from './pages/Bonga'
import Contestant from './pages/Bonga/Contestant'
import Leaderboard from './pages/Bonga/Leaderboard'
import Comments from './pages/Comments'
import Feed from './pages/Feed'
import CreatePost from './pages/Feed/CreatePost'
import Games, { GameRoutes } from './pages/Games'
import Gyckel from './pages/Gyckel'

export type Route = {
    label: string
    path: string
    component: ReactElement<any, string | JSXElementConstructor<any>>
    inSidebar?: boolean
}

const baseRoutes: Route[] = [
    {
        label: 'Memes',
        path: 'feed',
        component: <Feed />,
        inSidebar: true,
    },
    {
        label: 'Gyckel',
        path: 'gyckel',
        component: <Gyckel />,
        inSidebar: false,
    },
    {
        label: 'Spel',
        path: 'games',
        component: <Games />,
        inSidebar: true,
    },
    {
        label: 'Bonga',
        path: 'bonga',
        component: <Bonga />,
        inSidebar: true,
    },
    {
        label: 'Contestant',
        path: 'bonga/:id',
        component: <Contestant />,
    },
    {
        label: 'Leaderboard',
        path: 'bonga/leaderboard',
        component: <Leaderboard />,
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

export const routes: Route[] = baseRoutes.concat(GameRoutes)

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
