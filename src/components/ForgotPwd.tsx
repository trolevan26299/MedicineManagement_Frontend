import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { login } from '../Definition/common.dto';
import * as actions from '../Redux/actions';
import '../assets/css/stylesForgotPwd.css';
import forgotPwd from '../assets/images/forgotpwd.jpg';
import { requestApi } from '../helpers/api';

const ForgotPwd = () => {
  const dispatch = useDispatch();
  const [formError, setFormError] = useState<login>({});
  const [loginData, setLoginData] = useState<login>({});
  const [isSubmited, setIsSubmited] = useState<boolean>(false);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const error: login = {};
    if (loginData.email === '' || loginData.email === undefined) {
      error.email = 'Please enter email !';
    } else {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email);
      if (!valid) error.email = 'Email is not valid !';
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
    const valid = validateForm();
    if (valid) {
      dispatch(actions.controlLoading(true));
      requestApi('/auth/forget-password', 'POST', loginData)
        .then((res) => {
          dispatch(actions.controlLoading(false));
          toast.success(res.data, { position: 'top-center', autoClose: 2000 });
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        })
        .catch((err) => {
          dispatch(actions.controlLoading(false));
          if (err.response.data.statusCode === 401) {
            toast.error(err.response.data.message, {
              position: 'top-right',
            });
          }
        });
    }
    setIsSubmited(true);
  };

  useEffect(() => {
    if (isSubmited) {
      validateForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginData]);
  return (
    <div className="box-form-forgot">
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img src={forgotPwd} width="50%" height="100%" />
      <div className="form-input-forgot">
        <form className="forgot-pwd-form">
          <div>
            <h2 className="title-form-forgot">Forgot Password</h2>
            <div className="input-field input-field-forget-pwd">
              <i className="fas fa-user" style={{ marginLeft: '10px' }}></i>
              <input
                className="form-control "
                type="email"
                name="email"
                onChange={onChange}
                placeholder="Address your email"
                // onKeyPress={(event) => {
                //   if (event.key === 'Enter') {
                //     onSubmit();
                //   }
                // }}
              />
            </div>
            {formError.email && (
              <div className="input-err">
                <p style={{ color: 'red' }}>{formError.email}</p>
              </div>
            )}
            <button
              className="btn btn-primary btn-sign"
              type="button"
              style={{ width: '100%', marginTop: '30px' }}
              onClick={onSubmit}
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPwd;
