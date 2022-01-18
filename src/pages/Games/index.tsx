import React from 'react'
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import OrderAndChaos, { OrderAndChaosRoutes } from './OrderAndChaos'
import { Route } from '../../Router'

const GameInfo = [
    {
        name: 'Order and Chaos',
        description:
            'Två spelare, fem-i-rad på ett 6x6 bräde. Båda spelarna styr båda färger. En spelare ("Order") försöker få fem i rad med någon färg. Den andra spelaren ("Kaos") försöker stoppa Order från att uppnå sitt mål.',
        path: '/games/order-and-chaos',
        component: <OrderAndChaos />,
    },
]

export const GameRoutes: Route[] = GameInfo.map((game) => ({
    label: game.name,
    path: game.path,
    component: game.component,
})).concat(OrderAndChaosRoutes)

const Games = () => {
    const navigate = useNavigate()

    return (
        <Box>
            {GameInfo.map((game) => (
                // Card with game info
                <Card key={game.name}>
                    <CardActionArea onClick={() => navigate(game.path)}>
                        <CardContent>
                            <Typography variant="h3" sx={{ marginBottom: 2 }}>
                                {game.name}
                            </Typography>
                            <Typography variant="body1">
                                {game.description}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            ))}
        </Box>
    )
}

export default Games
