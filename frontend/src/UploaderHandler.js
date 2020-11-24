import './UploaderHandler.css';
import React, { useState } from 'react';
import { error, success, server_error } from './sweetalert';
import axios from 'axios';
import { BACKEND_URL } from './constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploaderHandler = props => {
  const [uploading, setUploading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [fileLastModified, setFileLastModified] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fileSize, setFileSize] = useState(null);
  const [fileName, setFileName] = useState(null);

  const clearComponent = () => {
    setUploading(false);
    setFileToUpload(null);
    setFileLastModified(null);
    setFileType(null);
    setFileSize(null);
    setFileName(null);
    props.setUploading(false);
    props.clearInput();
  };

  const handleReaderLoaded = e => {
    var file = e && e.target ? e.target.result : null;
    if (file) {
      setUploading(true);
    } else {
      error('Invalid file.');
      clearComponent();
    }
  };

  const uploadFile = async file => {
    // if (!uploading) {
    if (file) {
      props.setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file); // appending file
        const endPoint = BACKEND_URL + 'upload';
        await axios.post(endPoint, formData, {
          headers: {
            address: localStorage.getItem('oasis-docs-address'),
            token: localStorage.getItem('oasis-docs-token'),
          },
        });
        props.setUploading(false);
        success('Upload Successfully!');
        clearComponent();
      } catch (err) {
        console.log(err);
        props.setUploading(false);
        error('Something went wrong! Please try again latter.');
        clearComponent();
      }
    } else {
      clearComponent();
    }
    // } else {
    //   error('Please, wait for the previous execution...', '');
    // }
  };

  const handleFileSelect = file => {
    uploadFile(file);
    // if (!uploading) {
    //   if (file) {
    //     props.setUploading(true);
    //       if (file.type === 'application/pdf') {
    //         if (file.size < 25000000) {
    //           setFileSize(file.size);
    //           setFileName(file.name);
    //           setFileType(file.type);
    //           setFileLastModified(file.lastModified);
    //           var reader = new FileReader();
    //           reader.onload = handleReaderLoaded;
    //           reader.readAsArrayBuffer(file);
    //         } else {
    //           error('For a while, the maximum file size allowed is 25MB.');
    //           clearComponent();
    //         }
    //       } else {
    //         error('Invalid file type.');
    //         clearComponent();
    //       }
    //   } else {
    //     clearComponent();
    //   }
    // } else {
    //   error('Please, wait for the previous execution...', '');
    // }
  };

  const handleFileChange = e => {
    // handleFileSelect(e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0]);
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    uploadFile(file);
  };

  const handleClick = () => {
    if (!uploading) {
      document.getElementById('fileInput').click();
    } else {
      error('Please, wait for the previous execution...', '');
    }
  };

  if (props.clicked) {
    setTimeout(() => {
      props.setActionRealized();
      handleClick();
    }, 0);
  }
  if (props.fileDragged) {
    setTimeout(() => {
      var file = props.fileDragged;
      props.setActionRealized();
      handleFileSelect(file);
    }, 0);
  }
  return (
    <input
      className='fileInput'
      type='file'
      id='fileInput'
      name='fileInput'
      onChange={e => handleFileChange(e)}
      disabled={uploading}
    />
  );
};
export default UploaderHandler;
