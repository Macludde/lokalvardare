import { Timestamp } from 'firebase/firestore'

export type CellState = 'empty' | number
export type FlattenedBoardState = CellState[]

export interface InitialGameState {
    players: string[]
    playerToPick: number
    lastUpdated: Timestamp
    lobbyId: string
    hasBegun: false
}

export interface RegularGameState {
    players: string[] // UIDs of Players in lobby
    currentPlayer?: number // index of current player
    board: FlattenedBoardState
    orderPlayer?: number // index of which player is "order"
    lastUpdated: Timestamp
    lobbyId: string
    hasBegun: true
}

export type GameState = InitialGameState | RegularGameState

export interface Lobby {
    players: string[] // UIDs of Players in lobby
    admin: string
    createdAt: Timestamp
    gameId?: string
}
