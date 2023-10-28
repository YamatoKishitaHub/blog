import { signOut } from 'firebase/auth';
import React from 'react';
import './Logout.scss';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

type Props = {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
};

const Logout = ({ setIsAuth }: Props) => {
  const navigate = useNavigate();

  const logout = () => {
    signOut(auth).then((result) => {
      localStorage.clear();
      setIsAuth(false);
      navigate('/login');
    });
  };

  return (
    <div className='logoutPage'>
      <h1>ログアウトする</h1>
      <Button variant='contained' onClick={logout}>ログアウト</Button>
    </div>
  );
};

export default Logout;
