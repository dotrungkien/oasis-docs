import React, { useState, useMemo, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const accessToken = localStorage.getItem('oasis-docs-token');
    setLoggedIn(!!accessToken);
  }, []);

  useMemo(() => {
    if (window.location.pathname !== '/') {
      this.props.history.push('/');
    }
  }, []);

  const onGetStartedClick = () => {
    if (!loggedIn) {
      history.push('/signin');
    } else {
      history.push('/myfiles');
    }
  };

  return (
    <div className='Landing'>
      <section className='header'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-6'>
              <div className='section-title mt-5'>Oasis Docs</div>
              <div className='head-text'>Secure Documents</div>
              <div className='description-text mt-4'>Store and Secure your documents</div>
              <button className='upload-file-btn my-5' onClick={onGetStartedClick}>
                GET STARTED
              </button>
            </div>
            <div className='col-lg-6 d-none d-lg-block py-2 home-img'>
              <img alt='img' src='./privacy.png'></img>
            </div>
          </div>
          <div className='row py-5'>
            <div className='col-12'>
              <div className='section-title features-title'>HIGHLIGHTS</div>
            </div>
          </div>
        </div>
      </section>
      <section className='features'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-4 feature-item'>
              <div className='feature-icon'>
                <img alt='img' src='./Icons/controls.png'></img>
              </div>
              <div className='feature-title'>Unlimited uploads</div>
              <div className='feature-description'>
                Use the Oasis storage for free with unlimited uploads.
              </div>
            </div>
            <div className='col-lg-4 feature-item'>
              <div className='feature-icon'>
                <img alt='img' src='./Icons/storage.png'></img>
              </div>
              <div className='feature-title'>Never Lose your Documents</div>
              <div className='feature-description'>
                All documents and notes are permanently stored in your own private data storage.
              </div>
            </div>
            <div className='col-lg-4 feature-item'>
              <div className='feature-icon'>
                <img alt='img' src='./Icons/access_history.png'></img>
              </div>
              <div className='feature-title'>Secure &amp; Encrypted</div>
              <div className='feature-description'>
                No one but you has access to your documents. All your files are stored and encrypted
                with keys only you control.
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='footer'>
        <div className='container'>
          <hr></hr>
          <div className='footer-text text-left mb-4'> Oasis Docs Project</div>
        </div>
      </section>
    </div>
  );
};
export default withRouter(Landing);
