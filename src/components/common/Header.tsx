import './Header.scss';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar } from '@mui/material';
import { auth } from '../../firebase';

type Props = {
  isAuth: boolean;
  photoURL?: string | null;
};

const Header = ({ isAuth, photoURL }: Props) => {
  const location = useLocation();

  const handleLinkClick = (e: React.MouseEvent, page: string) => {
    if (location.pathname === '/create-post' && page === '投稿') {
      return;
    }
    handleNavigateConfirm(e, page);
  }

  const handleLoginLinkClick = (e: React.MouseEvent, page: string) => {
    handleNavigateConfirm(e, page);
    if (location.pathname === '/login') {
      window.location.reload();
    }
  };

  const handleNavigateConfirm = (e: React.MouseEvent, page: string) => {
    const editPostPath = /^\/edit-post\/[a-zA-Z0-9]+$/;
    if (location.pathname === '/create-post' || editPostPath.test(location.pathname)) {
      const navigateConfirm = window.confirm(`記入した内容は保存されません。${page}ページに遷移してよろしいですか？`);
      if (!navigateConfirm) {
        e.preventDefault();
      }
    }
  }
  
  return (
    <header>
      <nav>
        <Link to={'/'} onClick={(e) => handleLinkClick(e, 'ホーム')}>
          <HomeIcon />
          <span>ホーム</span>
        </Link>
        <Link to={'/posts'} onClick={(e) => handleLinkClick(e, '投稿一覧')}>
          <ListIcon />
          <span>投稿一覧</span>
        </Link>
        <Link to={'/create-post'} onClick={(e) => handleLinkClick(e, '投稿')}>
          <EditIcon />
          <span>投稿する</span>
        </Link>
        <Link to={'/profile/posts'} onClick={(e) => handleLinkClick(e, 'プロフィール')}>
          {!isAuth ? (
            <>
              <AccountCircleIcon />
              <span>ゲスト</span>
            </>
          ) : (
            <>
              {photoURL && <Avatar src={photoURL} alt='Googleアイコン' sx={{ width: 30, height: 30 }} />}
              <span>{auth.currentUser?.displayName}</span>
            </>
          )}
        </Link>
        {!isAuth ? (
          <Link to={'/login'} onClick={(e) => handleLoginLinkClick(e, 'ログイン')}>
            <LoginIcon />
            <span>ログイン</span>
          </Link>
        ) : (
          <Link to={'/logout'} onClick={(e) => handleLinkClick(e, 'ログアウト')}>
            <LogoutIcon />
            <span>ログアウト</span>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
