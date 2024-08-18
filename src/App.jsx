import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './App.css';

Modal.setAppElement('#root');

const App = () => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');  // Change from pdf to pdfUrl
  const [notes, setNotes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('https://notes-backend-cn5l.onrender.com/notes');
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const noteData = {
      title,
      subject,
      pdfUrl,  // Send the URL instead of a file
    };

    try {
      await axios.post('https://notes-backend-cn5l.onrender.com/upload', noteData);
      setModalMessage('Note uploaded successfully!');
      setModalIsOpen(true);
      setTitle('');
      setSubject('');
      setPdfUrl('');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error uploading note:', error);
      setModalMessage('Error uploading note.');
      setModalIsOpen(true);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await axios.delete(`https://notes-backend-cn5l.onrender.com/notes/${noteId}`);
      setNotes(notes.filter(note => note._id !== noteId));
      setModalMessage('Note deleted successfully!');
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error deleting note:', error);
      setModalMessage('Error deleting note.');
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="container">
      <h1>Upload your notes here👇</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Subject:</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          >
            <option value="" disabled>Select subject</option>
            <option value="Math">Math</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Computer Science">Computer Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
            <option value="Geography">Geography</option>
            <option value="Economics">Economics</option>
          </select>
        </div>
        <div>
          <label>PDF URL:</label> {/* Change label to PDF URL */}
          <input
            type="url"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit">Upload</button>
      </form>

      <h2>Uploaded Notes</h2>
      <ul>
        {notes.map((note) => (
          <li key={note._id}>
            <h3>{note.title}</h3>
            <p>Subject: {note.subject}</p>
            <a href={note.pdfUrl} target="_blank" rel="noopener noreferrer">
              View PDF
            </a>
            <button className="delete-button" onClick={() => handleDelete(note._id)}>✘</button>
          </li>
        ))}
      </ul>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Notification"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>{modalMessage}</h2>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default App;
