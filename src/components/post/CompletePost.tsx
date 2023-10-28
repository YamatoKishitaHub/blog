import React from 'react';
import './CompletePost.scss';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@mui/material';

const CompletePost = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className='completePostPage'>
      {pathname === '/complete-post' && <h1>投稿が完了しました。</h1>}
      {pathname === '/complete-edit' && <h1>編集を保存しました。</h1>}
      <Link to={'/posts'}>
        <Button variant='contained'>投稿一覧を見る</Button>
      </Link>
    </div>
  );
};

export default CompletePost;
