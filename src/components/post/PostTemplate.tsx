import React, { useState } from 'react';
import './PostTemplate.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { onAuthStateChanged } from 'firebase/auth';
import { Editor, EditorState, convertFromRaw } from 'draft-js';

const PostTemplate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { id, author, title, text, created_at, updated_at } = location.state;
  const [uid, setUid] = useState<string | undefined>();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUid(auth.currentUser?.uid);
    }
  });

  const handleDelete = async (id: string) => {
    const deleteConfirm = window.confirm('この投稿を削除してもよろしいですか？');
    if (deleteConfirm) {
      await deleteDoc(doc(db, 'posts', id));
      navigate('/posts');
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-post/${id}`, {
      state: {
        author: author,
        title: title,
        text: text,
        created_at: created_at,
        updated_at: updated_at,
      },
    });
  };
  
  return (
    <div className='postTemplatePage'>
      <h1 className='title'>{title}</h1>
      <div className='author'>
        著者：{author.anonymous ? '匿名さん' : author.username + 'さん'}
      </div>
      <div className='date'>{created_at.slice(0, -3)}</div>
      <div className='date'>{updated_at && '（最終更新：' + updated_at.slice(0, -3) + '）'}</div>
      <div className='text'>
        <Editor
          editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(text)))}
          readOnly={true}
          onChange={(newEditorState) => {}}
        />
      </div>
      <div className='editAndDelete'>
        {author.id === uid ?
          <>
            <Button variant='contained' onClick={() => handleEdit(id)}>
              <EditIcon fontSize='medium' />編集する
            </Button>
            <Button variant='contained' sx={{ backgroundColor: 'tomato', ":hover": {backgroundColor: 'orangered'} }} onClick={() => handleDelete(id)}>
              <DeleteIcon fontSize='medium' />削除する
            </Button>
          </> :
          <>
            <Button variant='contained' disabled>
              <EditIcon fontSize='medium' />編集する
            </Button>
            <Button variant='contained' disabled>
              <DeleteIcon fontSize='medium' />削除する
            </Button>
          </>
        }
      </div>
      <Link to={'/posts'}>
        <Button variant='contained'>投稿一覧に戻る</Button>
      </Link>
    </div>
  );
};

export default PostTemplate;
