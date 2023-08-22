/* eslint-disable jsx-a11y/label-has-associated-control */
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { login } from '../Definition/common.dto';
import * as actions from '../Redux/actions';
import { requestApi } from '../helpers/api';
import '../assets/css/stylesLogin.css';
import signin from '../assets/images/signup.svg';

const Login = () => {
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState<login>({});
  const [formError, setFormError] = useState<login>({});
  const [isSubmited, setIsSubmited] = useState<boolean>(false);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };
  const valideteForm = () => {
    let isValid = true;
    const error: login = {};
    if (loginData.email === '' || loginData.email === undefined) {
      error.email = 'Please enter email !';
    } else {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email);
      if (!valid) error.email = 'Email is not valid !';
    }
    if (loginData.password === '' || loginData.password === undefined) {
      error.password = 'Please enter password!';
    }
    if (Object.keys(error).length > 0) {
      setFormError(error);
      isValid = false;
    } else {
      setFormError({});
    }
    return isValid;
  };

  const onSubmit = () => {
    const valid = valideteForm();
    if (valid) {
      dispatch(actions.controlLoading(true));
      requestApi('/auth/login', 'POST', loginData)
        .then((res) => {
          localStorage.setItem('ACCESS_TOKEN', res.data.access_token);
          localStorage.setItem('REFRESH_TOKEN', res.data.refresh_token);
          dispatch(actions.controlLoading(false));
          window.location.href = '/';
        })
        .catch((err) => {
          dispatch(actions.controlLoading(false));
          console.log(err);
          if (typeof err.response !== undefined) {
            if (err.response.status !== 201) {
              toast.error(err.response.data.message, {
                position: 'top-right',
              });
            }
          } else {
            toast.error('Server is down.Please try again!', {
              position: 'top-right',
            });
          }
        });
    }
    setIsSubmited(true);
  };

  useEffect(() => {
    if (isSubmited) {
      valideteForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginData]);

  return (
    <div className="header">
      <div className="forms-container">
        <div className="signin-signup">
          <form className="sign-in-form">
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-user" style={{ marginLeft: '10px' }}></i>
              <input
                className="form-control"
                type="email"
                name="email"
                onChange={onChange}
                placeholder="name@example.com"
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    onSubmit();
                  }
                }}
              />
            </div>
            {formError.email && (
              <div className="input-err">
                <p style={{ color: 'red' }}>{formError.email}</p>
              </div>
            )}
            <div className="input-field">
              <i className="fas fa-lock" style={{ marginLeft: '10px' }}></i>
              <input
                className="form-control"
                type="password"
                onChange={onChange}
                name="password"
                placeholder="Password"
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    onSubmit();
                  }
                }}
              />
            </div>
            {formError.password && (
              <div className="input-err">
                <p style={{ color: 'red' }}>{formError.password}</p>
              </div>
            )}
            <button className="btn btn-primary btn-sign" type="button" onClick={onSubmit}>
              Sign in
            </button>
          </form>
          <div>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a style={{ color: 'blue', position: 'absolute', left: '55%', top: '100%' }}>Forget Password ?</a>
          </div>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <img src={signin} className="image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login;
