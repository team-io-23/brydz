import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import './StartPage.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import NavBar from '../NavBar/NavBar';
import { socket } from '../App';
import { joinRoom } from '../../utils';

function StartPage() {
    const [nickname, setNickname] = useState<string>("");

    const navigate = useNavigate();

    const { roomLink } = useParams();

    const handleJoin = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log(socket.id);
        console.log("Setting nickname: " + nickname);
        localStorage.setItem(`nickname-${socket.id}`, nickname);
        socket.emit("entered", nickname);
        if (roomLink != undefined) {
            joinRoom(+roomLink, navigate);
            return;
        }

        navigate("/MainMenu");
        socket.emit("get-roomlist");
        return;
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleJoin(event as any);
        }
    }

    function NicknameInputField() {
        return (
            <div className='StartPage-NicknameInputFieldWrapper'>
                <TextField
                    autoFocus
                    label="Join as"
                    type="text"
                    className='StartPage-NicknameInputField'
                    value={nickname}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setNickname(event.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
        );
    }

    return (
        <div className='StartPage'>
            <NavBar/>
            <div className='StartPage-Input'>
                <NicknameInputField />
                <Button
                    variant="contained"
                    onClick={handleJoin}
                    className='StartPage-JoinButton'
                >
                    Join
                </Button>
            </div>
        </div>
    );
}

export default StartPage;
