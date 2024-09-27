import { useNavigate } from 'react-router-dom';
import { BaseLayout, SignInForm } from '../components';
import { useAuth } from '../hook/AuthContext';
import { useEffect } from 'react';

const SignInPage = () => {
  const navigate = useNavigate();
  const { auth, login } = useAuth(); // Use isLoggedIn instead of auth
  
  useEffect(() => {
    if (auth) {
      navigate('/store');
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
