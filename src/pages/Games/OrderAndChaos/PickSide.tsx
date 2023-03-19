import { Tooltip, Box, Button, Paper, Typography } from '@mui/material'

import React from 'react'
import { pickSide } from '../../../api/games/OrderAndChaos/game'
import { InitialGameState } from '../../../api/games/OrderAndChaos/types'
import UserName from '../../../components/dynamics/UserName'
import useAuth from '../../../hooks/useAuth'

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
                        <Typography variant="h5" sx={{ marginBottom: 2 }}>
                            Välj en sida
                        </Typography>
                        <Box>
                            <Tooltip title="Försök få 5 i rad">
                                <Button
                                    variant="contained"
                                    onClick={() => selectSide('order')}
                                    sx={{ marginRight: 4 }}
                                >
                                    Order
                                </Button>
                            </Tooltip>
                            <Tooltip title="Försök stoppa order från att få 5 i rad">
                                <Button
                                    variant="contained"
                                    onClick={() => selectSide('chaos')}
                                >
                                    Kaos
                                </Button>
                            </Tooltip>
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="h5">
                        Väntar på att{' '}
                        <UserName uid={state.players[state.playerToPick]} />{' '}
                        väljer en sida
                    </Typography>
                )}
            </Paper>
        </Box>
    )
}

export default OrderAndChaosPickSide
