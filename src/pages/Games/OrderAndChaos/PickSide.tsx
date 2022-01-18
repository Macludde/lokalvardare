import { Box, Button, Paper, Typography } from '@mui/material'
import React, { useState } from 'react'
import { pickSide, playMarker } from '../../../api/games/OrderAndChaos/game'
import { InitialGameState } from '../../../api/games/OrderAndChaos/types'
import useAuth from '../../../hooks/useAuth'
import { ContainerBox, SelectionMarker } from './styled'

type PickSideProps = {
    gameId: string
    gameState: InitialGameState
}

const OrderAndChaosPickSide: React.FC<PickSideProps> = ({
    gameId,
    gameState: state,
}) => {
    const { uid } = useAuth()
    const myIndex = state.players.indexOf(uid)

    const isPicking = state.playerToPick === myIndex

    const selectSide = (side: 'order' | 'chaos') => {
        pickSide(gameId, side, state.playerToPick)
    }

    return (
        <Box>
            <Paper variant="elevation" sx={{ padding: 4 }}>
                {isPicking ? (
                    <Box>
                        <Typography>Välj en sida</Typography>
                        <Box>
                            <Button onClick={() => selectSide('order')}>
                                Order
                            </Button>
                            <Button onClick={() => selectSide('chaos')}>
                                Kaos
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Typography>
                        Väntar på att {state.players[state.playerToPick]} väljer
                        en sida
                    </Typography>
                )}
            </Paper>
        </Box>
    )
}

export default OrderAndChaosPickSide
