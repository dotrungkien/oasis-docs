import './App.css';
import React, { useState } from 'react';
import { Switch, Route, withRouter, useHistory } from 'react-router-dom';
import Landing from './Landing';
import Dashboard from './Dashboard';
import SignIn from './SignIn';
import Callback from './Callback';
import NavBar from './NavBar';

const App = () => {
  const [fileSaved, setFileSaved] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const setFileResult = result => {
    if (window.location.pathname.startsWith('/myfiles')) {
      setFileSaved(result);
      setUploading(false);
    } else {
      history.push('/myfiles?l=true');
    }
  };

  return (
    <main role='main'>
      {!!loading && (
        <div className='loading-overlay'>
          <div className='loading-container'>
            <i className='fa fa-refresh fa-spin'></i>
            <span>&nbsp;&nbsp;{loading}</span>
          </div>
        </div>
      )}
      <NavBar
        setFile={result => setFileResult(result)}
        setUploading={uploading => setUploading(uploading)}
        setLoading={loading => setLoading(loading)}
      />
      <Switch>
        <Route path={`/signin`} render={routeProps => <SignIn {...routeProps} />} />
        <Route
          path={`/myfiles`}
          render={routeProps => (
            <Dashboard
              {...routeProps}
              fileSaved={fileSaved}
              uploading={uploading}
              setfileSaved={() => setFileSaved(null)}
              setLoading={loading => setLoading(loading)}
            />
          )}
        />
        <Route path={`/callback`} render={routeProps => <Callback {...routeProps} />} />
        <Route path={`/`} render={routeProps => <Landing {...routeProps} />} />
      </Switch>
    </main>
  );
};
export default withRouter(App);
