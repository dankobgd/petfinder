import React from 'react';
import Toast from './Toast';
import { useSelector, useDispatch } from 'react-redux';
import { toastActions } from '../../redux/toast';

function Toasts() {
  const dispatch = useDispatch();
  const toasts = useSelector(state => state.toast);

  return (
    <div>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} removeToast={() => dispatch(toastActions.removeToast(toast.id))} />
      ))}
    </div>
  );
}

export default Toasts;
