import { Box, Button, Paper, Typography } from '@mui/material'
import { FirestoreError } from 'firebase/firestore'
import { hostname } from 'os'
import React from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { useNavigate, useParams } from 'react-router-dom'
import {
    getLobbyDoc,
    joinLobby,
    play,
    updateGameId,
} from '../../../api/games/OrderAndChaos/game'
import { Lobby } from '../../../api/games/OrderAndChaos/types'
import useAuth from '../../../hooks/useAuth'

const OrderAndChaosLobby = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { uid } = useAuth()
    const lobbyId = id ?? 'never'
    const [lobby, isLoading, error] = useDocumentData(getLobbyDoc(lobbyId), {
        transform: (val) => val as Lobby,
    }) as [Lobby | undefined, boolean, FirestoreError | undefined]

    if (!lobby || isLoading) {
        return <Paper sx={{ padding: 4 }}>Loading...</Paper>
    }

    const join = () => {
        if (lobby.players.length >= 2) {
            window.alert('Lobby is full')
            return
        }
        joinLobby(lobbyId, uid)
    }

    const startGame = async () => {
        const gameId = await play(lobbyId, lobby.players)
        await updateGameId(lobbyId, gameId)
        navigate(`/games/order-and-chaos/game/${gameId}`)
    }

    if (lobby.gameId) {
        if (lobby.players.includes(uid)) {
            navigate(`/games/order-and-chaos/game/${lobby.gameId}`)
        }
        return <Paper sx={{ padding: 4 }}>Game has already started.</Paper>
    }
    return (
        <Paper sx={{ padding: 4 }}>
            <Typography>Lobby</Typography>
            <Box>
                {lobby.players.map((player) => (
                    <Typography key={player}>
                        {player}
                        {player === lobby.admin && '*'}
                    </Typography>
                ))}
            </Box>
            <Typography>
                Link:{' '}
                <a href={document.location.href}>{document.location.href}</a>
            </Typography>
            {!lobby.players.includes(uid) && (
                <Button onClick={join}>Gå med</Button>
            )}
            {lobby.admin === uid && (
                <Button disabled={lobby.players.length < 2} onClick={startGame}>
                    Starta
                </Button>
            )}
        </Paper>
    )
}

export default OrderAndChaosLobby
