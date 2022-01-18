import { Box } from '@mui/material'
import styled from 'styled-components'

export const CellBox = styled(Box)<{ isHovering: boolean }>`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-width: 2px;
    border-style: solid;
    margin: 0;
    flex: 1;
    ${(p) => p.isHovering && 'cursor: pointer'}
`

export const ContainerBox = styled(Box)`
    border-width: 2px;
    border-style: solid;
    &:after {
        content: '';
        display: block;
        padding-bottom: 100%;
    }
`

export const Marker = styled(Box)<{ color: string; ghost?: boolean }>`
    background-color: ${(p) => p.color};
    border-radius: 50%;
    border-width: 5px;
    border-style: solid;
    width: 90%;
    height: 90%;
    ${(p) =>
        p.ghost &&
        `
    opacity: 0.5;
    box-shadow: 0 0 6px ${p.color};
`};
`

export const SelectionMarker = styled(Marker)<{
    color: string
    isSelected: boolean
}>`
    width: 64px;
    height: 64px;
    cursor: pointer;

    ${(p) => !p.isSelected && `opacity: 0.5`};

    &:hover {
        /* opacity: 0.5; */
        box-shadow: 0 0 6px ${(p) => p.color};
    }
`

const straightLength = 'calc(67% + 12px)'
const diagonalLength = 'calc(94% + 12px)'

const posToPercentage = (pos: number) => `${pos * (100 / 6) + 100 / 6 / 2}%`

export type Direction =
    | 'horizontal'
    | 'vertical'
    | 'diagonal'
    | 'reverseDiagonal'
const directionToRotation: Record<Direction, string> = {
    horizontal: '0deg',
    vertical: '90deg',
    diagonal: '45deg',
    reverseDiagonal: '135deg',
}

const WinLineColor = 'green'

export const WinLine = styled(Box)<{
    row: number
    col: number
    direction: Direction
}>`
    position: absolute;
    top: ${(p) => posToPercentage(p.row)};
    left: ${(p) => posToPercentage(p.col)};
    width: ${(p) =>
        p.direction === 'horizontal' || p.direction === 'vertical'
            ? straightLength
            : diagonalLength};
    background-color: ${WinLineColor};
    height: 12px;
    transform-origin: 6px 6px;
    transform: translate(-6px, -6px)
        rotate(${(p) => directionToRotation[p.direction]});

    opacity: 0.8;
    box-shadow: 0 0 6px ${WinLineColor};
    border-radius: 1000px;
`
