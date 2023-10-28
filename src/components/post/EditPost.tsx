import React, { useEffect, useState } from 'react';
import './EditPost.scss';
import { Button } from '@mui/material';
import { DocumentData, Timestamp, doc, serverTimestamp, updateDoc, DocumentReference } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TextEditor from './TextEditor';

type State = {
  author: {
    id: string;
    username: string;
    anonymous: boolean;
  };
  title: string;
  text: string;
  created_at: Timestamp;
  updated_at: Timestamp | null;
};

const EditPost = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const location = useLocation();

  const [anonymous, setAnonymous] = useState<boolean>();
  const [title, setTitle] = useState<string>();
  const [text, setText] = useState<string>();

  useEffect(() => {
    const state = location.state as State;
    setAnonymous(state.author.anonymous);
    setTitle(state.title);
    setText(state.text);
  }, []);

  let collectionRef: DocumentReference<DocumentData>;
  if (params.id) {
    collectionRef = doc(db, 'posts', params.id);
  }

  const editPost = async () => {
    if (title && text) {
      updateDoc(collectionRef,  {
        author: {
          username: auth.currentUser?.displayName,
          id: auth.currentUser?.uid,
          anonymous: anonymous,
        },
        title: title,
        text: text,
        updated_at: serverTimestamp(),
      });

      navigate('../complete-edit');
    } else {
      alert('タイトルと投稿内容を記入してください。');
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
    if (title || text) {
      const navigateConfirm = window.confirm('編集は保存されません。投稿一覧ページに戻ってよろしいですか？');
      if (navigateConfirm) {
        navigate('/posts');
      }
    } else {
      navigate('/posts');
    }
  };

  return (
    <div className='editPostPage'>
      <h1>記事を編集する</h1>
      <form>
        <input
          type='checkbox'
          id='anonymous'
          defaultChecked={location.state.author.anonymous}
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
          placeholder='タイトルを記入'
          defaultValue={location.state.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <h2>投稿内容</h2>
        {/* <textarea
          placeholder='投稿内容を記入'
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value.replaceAll('\n', '\\n'))}
        >
          {location.state.text.replaceAll('\\n', '\n')}
        </textarea> */}
        <TextEditor setText={setText} beforeText={text} />
      </div>
      <Button variant='contained' onClick={() => editPost()}>編集を保存する</Button>
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

export default EditPost;
