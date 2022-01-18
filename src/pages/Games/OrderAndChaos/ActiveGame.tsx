import { Box, Paper } from '@mui/material'
import React, { useState } from 'react'
import {
    playMarker,
    unflattenBoard,
} from '../../../api/games/OrderAndChaos/game'
import {
    CellState,
    RegularGameState,
} from '../../../api/games/OrderAndChaos/types'
import useAuth from '../../../hooks/useAuth'
import { CellBox, ContainerBox, Marker, SelectionMarker } from './styled'

const PARAMETERS = {
    colors: ['red', 'blue'],
}

const WIDTH_ARRAY = new Array(6).fill(0).map((_, i) => i)
const HEIGHT_ARRAY = new Array(6).fill(0).map((_, i) => i)

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
                (isHovering && isMyTurn && (
                    <Marker
                        ghost
                        borderColor="text.secondary"
                        color={PARAMETERS.colors[selectedColor]}
                    />
                ))}
        </CellBox>
    )
}

type ActiveGameProps = {
    gameId: string
    gameState: RegularGameState
}

const OrderAndChaosActiveGame: React.FC<ActiveGameProps> = ({
    gameId,
    gameState: state,
}) => {
    const { uid } = useAuth()
    const [selectedColor, setSelectedColor] = useState(0)

    const myIndex = state.players.indexOf(uid)

    const onSelect = (row: number, col: number) => {
        const newBoard = [...state.board]
        newBoard[row * 6 + col] = selectedColor
        const newPlayer = -myIndex + 1
        // console.log(newBoard)
        playMarker(gameId, newBoard, newPlayer)
    }

    const board = unflattenBoard(state.board)

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
                                        state={board[row][col]}
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

export default OrderAndChaosActiveGame
