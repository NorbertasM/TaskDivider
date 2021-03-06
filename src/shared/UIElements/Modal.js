import { CSSTransition }  from 'react-transition-group'
import React              from 'react'
import ReactDOM           from 'react-dom'

import Backdrop           from './Backdrop'
import styles             from './Modal.module.css'

const ModalOverlay = (props) => {
  const content = (
    <div className={`${styles.modal} ${props.className}`} style={props.style}>
      <header className={`${styles.modalHeader} ${props.headerClass}`}>
        <h4>{props.header}</h4>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
        }
        onCancel={props.onCancel}
      >
        <div className={`${styles.modalContent} ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`${styles.modalFooter} ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  )
  return ReactDOM.createPortal(content, document.getElementById('modal-hook'))
}

const Modal = (props) => {
  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={50}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  )
}

export default Modal
