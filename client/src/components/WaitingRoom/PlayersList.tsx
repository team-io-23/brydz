import { socket } from "../App"
import { Bid, trumpSymbols } from "../../utils"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const cellStyles = {
    textAlign: 'center',
    fontSize: '1.15rem',
}

const headerCellStyles = {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1.5rem'
}

interface PlayersListProps {
    players: Array<string>;
}

function PlayersList(props: PlayersListProps) {
    return (
        <div className='player-list-container'>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                <TableHead>
                    <TableRow className="row header">
                    <TableCell sx={headerCellStyles}>Players</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.players.map((player: string) => (
                        <TableRow className="row">
                            <TableCell sx={cellStyles}>
                                {player}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default PlayersList