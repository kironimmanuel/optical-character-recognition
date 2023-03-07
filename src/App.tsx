import { useCallback, useEffect, useState } from "react";
import {
  BsClipboard,
  BsCloudUpload,
  BsDownload,
  BsUpload,
} from "react-icons/bs";
import { VscBracketDot } from "react-icons/vsc";
import { Slide, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createWorker } from "tesseract.js";
import { downloadFile } from "./utils/downloadFile";

const App = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [textResult, setTextResult] = useState<string>(
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut itaque incidunt dolores consequuntur quasi ea autem, neque soluta quod consequatur laboriosam modi assumenda ad nihil voluptatum quisquam laborum consectetur eum vitae architecto, atque odio. Eaque quidem dolore quod delectus fuga, voluptatum tempora aut laboriosam voluptatibus pariatur reprehenderit eligendi? Ea, optio!"
  );
  const worker = createWorker();

  const convertImageToText = useCallback(async () => {
    if (!uploadedImage) return;
    setIsLoading(true);
    console.log("loading started");
    try {
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const {
        data: { text },
      } = await worker.recognize(uploadedImage);
      setTextResult(text);
    } catch (error) {
      console.error(error);
      setTextResult("Error converting image to text");
    }
    setIsLoading(false);
    console.log("loading finished");
  }, [worker, uploadedImage]);

  useEffect(() => {
    convertImageToText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedImage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files[0]) {
        setUploadedImage(e.target.files[0]);
      } else {
        setUploadedImage(null);
        setTextResult("");
      }
    }
  };

  const copyToClipboard = () => {
    if (textResult) {
      navigator.clipboard.writeText(textResult);
      toast.success("Copied to clipboard", {
        toastId: "custom-id-yes",
      });
    }
    return;
  };

  return (
    <section className="section section-center">
      <header>
        <h1 className="section-title">
          paper text OCR <VscBracketDot className="icon" />
        </h1>
        <h3 className="section-text">Extract text from images</h3>
      </header>
      <div className="grid-container">
        <div className="input-container">
          {uploadedImage ? (
            <div className="image">
              <img src={URL.createObjectURL(uploadedImage)} alt="upload" />
            </div>
          ) : (
            <BsCloudUpload className="upload-icon" />
          )}
        </div>
        <div className="result-container" onClick={() => copyToClipboard()}>
          {isLoading ? (
            <div className="box-p loading-container">
              <span className="loader"></span>
            </div>
          ) : (
            <div className="box-p">{textResult && <p>{textResult}</p>}</div>
          )}
        </div>
      </div>
      <div className="btn-container">
        <label htmlFor="upload">
          <BsUpload /> Upload Img
        </label>
        <input
          className="file-input"
          type="file"
          id="upload"
          accept="image/*"
          onChange={handleChange}
        />
        <div className="result-btn">
          <button onClick={() => downloadFile(textResult)}>
            download txt <BsDownload />
          </button>
          <button onClick={() => copyToClipboard()}>
            copy <BsClipboard />
          </button>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        draggablePercent={80}
        pauseOnHover={false}
        transition={Slide}
        hideProgressBar
        closeOnClick
        toastStyle={{ backgroundColor: "#ffffff" }}
      />
    </section>
  );
};

export default App;
