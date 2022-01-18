import { CircularProgress, Paper } from '@mui/material'
import { FirebaseError } from 'firebase/app'
import React from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { useParams } from 'react-router-dom'
import { getGameDoc } from '../../../api/games/OrderAndChaos/game'
import { GameState } from '../../../api/games/OrderAndChaos/types'
import Loading from '../../Loading'
import OrderAndChaosActiveGame from './ActiveGame'
import OrderAndChaosPickSide from './PickSide'

const OrderAndChaosGame = () => {
    const { id } = useParams()
    const gameId = id ?? 'never'
    const [state, isLoading, error] = useDocumentData(
        getGameDoc(gameId ?? 'never')
    ) as [GameState | undefined, boolean, FirebaseError | undefined]

    if (!state || isLoading) {
        return (
            <Paper>
                <Loading />
            </Paper>
        )
    }

    if (!state.hasBegun) {
        return <OrderAndChaosPickSide gameId={gameId} gameState={state} />
    }

    return <OrderAndChaosActiveGame gameId={gameId} gameState={state} />
}

export default OrderAndChaosGame
