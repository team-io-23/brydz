import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './StartPage.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import NavBar from '../NavBar/NavBar';
import { socket } from '../App';

function StartPage() {
    const [nickname, setNickname] = useState<string>("");

    const navigate = useNavigate();

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
                />
            </div>
        );
    }

    function JoinButton() {
        function handleJoin(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
            localStorage.setItem("nickname", nickname);
            socket.emit("joining-room", nickname);
            socket.on("joined-room", (room: string) => {
                localStorage.setItem("room", room);
                console.log("Joined room: " + localStorage.getItem("room"));
                navigate("/room");
            });
        }

        return (
            <Button
                variant="contained"
                onClick={handleJoin}
                className='StartPage-JoinButton'
            >
                Join
            </Button>
        );
    }

    return (
        <div className='StartPage'>
            <NavBar/>
            <div className='StartPage-Input'>
                <NicknameInputField />
                <JoinButton />
            </div>
        </div>
    );
}

export default StartPage;