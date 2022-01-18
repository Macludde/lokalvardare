import { Box, Button, Paper, Typography } from '@mui/material'
import { FirestoreError } from 'firebase/firestore'
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
import UserName from '../../../components/dynamics/UserName'
import ClipboardCopy from '../../../components/ui/ClipboardCopy'
import useAuth from '../../../hooks/useAuth'
import Loading from '../../Loading'

const OrderAndChaosLobby = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { uid } = useAuth()
    const lobbyId = id ?? 'never'
    const [lobby, isLoading] = useDocumentData(getLobbyDoc(lobbyId), {
        transform: (val) => val as Lobby,
    }) as [Lobby | undefined, boolean, FirestoreError | undefined]

    if (!lobby || isLoading) {
        return (
            <Paper sx={{ padding: 4 }}>
                <Loading />
            </Paper>
        )
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
            <Typography variant="h4" sx={{ marginBottom: 4 }}>
                Lobby | Order and Chaos
            </Typography>
            <Box mb={2}>
                {lobby.players.map((player) => (
                    <Typography key={player} component="div">
                        <UserName uid={player} />
                        {player === lobby.admin && (
                            <Typography
                                component="span"
                                sx={{
                                    fontStyle: 'italic',
                                    color: 'text.secondary',
                                    display: 'inline',
                                    marginLeft: 1,
                                }}
                            >
                                värd
                            </Typography>
                        )}
                    </Typography>
                ))}
            </Box>
            <ClipboardCopy
                title="Kopiera invite link"
                textToCopy={document.location.href}
            />
            {!lobby.players.includes(uid) && (
                <Button
                    variant="contained"
                    onClick={join}
                    sx={{ marginTop: 4 }}
                >
                    Gå med
                </Button>
            )}
            {lobby.admin === uid && (
                <Button
                    variant="contained"
                    disabled={lobby.players.length < 2}
                    onClick={startGame}
                    sx={{ marginTop: 4 }}
                >
                    Starta
                </Button>
            )}
        </Paper>
    )
}

export default OrderAndChaosLobby
