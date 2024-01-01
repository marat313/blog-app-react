
import React, { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth, storage } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // импорт стилей
import { useAppContext } from './AppContext';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


let blank = document.getElementsByClassName(".ql-editor")

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [photoLink, setPhotoLink] = useState("");
  const [postText, setPostText] = useState("");
  const [postDate, setpostDate] = useState("");
  const [isMainNews, setIsMainNews] = useState(false);
  const [audioUrl, setAudioUrl] = useState(""); // Добавьте новое состояние
  const { isAuth } = useAppContext();

  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const storageRef = ref(storage, `audio/${file.name}`);
        const metadata = { contentType: "audio/mp3" };
  
        await uploadBytes(storageRef, file, metadata);

        // Получение URL-адреса загруженного аудиофайла
      const downloadURL = await getDownloadURL(storageRef);
      setAudioUrl(downloadURL); // Сохраняем URL в состоянии
      console.log(downloadURL);
      console.log(setAudioUrl);
  
        console.log('Audio file uploaded successfully!');
      } catch (error) {
        console.error('Error uploading audio file:', error);
      }
    } else {
      console.error('No audio file selected for upload.');
    }
  };
  

  const [transcript, setTranscript] = useState('');
  const [recording, setRecording] = useState(false); // Добавьте это состояние

  const postsCollectionRef = collection(db, "items");
  let navigate = useNavigate();

  const createPost = async () => {
    if (title === "" || postText === "") {
      alert("Поле не может быть пустым");
      console.log("Поле не может быть пустым");
      return false;
    } else {
      await addDoc(postsCollectionRef, {
        title,
        photoLink,
        postText,
        postDate,
        isMainNews,
        author: {
          name: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
      });
      alert("success");
      navigate("/");
    }
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const monthGet = new Date();

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Обработка изменений в дереве DOM
        // ...
      });
    });

    // Наблюдение за изменениями в дереве DOM
    observer.observe(document.getElementById("yourQuillEditorId"), {
      childList: true,
      subtree: true,
    });

    // Завершение работы MutationObserver при размонтировании компонента
    return () => observer.disconnect();
  }, []);



  const startSpeechRecognition = (e) => {
    e.preventDefault();
  
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  
      recognition.onstart = () => {
        setRecording(true);
      };
  
      recognition.onresult = (event) => {
        const currentTranscript = event.results[0][0].transcript;
        setTranscript(currentTranscript);
      };
  
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setRecording(false);
      };
  
      recognition.onend = () => {
        setRecording(false);
        console.log('Speech recognition ended.');
      };
  
      recognition.start();
    } else {
      console.log('Web Speech API не поддерживается в этом браузере.');
    }
  };
  
  
  return (

    <div className="createPost">
      <h2>Напишите ваши мысли</h2>
      <Box
        component="form"
        sx={{
          "& > :not(style)": {
            maxWidth: "500px",
            width: "100%",
          },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="standard-basic"
          label="Тема блога"
          variant="standard"
          size="large"
          onChange={(e) => {
            setTitle(e.target.value);
            setpostDate(
              new Date().getFullYear() +
                " / " +
                monthNames[monthGet.getMonth()] +
                " / " +
                new Date().getDate()
            );
          }}
        />
        <TextField
          sx={{ mt: 5 }}
          id="standard-basic"
          label="Ссылка на фото"
          variant="standard"
          size="large"
          onChange={(e) => {
            setPhotoLink(e.target.value);
          }}
        />

        <br />

        {/* Использование редактора React-Quill */}
        <ReactQuill
          id="yourQuillEditorId"
          value={postText}
          onChange={(value) => setPostText(value)}
          theme="snow"
          placeholder="Введите текст здесь.. или вставте скопированный"
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              ["link", "image"],
              // ["code-block"], // Добавлен плагин для вставки кода
              ["clean"],
            ],
            clipboard: {
              matchVisual: false,
            },
          }}
        />


 
 {/* voice recorder */}
{/*  <button onClick={startSpeechRecognition} disabled={recording}>
  {recording ? 'Recording...' : 'Start Speech Recognition'}
</button>
<p>Текст: {transcript}</p> */}





        <FormControlLabel
          control={
            <Checkbox
              checked={isMainNews}
              onChange={() => setIsMainNews(!isMainNews)}
              color="primary"
            />
          }
          label="Главная новость"
        />

        <div className="publish">
          <Button
            onClick={createPost}
            size="large"
            variant="contained"
            endIcon={<SendIcon />}
          >
            Публиковать пост
          </Button>
        </div>
      </Box>
      <div>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
        </div>
    </div>
  );
}

export default CreateBlog;
