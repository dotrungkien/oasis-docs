import './NavBar.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UploaderHandler from './UploaderHandler';
import { withRouter, useHistory } from 'react-router-dom';

const NavBar = ({ setFile, setLoading, setUploading, signOut }) => {
  const [address, setAddress] = useState(null);
  const [selectFile, setSelectFile] = useState(false);
  const [savingFile, setSavingFile] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const localAddress = localStorage.getItem('oasis-docs-address');
    if (!!localAddress) setAddress(localAddress);
    else setAddress('');
  }, [address]);

  const handleSelectClick = e => {
    e.preventDefault();
    if (!!address) {
      setSelectFile(true);
    } else {
      history.push('/signin');
    }
  };

  if (window.location.pathname.startsWith('/signin')) {
    return <div></div>;
  }
  return (
    <nav className='navbar navbar-expand-lg navbar-dark fixed-top'>
      <div className='container'>
        <UploaderHandler
          clearInput={() => setSelectFile(false)}
          setFile={result => setFile(result)}
          clicked={selectFile}
          setActionRealized={() => setSelectFile(false)}
          setUploading={status => {
            setUploading(status);
            setLoading(status ? 'Uploading...' : null);
          }}
        ></UploaderHandler>
        <Link className='navbar-brand d-flex align-items-center clickable' to={`/`}>
          <img src='/logo.png' alt='Safe Notes' />
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#navbarResponsive'
          aria-controls='navbarResponsive'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarResponsive'>
          <ul className='navbar-nav mr-auto ml-lg-2'>
            {address && (
              <li
                className={
                  window.location.pathname.startsWith('/myfiles')
                    ? 'nav-item mx-lg-2 active'
                    : 'nav-item mx-lg-2'
                }
              >
                <Link className='nav-link link-nav clickable' to={`/myfiles`}>
                  MY FILES
                </Link>
              </li>
            )}
          </ul>
          <ul className='navbar-nav'>
            {address && (
              <li className='nav-item'>
                <Link className='nav-link user-nav clickable' to={`/myfiles`}>
                  <div className='user-nav-wrap'>
                    <span>{`${address.slice(0, 8)}...`}</span>
                  </div>
                </Link>
              </li>
            )}
            <button
              type='button'
              className='upload-file-btn btn-nav my-2'
              onClick={e => handleSelectClick(e)}
              disabled={savingFile || selectFile}
            >
              UPLOAD DOCS
            </button>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default withRouter(NavBar);
