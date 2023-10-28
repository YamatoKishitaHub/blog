import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import './CreatePost.scss';
import { Button } from '@mui/material';
import TextEditor from './TextEditor';

type Props = {
  isAuth: boolean;
};

type State = {
  anonymous?: boolean;
  title?: string;
  text?: string;
};

const CreatePost = ({ isAuth }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as State;
  const beforeAnonymous = state?.anonymous as boolean;
  const beforeTitle = state?.title as string;
  const beforeText = state?.text as string;
  
  const [anonymous, setAnonymous] = useState<boolean>(beforeAnonymous ? beforeAnonymous : false);
  const [title, setTitle] = useState<string>(beforeTitle);
  const [text, setText] = useState<string>(beforeText);

  const createPost = async () => {
    if (!isAuth) {
      navigate('/login', {
        state: {
          pathname: location.pathname,
          fromPage: '投稿',
          anonymous: anonymous,
          title: title,
          text: text,
        },
      });
    } else {
      if (title && text) {
        await addDoc(collection(db, 'posts'), {
          author: {
            username: auth.currentUser?.displayName,
            id: auth.currentUser?.uid,
            anonymous: anonymous,
          },
          title: title,
          text: text,
          created_at: serverTimestamp(),
          updated_at: null,
        });
    
        navigate('/complete-post');
      } else {
        alert('タイトルと投稿内容を記入してください。');
      }
    }
  };

  useEffect(() => {
    const confirmBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return;
    };

    window.addEventListener('beforeunload', confirmBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', confirmBeforeUnload);
    };
  }, []);

  const goPosts = () => {
    if (anonymous || title || text) {
      const navigateConfirm = window.confirm('記入した内容は削除されます。投稿一覧ページに戻ってよろしいですか？');
      if (navigateConfirm) {
        navigate('/posts');
      }
    } else {
      navigate('/posts');
    }
  };

  return (
    <div className='createPostPage'>
      <h1>記事を投稿する</h1>
      <form>
        <input
          type='checkbox'
          id='anonymous'
          defaultChecked={beforeAnonymous}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => (setAnonymous(e.target.checked))}
        />
        <h2>
          <label htmlFor='anonymous'>
            匿名で投稿する
          </label>
        </h2>
      </form>
      <div>
        <h2>タイトル</h2>
        <input
          type='text'
          placeholder='タイトルを記入してください。'
          defaultValue={beforeTitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <h2>投稿内容</h2>
        <TextEditor setText={setText} beforeText={beforeText} />
      </div>
      <Button variant='contained' onClick={createPost}>投稿する</Button>
      <Button
        variant='contained'
        sx={{ backgroundColor: 'gray', ":hover": { backgroundColor: 'gray' }}}
        onClick={goPosts}
      >
        投稿一覧に戻る
      </Button>
    </div>
  );
};

export default CreatePost;
