import './SignIn.css';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { withRouter } from 'react-router-dom';
import { config } from './config';
import { OidcClient, Log } from 'oidc-client';

const SignIn = () => {
  const [showModal, setShowModal] = useState(false);

  const obtainIdToken = async () => {
    Log.logger = console;
    Log.level = Log.DEBUG;
    const oidcClient = new OidcClient(config);
    const request = await oidcClient.createSigninRequest();
    window.location.assign(request.url);
  };

  const accessToken = localStorage.getItem('oasis-docs-token');

  if (!!accessToken) return <Redirect to={`/myfiles`} />;
  return (
    <div>
      <section className='text-center'>
        <div className='container'>
          <div className='jumbotron signin-box row'>
            <div className='col-sm-12 signin-logo'>
              <a href='/'>
                <img src='/logo.png' alt='Safe Notes' />
              </a>
            </div>
            <div className='col-sm-12'>
              <button type='button' className='upload-file-btn signin-btn' onClick={obtainIdToken}>
                Oasis Signin
              </button>
            </div>
            <div className='what-is-oasis col-sm-12'>
              <span onClick={() => setShowModal(true)}>Learn more about Oasis</span>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Oasis - User Privacy Made Easy</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>
                  From invasive ad targeting to massive data breaches, users are more concerned than
                  ever with keeping their data private and secure.
                </p>
                <p>
                  With just a few lines of code, Oasis gives your users control of their data —
                  allowing you to increase customer trust and grow your business, while reducing
                  risk of a data breach or regulatory impact.
                </p>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default withRouter(SignIn);
