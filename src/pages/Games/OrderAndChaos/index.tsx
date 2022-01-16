import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { createLobby } from '../../../api/games/OrderAndChaos/game'
import useAuth from '../../../hooks/useAuth'
import { Route } from '../../../Router'
import OrderAndChaosGame from './Game'
import OrderAndChaosLobby from './Lobby'

export const OrderAndChaosRoutes: Route[] = [
    {
        label: 'Order and Chaos',
        path: '/games/order-and-chaos/lobby/:id',
        component: <OrderAndChaosLobby />,
    },
    {
        label: 'Order and Chaos',
        path: '/games/order-and-chaos/game/:id',
        component: <OrderAndChaosGame />,
    },
]

const OrderAndChaos = () => {
    const { uid } = useAuth()
    const navigate = useNavigate()

    const createNewLobby = async () => {
        const lobbyId = await createLobby(uid)
        navigate(`/games/order-and-chaos/lobby/${lobbyId}`)
    }
    return (
        <Box>
            <Typography>Order och Kaos</Typography>
            <Button variant="contained" onClick={createNewLobby}>
                Create lobby
            </Button>
        </Box>
    )
}

export default OrderAndChaos
