import { Box, Paper, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { getGameDoc, playMarker } from '../../../api/games/OrderAndChaos/game'
import { CellState, GameState } from '../../../api/games/OrderAndChaos/types'
import useAuth from '../../../hooks/useAuth'
import { CellBox, ContainerBox, Marker, SelectionMarker } from './styled'

const PARAMETERS = {
    width: 6,
    height: 6,
    colors: ['red', 'blue'],
}

const WIDTH_ARRAY = new Array(PARAMETERS.width).fill(0).map((_, i) => i)
const HEIGHT_ARRAY = new Array(PARAMETERS.width).fill(0).map((_, i) => i)

const Cell = ({
    state,
    selectedColor,
    onSelect,
    isMyTurn,
}: {
    state: CellState
    selectedColor: number
    onSelect: () => void
    isMyTurn: boolean
}) => {
    const [isHovering, setIsHovering] = useState(false)

    return (
        <CellBox
            borderColor="text.secondary"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            isHovering={isMyTurn && state === 'empty' && isHovering}
            onClick={isMyTurn ? onSelect : undefined}
        >
            {(state !== 'empty' && (
                <Marker
                    borderColor="text.secondary"
                    color={PARAMETERS.colors[state]}
                />
            )) ||
                (isHovering && (
                    <Marker
                        ghost
                        borderColor="text.secondary"
                        color={PARAMETERS.colors[selectedColor]}
                    />
                ))}
        </CellBox>
    )
}

const OrderAndChaosGame = () => {
    const { id } = useParams()
    const gameId = id ?? 'never'
    const { uid } = useAuth()
    const [state, isLoading, error] = useDocumentData(
        getGameDoc(gameId ?? 'never')
    )
    const [selectedColor, setSelectedColor] = useState(0)

    if (!state || isLoading) {
        return <Paper>Loading...</Paper>
    }
    const myIndex = state.players.indexOf(uid)

    const onSelect = (row: number, col: number) => {
        const newBoard = { ...state.board }
        newBoard[row][col] = state.selectedColor
        const newPlayer = myIndex * 2 - 1
        playMarker(gameId, newBoard, newPlayer)
    }

    return (
        <Box>
            <Paper variant="elevation" sx={{ padding: 2, marginBottom: 4 }}>
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-around"
                >
                    <SelectionMarker
                        borderColor="text.secondary"
                        color={PARAMETERS.colors[0]}
                        onClick={() => setSelectedColor(0)}
                        isSelected={selectedColor === 0}
                    />
                    <SelectionMarker
                        borderColor="text.secondary"
                        color={PARAMETERS.colors[1]}
                        onClick={() => setSelectedColor(1)}
                        isSelected={selectedColor === 1}
                    />
                </Box>
            </Paper>
            <Paper variant="elevation" sx={{ padding: 4 }}>
                <ContainerBox borderColor="text.secondary" position="relative">
                    <Box
                        position="absolute"
                        width="100%"
                        height="100%"
                        display="flex"
                        flexDirection="column"
                        margin={0}
                    >
                        {HEIGHT_ARRAY.map((row) => (
                            <Box
                                key={row}
                                flex="1"
                                display="flex"
                                flexDirection="row"
                                margin={0}
                                alignItems="stretch"
                            >
                                {WIDTH_ARRAY.map((col) => (
                                    <Cell
                                        key={col}
                                        state={state.board[row][col]}
                                        selectedColor={selectedColor}
                                        onSelect={() => onSelect(row, col)}
                                        isMyTurn={
                                            state.currentPlayer === myIndex
                                        }
                                    />
                                ))}
                            </Box>
                        ))}
                    </Box>
                </ContainerBox>
            </Paper>
        </Box>
    )
}

export default OrderAndChaosGame
