import { useNavigate } from 'react-router-dom';
import { BaseLayout, SignUpForm } from '../components';
import { useAuth } from '../hook/AuthContext';
import { useEffect } from 'react';

const SignInPage = () => {
  const navigate = useNavigate();
  const { auth } = useAuth(); // Use isLoggedIn instead of auth

  useEffect(() => {
    if (auth) {
      navigate('/store');
    }
  }, [auth]);
  return (
    <div>
      <BaseLayout>
        <SignUpForm />
      </BaseLayout>
    </div>
  );
};
export default SignInPage;
