import React, { useEffect, useState } from 'react';
import './Posts.scss';
import { Timestamp, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';

type Props = {
  isAuth: boolean;
};

type Post = {
  id: string;
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

type Block = {
  text: string;
};

const Posts = ({ isAuth }: Props) => {
  const [postList, setPostList] = useState<Post[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuth && location.pathname === '/profile/posts') {
      navigate('/login', {
        state: {
          pathname: location.pathname,
          fromPage: 'プロフィールを見る',
        },
      });
    }
  }, []);
  
  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(collection(db, 'posts'));
      setPostList(data.docs.map((doc) => ({
        id: doc.id,
        author: doc.data().author,
        title: doc.data().title,
        text: doc.data().text,
        created_at: doc.data().created_at,
        updated_at: doc.data().updated_at,
      })));

      const collectionRef = collection(db, 'posts');
      const collectionRefOrder = query(collectionRef, orderBy('created_at', 'desc'));
      onSnapshot(collectionRefOrder, (snapshot) => {
        const results: Post[] = [];
        if (location.pathname === '/posts') {
          snapshot.docs.forEach((doc) => {
            results.push({
              id: doc.id,
              author: doc.data().author,
              title: doc.data().title,
              text: doc.data().text,
              created_at: doc.data().created_at,
              updated_at: doc.data().updated_at,
            });
          });
        } else if (location.pathname === '/profile/posts') {
          snapshot.docs.forEach((doc) => {
            if (doc.data().author.id === auth.currentUser?.uid) {
              results.push({
                id: doc.id,
                author: doc.data().author,
                title: doc.data().title,
                text: doc.data().text,
                created_at: doc.data().created_at,
                updated_at: doc.data().updated_at,
              });
            }
          });
        }
        setPostList(results);
      });
    };
    getPosts();
    setCurrentPage(1);
  }, [location.pathname]);

  const handleDelete = async (id: string) => {
    const deleteConfirm = window.confirm('この投稿を削除してもよろしいですか？');
    if (deleteConfirm) {
      await deleteDoc(doc(db, 'posts', id));
      const pathname = location.pathname;
      navigate(pathname);
    }
  };

  const handleEdit = async (id: string) => {
    const editConfirm = window.confirm('この投稿を編集しますか？');

    if (editConfirm) {
      const paramsId: string = id;
      const collectionRef = doc(db, 'posts', paramsId);
      const data = await getDoc(collectionRef);
  
      navigate(`/edit-post/${id}`, {
        state: {
          author: data.data()?.author,
          title: data.data()?.title,
          text: data.data()?.text,
          created_at: data.data()?.created_at,
          updated_at: data.data()?.updated_at,
        },
      });
    }
  };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const sizePerPage: number = 6;

  const startIndex = (currentPage - 1) * sizePerPage;
  const endIndex = startIndex + sizePerPage;
  const paginatedPosts = postList.slice(startIndex, endIndex);
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(postList.length / sizePerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(postList.length / sizePerPage); i++) {
    pageNumbers.push(i);
  }

  const handleChangePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='postsPage'>
      <h1>
        {location.pathname === '/profile/posts' && !isAuth && 'あなたの'}
        {location.pathname === '/profile/posts' && isAuth && auth.currentUser?.displayName + 'さんの'}
        投稿一覧
      </h1>
      <div className='goLogin'>
        <div>
          {location.pathname === '/posts' && 'ログインすることで、自身の投稿に限り編集や削除することが可能です。'}
        </div>
        {!isAuth &&
          <Button variant='contained' onClick={() => navigate('/login', { state: location.pathname })}>
            ログインする
          </Button>
        }
      </div>
      {isAuth && paginatedPosts.length === 0 && <div className='noPost'>投稿がありません。</div>}
      {isAuth && paginatedPosts.length !== 0 &&
        <div className='pagination'>
          <Button
            variant='outlined'
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            &lt;
          </Button>
          {pageNumbers.map((pageNumber) => (
            <Button
              variant='outlined'
              key={pageNumber}
              onClick={() => handleChangePage(pageNumber)}
              disabled={currentPage === pageNumber}
            >
              {pageNumber}
            </Button>
          ))}
          <Button
            variant='outlined'
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(postList.length / sizePerPage)}
          >
            &gt;
          </Button>
        </div>
      }
      <div className='posts'>
        {paginatedPosts.map((post: Post) => {
          const jsonData = JSON.parse(post.text);
          const text = jsonData.blocks.map((block: Block) => block.text).join('\n');

          return (
            <div className='container' key={post.id}>
              <div className='editAndDelete'>
                {post.author.id === auth.currentUser?.uid ? (
                  <>
                    <Button variant='contained' onClick={() => handleEdit(post.id)}>
                      <EditIcon fontSize='medium' />編集
                    </Button>
                    <Button variant='contained' sx={{ backgroundColor: 'tomato', ':hover': {backgroundColor: 'orangered'} }} onClick={() => handleDelete(post.id)}>
                      <DeleteIcon fontSize='medium' />削除
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant='contained' disabled>
                      <EditIcon fontSize='medium' />編集
                    </Button>
                    <Button variant='contained' disabled>
                      <DeleteIcon fontSize='medium' />削除
                    </Button>
                  </>
                )}
              </div>
              <h2 className='title'>
                <Link
                  to={`/post/${post.id}`}
                  state={{
                    id: post.id,
                    author: post.author,
                    title: post.title,
                    text: post.text,
                    created_at: new Date(post.created_at?.toDate()).toLocaleString(),
                    updated_at: post.updated_at && new Date(post.updated_at?.toDate()).toLocaleString(),
                  }}
                >
                  {post.title.slice(0, 20)}
                  {post.title.length > 20 && <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...</span>}
                </Link>
              </h2>
              <small className='author'>
                著者： {post.author.anonymous ? '匿名さん' : post.author.username + 'さん'}
              </small>
              <small className='date'>
                {new Date(post.created_at?.toDate()).toLocaleString().slice(0, -3)}
                {post.updated_at && '（最終更新：' + new Date(post.updated_at?.toDate()).toLocaleString().slice(0, -3) + '）'}
              </small>
              <div className='text'>
                {text.slice(0, 55)}
              </div>
              <div className='goDetail'>
                <Link
                  to={`/post/${post.id}`}
                  state={{
                    id: post.id,
                    author: post.author,
                    title: post.title,
                    text: post.text,
                    created_at: new Date(post.created_at?.toDate()).toLocaleString(),
                    updated_at: post.updated_at && new Date(post.updated_at?.toDate()).toLocaleString(),
                  }}
                >
                  ...詳しく見る
                </Link>
              </div>
            </div>
          );
        })}
        {paginatedPosts.length % 2 === 1 && <div className='container hidden'></div>}
      </div>
      {isAuth && paginatedPosts.length !== 0 &&
        <div className='pagination'>
          <Button
            variant='outlined'
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            &lt;
          </Button>
          {pageNumbers.map((pageNumber) => (
            <Button
              variant='outlined'
              key={pageNumber}
              onClick={() => handleChangePage(pageNumber)}
              disabled={currentPage === pageNumber}
            >
              {pageNumber}
            </Button>
          ))}
          <Button
            variant='outlined'
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(postList.length / sizePerPage)}
          >
            &gt;
          </Button>
        </div>
      }
    </div>
  );
};

export default Posts;
