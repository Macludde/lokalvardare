import {
    AppBar,
    Box,
    Button,
    Container,
    Divider,
    Drawer,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Toolbar,
    Typography,
} from '@mui/material'
import React from 'react'

const drawerWidth = 240

const Layout: React.FC = ({ children }) => {
    return (
        <Container>
            <Grid container>
                <Grid
                    item
                    xs={12}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingY: 2,
                        paddingX: 2,
                        marginBottom: 4,
                    }}
                >
                    <Typography variant="h6" noWrap component="div">
                        Lokalvårdarna
                    </Typography>
                    <Typography variant="h6" noWrap component="div">
                        Lokalvårdarna
                    </Typography>
                </Grid>
                <Grid item xs>
                    <Paper>
                        <List disablePadding>
                            <ListItem button key="Memes" divider>
                                <ListItemText primary="Memes" />
                            </ListItem>
                            <ListItem button key="Gyckel">
                                <ListItemText primary="Gyckel" />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>{' '}
                <Grid item xs={8} sx={{ textAlign: 'center' }}>
                    {children}
                </Grid>
                <Grid item xs />
            </Grid>
        </Container>
    )
}

export default Layout
