import {
    addDoc,
    arrayUnion,
    collection,
    deleteField,
    doc,
    getFirestore,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore'
import { CellState, FlattenedBoardState } from './types'

const db = getFirestore()

const base = 'games/order-and-chaos'

export const generateEmptyBoard = () =>
    new Array(6)
        .fill(0)
        .map(() => new Array(6).fill(0).map(() => 'empty')) as CellState[][]

export const flattenBoard = (board: CellState[][]) =>
    board.reduce((acc, row) => [...acc, ...row], [])

const WIDTH = 6
export const unflattenBoard = (board: FlattenedBoardState) =>
    board.reduce((acc: CellState[][], _, i) => {
        if (i % WIDTH === 0) {
            acc.push([])
        }
        acc[acc.length - 1].push(board[i])
        return acc
    }, [])

export const getLobbyDoc = (lobbyId: string) =>
    doc(db, `${base}/lobbies/${lobbyId}`)
export const getGameDoc = (gameId: string) => doc(db, `${base}/games/${gameId}`)

export const createLobby = async (uid: string) => {
    const newDoc = await addDoc(collection(db, `${base}/lobbies`), {
        players: [uid],
        admin: uid,
        createdAt: serverTimestamp(),
    })
    return newDoc.id
}

export const joinLobby = (lobbyId: string, uid: string) =>
    updateDoc(getLobbyDoc(lobbyId), {
        players: arrayUnion(uid),
    })

export const play = async (lobbyId: string, players: string[]) => {
    if (players.length !== 2) throw new Error('wrong-number-of-players')
    const newDoc = await addDoc(collection(db, `${base}/games`), {
        players,
        playerToPick: Math.floor(Math.random() * 2),
        lastUpdated: serverTimestamp(),
        lobbyId,
        hasBegun: false,
    })
    return newDoc.id
}

export const updateGameId = (lobbyId: string, gameId: string) =>
    updateDoc(getLobbyDoc(lobbyId), {
        gameId,
    })

export const pickSide = (
    gameId: string,
    side: 'order' | 'chaos',
    playerIndex: number
) => {
    const orderPlayer = side === 'order' ? playerIndex : -playerIndex + 1
    updateDoc(getGameDoc(gameId), {
        currentPlayer: orderPlayer,
        board: flattenBoard(generateEmptyBoard()),
        orderPlayer,
        lastUpdated: serverTimestamp(),
        hasBegun: true,
    })
}

export const playMarker = (
    gameId: string,
    newBoard: FlattenedBoardState,
    newPlayer: number,
    winningPlayer?: number
) =>
    updateDoc(getGameDoc(gameId), {
        board: newBoard,
        currentPlayer: newPlayer,
        lastUpdated: serverTimestamp(),
        winningPlayer,
    })

export const askForRematch = (gameId: string, playerId: string) => {
    updateDoc(getGameDoc(gameId), {
        wantsRematch: arrayUnion(playerId),
    })
}

export const setupRematch = (gameId: string) =>
    updateDoc(getGameDoc(gameId), {
        playerToPick: Math.floor(Math.random() * 2),
        hasBegun: false,
        board: deleteField(),
        lastUpdated: serverTimestamp(),
        currentPlayer: deleteField(),
        orderPlayer: deleteField(),
        winningPlayer: deleteField(),
        wantsRematch: deleteField(),
    })
