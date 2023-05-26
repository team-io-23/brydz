import { socket } from "../App"
import { Bid, trumpSymbols } from "../../utils"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './BiddingHistory.css';

const cellStyles = {
    textAlign: 'center',
    fontSize: '1.4rem',
}

const headerCellStyles = {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1rem'
}

function BiddingHistory() {
    let bidHistory = JSON.parse(localStorage.getItem(`bid-history-${socket.id}`)!);
    let realBidHistory = bidHistory.slice(1, bidHistory.length);
    console.log(bidHistory);

        function roundRow (round: Array<Bid>) {
            return (
                <TableRow className="row">
                {round.map((bid:Bid) => {
                    return (
                        <TableCell sx={cellStyles}>
                            {bid.value} {trumpSymbols.get(bid.trump)}
                        </TableCell>
                    )
                })}
                </TableRow>
            )
        } 

    return (
        <div className="bidding-history-container">
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                <TableHead>
                    <TableRow className="row header">
                    <TableCell sx={headerCellStyles}>North</TableCell>
                    <TableCell sx={headerCellStyles}>East</TableCell>
                    <TableCell sx={headerCellStyles}>South</TableCell>
                    <TableCell sx={headerCellStyles}>West</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {realBidHistory.map((row: Array<Bid>) => (
                        roundRow(row)
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default BiddingHistory;