import React, { useState } from 'react';
import axios from "axios";

const PdfUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a valid PDF file');
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFile) {
         const formData = new FormData();
         formData.append('file', selectedFile);
         
          try {
            const response = await axios.post(
            `${import.meta.env.VITE_API_URL}upload-pdf`,
            formData,
            {
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            }
        );
        console.log(response.data); // Handle success response
        alert('File uploaded successfully');
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('File upload failed');
      }
    } else {
      alert('No file selected');
    }
  };

  const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
  tile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  button: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#0085e1',
    color: '#eeeeee',
    fontWeight:'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  secondaryButton: {
    marginTop: '10px',
    padding: '5px 10px',
    backgroundColor: '#818181',
    color: '#eeeeee',
    fontWeight:'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
  },
};

  return (
    <div>
      <form onSubmit={handleSubmit} className='flex-col'>
        <div className='flex-row'>
          <label for='file_input' className='m-5' style={{...styles.secondaryButton, cursor:'pointer'}}>Select PDF</label>
        <button style={styles.button} className='m-5' type="submit">Upload</button>
        </div>
        <input id='file_input' type="file" style={{display:'none'}} accept="application/pdf" onChange={handleFileChange} />
        {selectedFile && <p className='m-5'>Selected file: {selectedFile.name}</p>}
      </form>
    </div>
  );
};

export default PdfUploader;
