import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    getFirestore,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore'
import { CellState, FlattenedBoardState, Lobby } from './types'

const db = getFirestore()

const base = 'games/order-and-chaos'

const generateEmptyBoard = (width: number, height: number) =>
    new Array(height)
        .fill(0)
        .map((_, i) =>
            new Array(width).fill(0).map(() => 'empty')
        ) as CellState[][]

export const flattenBoard = (board: CellState[][]) =>
    board.reduce((acc, row) => [...acc, ...row], [])

export const unflattenBoard = (board: FlattenedBoardState, width: number) =>
    board.reduce((acc: CellState[][], _, i) => {
        if (i % width === 0) {
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
    updateDoc(doc(db, `${base}/lobbies/${lobbyId}`), {
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
    updateDoc(doc(db, `${base}/lobbies/${lobbyId}`), {
        gameId,
    })

export const pickSide = (
    gameId: string,
    side: 'order' | 'chaos',
    playerIndex: number,
    width: number,
    height: number
) => {
    const orderPlayer = side === 'order' ? playerIndex : playerIndex * 2 - 1
    updateDoc(doc(db, `${base}/games/${gameId}`), {
        currentPlayer: orderPlayer,
        board: flattenBoard(generateEmptyBoard(width, height)),
        orderPlayer,
        lastUpdated: serverTimestamp(),
    })
}

export const playMarker = (
    gameId: string,
    newBoard: FlattenedBoardState,
    newPlayer: number,
    hasWon?: boolean
) =>
    updateDoc(doc(db, `${base}/games/${gameId}`), {
        board: newBoard,
        currentPlayer: newPlayer,
        lastUpdated: serverTimestamp(),
        hasWon,
    })
