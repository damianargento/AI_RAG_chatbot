import React, { useEffect, useState } from 'react';
import axios from "axios";
import Loading from './Loading';

const PdfList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the list of files from the backend
  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}files`);
      const responseData = response.data?.uploaded_files;

      if (response.status != 200) {
        throw new Error('Failed to fetch files');
      }
      const data = await responseData;
      setFiles(data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching files');
      console.error('Error fetching files:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(); // Initial fetch
  }, []);

  const deleteFile = async (filename) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}files/${filename}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      // Remove the deleted file from the state
      setFiles(files.filter((file) => file !== filename));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return ( 
  <>
    <div style={styles.container}>
      {error && <p style={styles.error}>{error}</p>}
      {files ? files?.length === 0 && !loading && !error && <p>No files uploaded yet.</p> : <span>No files uploaded yet.</span>}
      {files?.map((file) => (
        <div key={file} style={styles.tile}>
          <p>{file}</p>
          <button style={styles.button} onClick={() => deleteFile(file)}>Delete</button>
        </div>
      ))}
    </div>
    <div className='flex-row flex'>   
      <button class="m-5" style={styles.secondaryButton} onClick={()=> fetchFiles()}>Fetch Files</button>{loading && <Loading />}</div>
    </>
  );
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
    padding: '5px 10px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
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

export default PdfList;
