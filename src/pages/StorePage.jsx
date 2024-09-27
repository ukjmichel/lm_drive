import { useEffect } from 'react';
import { useAuth } from '../hook/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BaseLayout } from '../components';

const StorePage = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate('/');
    }
  }, [auth]);

  return (
    <>
      <BaseLayout />
    </>
  );
};
export default StorePage;
