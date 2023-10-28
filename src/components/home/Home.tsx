import React from 'react';
import './Home.scss';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

const Home = () => {
  return (
    <div className='homePage'>
      <h1>ようこそ！</h1>
      <div>
        React, TypeScript, Firebaseを使用して作成したブログサイトです。<br />
        ソースコードは<a href='https://github.com/YamatoKishitaHub/blog' target='_blank'>こちらのGitHubのページ</a>からご覧いただけます。
      </div>
      <div>
        Google、またはGitHubでログインすることで、どなたでもブログを投稿することができます。<br />
        匿名での投稿や投稿後の編集・削除も可能です。<br />
        ぜひお気軽に投稿してください！
      </div>
      <div className='links'>
        <Link to={'/posts'}>
          <Button variant='contained'>投稿一覧を見る</Button>
        </Link>
        <Link to={'/create-post'}>
          <Button variant='contained'>投稿する</Button>
        </Link>
        <Link to={'/create-post'}>
          <Button variant='contained'>ログインする</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
