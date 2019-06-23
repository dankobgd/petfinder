import { message } from 'antd';

function Toast({ msg, type, removeToast }) {
  message.config({
    top: 80,
    duration: 3,
  });

  const onClose = () => removeToast();

  switch (type) {
    case 'success':
      message.success(msg, onClose);
      break;
    case 'error':
      message.error(msg, onClose);
      break;
    default:
      message.info(msg, onClose);
  }

  return null;
}

export default Toast;
