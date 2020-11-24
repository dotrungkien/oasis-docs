import './Dashboard.css';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { server_error, error, confirm } from './sweetalert';
import UploaderHandler from './UploaderHandler';
import { withRouter } from 'react-router-dom';

const Dashboard = props => {
  const [dragging, setDragging] = useState(false);
  const [fileDragged, setFileDragged] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const setNewFile = fileData => {
    props.setfileSaved();
    files.unshift(fileData.metadata);
    setSelectedFile(fileData.metadata);
    setFiles(files);
  };

  const goBack = () => setSelectedFile(null);

  const loadFile = metadata => {
    var state = {};
    state[metadata.name] = 'load';
    // this.setState(state, () => {
    //   props.setLoading('Loading ' + metadata.name);
    // })
  };

  const deleteFile = metadata => {
    confirm(
      'Are you sure that you want to delete the file ' + metadata.name + ' ?',
      toDelete => onModalToDeleteSelect(metadata, toDelete),
      true,
      null,
      'Delete'
    );
  };

  const onModalToDeleteSelect = (metadata, toDelete) => {
    if (toDelete) {
      var state = {};
      state[metadata.name] = 'delete';
      // this.setState(state, () => {
      //   props.setLoading('Deleting...');
      // });
    }
  };

  const handleDragOver = e => {
    e.stopPropagation();
    e.preventDefault();
    return false;
  };

  const handleDragEnter = () => setDragging(true);

  const handleDragLeave = () => setDragging(false);

  const handleDrop = e => {
    e.stopPropagation();
    e.preventDefault();

    setDragging(false);
    setFileDragged(e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0]);
  };

  if (!localStorage.getItem('oasis-docs-token')) {
    return <Redirect to={`/signin`} />;
  }
  if (props.uploading && null) {
    goBack();
  } else if (props.fileSaved) {
    setNewFile(props.fileSaved);
  }

  return (
    <div
      className={dragging ? 'dragging-file' : ''}
      onDragOver={e => handleDragOver(e)}
      onDragEnter={e => handleDragEnter(e)}
      onDragLeave={e => handleDragLeave(e)}
      onDrop={e => handleDrop(e)}
    >
      <UploaderHandler
        clearInput={() => setFileDragged(null)}
        setFile={result => setNewFile(result)}
        fileDragged={fileDragged}
        setActionRealized={() => setFileDragged(null)}
        setUploading={status => {
          props.setLoading(status ? 'Uploading...' : null);
        }}
      ></UploaderHandler>
      <section className='dashboard'>
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <div className='section-title my-4'>MY FILES</div>
            </div>
            {files.length === 0 ? (
              <div className='no-files'>
                <i className='fa fa-folder-open'></i>
                <span>Drop your file here to upload.</span>
              </div>
            ) : (
              files.map(file => (
                <div key={file.name} className='col-md-3 col-lg-2 col-sm-4 mb-4'>
                  <div className='file-lastmodified'>
                    {new Date(file.lastModified).toLocaleString()}
                  </div>
                  <div onClick={e => loadFile(file)} className='document-preview'></div>
                  <div className='file-name' title={file.name}>
                    {file.name}
                  </div>
                  <div>
                    <span className='delete-link' onClick={e => deleteFile(file)}>
                      Delete
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default withRouter(Dashboard);
