import { useCallback, useEffect, useState } from 'react';
import {
  BsClipboard,
  BsCloudUpload,
  BsDownload,
  BsUpload,
} from 'react-icons/bs';
import { VscBracketDot } from 'react-icons/vsc';
import { Slide, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { createWorker } from 'tesseract.js';
import { downloadFile } from './utils/downloadFile';

const App = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [textResult, setTextResult] = useState(
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut itaque incidunt dolores consequuntur quasi ea autem, neque soluta quod consequatur laboriosam modi assumenda ad nihil voluptatum quisquam laborum consectetur eum vitae architecto, atque odio. Eaque quidem dolore quod delectus fuga, voluptatum tempora aut laboriosam voluptatibus pariatur reprehenderit eligendi? Ea, optio!'
  );
  const worker = createWorker();

  const convertImageToText = useCallback(async () => {
    if (!uploadedImage) return;
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const {
      data: { text },
    } = await worker.recognize(uploadedImage);
    setTextResult(text);
  }, [worker, uploadedImage]);

  useEffect(() => {
    convertImageToText();
    // eslint-disable-next-line
  }, [uploadedImage, convertImageToText]);

  const handleChange = e => {
    if (e.target.files[0]) {
      setUploadedImage(e.target.files[0]);
    } else {
      setUploadedImage(null);
      setTextResult('');
    }
  };

  const copyToClipboard = () => {
    if (textResult) {
      navigator.clipboard.writeText(textResult);
      toast.success('Copied to clipboard', {
        toastId: 'custom-id-yes',
      });
    }
    return;
  };

  return (
    <Wrapper className='section section-center'>
      <header>
        <h1 className='section-title'>
          paper text <VscBracketDot className='icon' />
        </h1>
        <h3 className='section-text'>Extract text from images</h3>
      </header>
      <div className='grid-container'>
        <div className='input-container'>
          {uploadedImage ? (
            <div className='image'>
              <img src={URL.createObjectURL(uploadedImage)} alt='upload' />
            </div>
          ) : (
            <BsCloudUpload className='upload-icon' />
          )}
        </div>
        <div className='result-container' onClick={() => copyToClipboard()}>
          {textResult && (
            <div className='box-p'>
              <p>{textResult}</p>
            </div>
          )}
        </div>
      </div>
      <div className='btn-container'>
        <label htmlFor='upload'>
          <BsUpload /> Upload Img
        </label>
        <input
          className='file-input'
          type='file'
          id='upload'
          accept='image/*'
          onChange={handleChange}
        />
        <div className='result-btn'>
          <button onClick={() => downloadFile(textResult)}>
            download txt <BsDownload />
          </button>
          <button onClick={() => copyToClipboard()}>
            copy <BsClipboard />
          </button>
        </div>
      </div>

      <ToastContainer
        position='top-center'
        autoClose={2000}
        draggablePercent={80}
        pauseOnHover={false}
        transition={Slide}
        hideProgressBar
        closeOnClick
        toastStyle={{ backgroundColor: '#ffffff' }}
      />
    </Wrapper>
  );
};

export default App;

const Wrapper = styled.section`
  .icon {
    margin-bottom: -0.5rem;
  }
  .upload-icon {
    display: block;
    text-align: center;
    font-size: 12rem;
    margin: auto;
  }
  .grid-container {
    margin-top: 5rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .input-container {
    border-radius: var(--radius);
  }
  .result-container {
    border: 1px solid var(--black);
    border-radius: var(--radius);
    padding: 1rem;
    background: var(--white);
    cursor: pointer;
    .icon {
      display: block;
      margin-left: auto;
    }
  }
  .btn-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5rem;
    text-align: left;
    input {
      display: none;
    }
    label,
    button {
      cursor: pointer;
      background-color: var(--grey-500);
      padding: 0.45rem 0.75rem;
      border-radius: var(--radius);
      color: var(--white);
      transition: var(--transition);
      font-size: 0.575rem;
      &:hover {
        color: var(--black);
      }
    }
    button {
      font-family: var(--ff-primary);
      text-transform: capitalize;
      border: none;
      margin-left: 0.5rem;
    }
  }
  @media (min-width: 552px) {
    .btn-container {
      justify-content: space-between;
      label,
      button {
        font-size: 0.875rem;
      }
    }
  }
  @media (min-width: 992px) {
    .grid-container {
      margin-top: 5rem;
      grid-template-columns: 1fr 1fr;
    }
  }
`;
