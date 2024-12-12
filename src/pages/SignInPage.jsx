import { useNavigate } from 'react-router-dom';
import { BaseLayout, SignInForm } from '../components';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const SignInPage = () => {
  const navigate = useNavigate();
  const { auth, login, isAdmin } = useAuth(); // Use isLoggedIn instead of auth

  useEffect(() => {
    if (auth && !isAdmin) {
      navigate('/store');
    } else if (auth && isAdmin) {
      navigate('/admin/orders');
    }
  }, [auth]);
  return (
    <div>
      <BaseLayout>
        <SignInForm onLogin={login} />
      </BaseLayout>
    </div>
  );
};

export default SignInPage;
