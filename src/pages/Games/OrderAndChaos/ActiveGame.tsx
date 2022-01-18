import { Box, Button, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
    flattenBoard,
    generateEmptyBoard,
    playMarker,
    unflattenBoard,
} from '../../../api/games/OrderAndChaos/game'
import {
    CellState,
    FlattenedBoardState,
    RegularGameState,
} from '../../../api/games/OrderAndChaos/types'
import UserName from '../../../components/dynamics/UserName'
import useAuth from '../../../hooks/useAuth'
import {
    CellBox,
    ContainerBox,
    Direction,
    Marker,
    SelectionMarker,
    WinLine,
} from './styled'

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

const hasWon: (board: CellState[][]) => WinInfo = (board: CellState[][]) => {
    // Check horizontal lines
    for (let row = 0; row < 6; row += 1) {
        for (let col = 0; col < 2; col += 1) {
            if (
                board[row][col] !== 'empty' &&
                board[row][col] === board[row][col + 1] &&
                board[row][col] === board[row][col + 2] &&
                board[row][col] === board[row][col + 3] &&
                board[row][col] === board[row][col + 4]
            ) {
                return {
                    row,
                    col,
                    direction: 'horizontal',
                }
            }
        }
    }

    // Check vertical lines
    for (let col = 0; col < 6; col += 1) {
        for (let row = 0; row < 2; row += 1) {
            if (
                board[row][col] !== 'empty' &&
                board[row][col] === board[row + 1][col] &&
                board[row][col] === board[row + 2][col] &&
                board[row][col] === board[row + 3][col] &&
                board[row][col] === board[row + 4][col]
            ) {
                return {
                    row,
                    col,
                    direction: 'vertical',
                }
            }
        }
    }

    // Check diagonals
    for (let row = 0; row < 2; row += 1) {
        for (let col = 0; col < 2; col += 1) {
            if (
                board[row][col] !== 'empty' &&
                board[row][col] === board[row + 1][col + 1] &&
                board[row][col] === board[row + 2][col + 2] &&
                board[row][col] === board[row + 3][col + 3] &&
                board[row][col] === board[row + 4][col + 4]
            ) {
                return {
                    row,
                    col,
                    direction: 'diagonal',
                }
            }
        }
    }

    // Check "reverse diagonals"
    for (let row = 0; row < 2; row += 1) {
        for (let col = 4; col < 6; col += 1) {
            if (
                board[row][col] !== 'empty' &&
                board[row][col] === board[row + 1][col - 1] &&
                board[row][col] === board[row + 2][col + 2] &&
                board[row][col] === board[row + 3][col + 3] &&
                board[row][col] === board[row + 4][col + 4]
            ) {
                return {
                    row,
                    col,
                    direction: 'reverseDiagonal',
                }
            }
        }
    }

    // Check if any spots are empty
    for (let row = 0; row < 6; row += 1) {
        for (let col = 0; col < 6; col += 1) {
            if (board[row][col] === 'empty') {
                return null
            }
        }
    }
    // All positions are filled
    return 'chaos'
}

type ActiveGameProps = {
    gameId: string
    gameState: RegularGameState
}

type WinInfo =
    | {
          row: number
          col: number
          direction: Direction
      }
    | 'chaos'
    | null

const OrderAndChaosActiveGame: React.FC<ActiveGameProps> = ({
    gameId,
    gameState: state,
}) => {
    const { uid } = useAuth()
    const [selectedColor, setSelectedColor] = useState(0)
    const [winInfo, setWinInfo] = useState<WinInfo>(null)
    const [board, setBoard] = useState<CellState[][]>(
        unflattenBoard(state.board)
    )

    const myIndex = state.players.indexOf(uid)

    const winningPlayer = state.winningPlayer
        ? state.players[state.winningPlayer]
        : undefined

    useEffect(() => {
        const unflattenedBoard = unflattenBoard(state.board)
        setBoard(unflattenedBoard)
        setWinInfo(hasWon(unflattenedBoard))
    }, [state.board])

    const onSelect = (row: number, col: number) => {
        const newBoard = [...state.board]
        newBoard[row * 6 + col] = selectedColor
        const newPlayer = -myIndex + 1
        const unflattenedBoard = unflattenBoard(newBoard)
        const newWinInfo = hasWon(unflattenedBoard)
        let newWinningPlayer
        if (newWinInfo !== null) {
            newWinningPlayer =
                newWinInfo === 'chaos'
                    ? -state.orderPlayer + 1
                    : state.orderPlayer
        }
        setWinInfo(newWinInfo)
        setBoard(unflattenedBoard)
        playMarker(gameId, newBoard, newPlayer, newWinningPlayer)
    }

    return (
        <Box>
            <Paper variant="elevation" sx={{ padding: 2, marginBottom: 4 }}>
                {winningPlayer === undefined ? (
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
                ) : (
                    <Box>
                        <Typography variant="h6">
                            {winningPlayer === uid ? (
                                'Grattis, du vann. *slow clap*'
                            ) : (
                                <>
                                    <UserName uid={winningPlayer} /> vann! (Det
                                    betyder att du förlora, bara så du vet)
                                </>
                            )}
                        </Typography>
                    </Box>
                )}
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
                                            state.currentPlayer === myIndex &&
                                            state.winningPlayer === undefined
                                        }
                                    />
                                ))}
                            </Box>
                        ))}
                    </Box>
                    {winInfo !== null && winInfo !== 'chaos' && (
                        <WinLine
                            row={winInfo.row}
                            col={winInfo.col}
                            direction={winInfo.direction}
                        />
                    )}
                </ContainerBox>
            </Paper>
        </Box>
    )
}

export default OrderAndChaosActiveGame
