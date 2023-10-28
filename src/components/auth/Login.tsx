import React, { useEffect, useState } from 'react';
import './Login.scss';
import { GithubAuthProvider, getAdditionalUserInfo, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../../firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

type Props = {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
};

type State = {
  pathname?: string;
  fromPage?: string;
  anonymous?: boolean;
  title?: string;
  text?: string;
};

const Login = ({ setIsAuth }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [fromPage, setFromPage] = useState<string>();

  useEffect(() => {
    const state = location.state as State;
    setFromPage(state?.fromPage);
  }, []);

  const loginInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        localStorage.setItem('isAuth', 'true');
        setIsAuth(true);

        const state = location.state as State;
        const url = state?.pathname as string;
        const anonymous = state?.anonymous as boolean;
        const title = state?.title as string;
        const text = state?.text as string;
        if (url) {
          if (url === '/create-post') {
            navigate(url, {
              state: {
                anonymous: anonymous,
                title: title,
                text: text,
              },
            })
          } else {
            navigate(url);
          }
        } else {
          navigate('/');
        }
      });
  };

  const loginInWithGitHub = () => {
    signInWithPopup(auth, githubProvider)
      .then((result) => {
        const credential = GithubAuthProvider.credentialFromResult(result);
        // const token = credential?.accessToken;
        const details = getAdditionalUserInfo(result);
        const user = result.user;

        updateProfile(user, {
          displayName: details?.username,
        });

        localStorage.setItem('isAuth', 'true');
        setIsAuth(true);

        const state = location.state as State;
        const url = state?.pathname as string;
        const anonymous = state?.anonymous as boolean;
        const title = state?.title as string;
        const text = state?.text as string;
        if (url) {
          if (url === '/create-post') {
            navigate(url, {
              state: {
                anonymous: anonymous,
                title: title,
                text: text,
              },
            })
          } else {
            navigate(url);
          }
        } else {
          navigate('/');
        }
      });
  };

  return (
    <div className='loginPage'>
      <h1>ログインする</h1>
      {fromPage && <div>{fromPage}にはログインが必要です。</div>}
      <div className='loginButtons'>
        <Button variant='contained' onClick={loginInWithGoogle}>
          <GoogleIcon />
          Googleでログイン
        </Button>
        <Button variant='contained' onClick={loginInWithGitHub}>
          <GitHubIcon />
          GitHubでログイン
        </Button>
      </div>
    </div>
  );
};

export default Login;
