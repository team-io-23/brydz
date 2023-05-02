import React, { ChangeEvent, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './StartPage.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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
                value = {nickname}
                onChange = {(event: ChangeEvent<HTMLInputElement>) => setNickname(event.target.value)}
            />
            </div>
        );
    }
    
    function JoinButton() {
        function handleJoin(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
            localStorage.setItem("nickname", nickname);
            navigate("/room");
        }
    
        return (
            <Button
                variant = "contained"
                onClick = {handleJoin}
                className = 'StartPage-JoinButton'
            >
                Join
            </Button>
        );
    }

    return (
        <div className='StartPage'>
            <div className='StartPage-Input'>
                <NicknameInputField/>
                <JoinButton/>
            </div>
        </div>
    );
}

export default StartPage;