// import { nanoid } from 'nanoid';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Overlay } from './Modal.styled';

import { createPortal } from 'react-dom';
const ModalRoot = document.getElementById('modal-root');

export function ModalHook({ onClose, children }) {
  const handleBackdropCLick = e => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <Overlay onClick={handleBackdropCLick}>{children}</Overlay>,
    ModalRoot
  );
}

ModalHook.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

// class Modal extends Component {
//   componentDidMount() {
//     window.addEventListener('keydown', this.handleKeyDown);
//   }
//   componentWillUnmount() {
//     window.removeEventListener('keydown', this.handleKeyDown);
//   }
//   handleKeyDown = e => {
//     if (e.code === 'Escape') {
//       this.props.onClose();
//     }
//   };
//   handleBackdropCLick = e => {
//     if (e.currentTarget === e.target) {
//       this.props.onClose();
//     }
//   };
//   render() {
//     return createPortal(
//       <Overlay onClick={this.handleBackdropCLick}>
//         {this.props.children}
//       </Overlay>,
//       ModalRoot
//     );
//   }
// }

// export default Modal;
