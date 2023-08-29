import React, { useState, useRef } from "react";
import { Button } from "reactstrap";
import axios from "axios";
import "./style.css"

const ScreenRecording = () => {
  const [recording, setRecording] = useState(false);
  const [mediaChunks, setMediaChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const videoRef = useRef(null);

  const constraints = {
    video: {
      mediaSource: "screen",
    },
    audio: true,
  };

  const webcamConstraints = {
    video: true,
    audio: true,
  };

  const handleRecord = async () => {
    const userPermission = window.confirm("Do you want to start recording?");
    if (!userPermission) return;

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia(constraints);
      const webcamStream = await navigator.mediaDevices.getUserMedia(webcamConstraints);

      const combinedStream = new MediaStream();
      screenStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
      webcamStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
      webcamStream.getAudioTracks().forEach(track => combinedStream.addTrack(track));

      mediaRecorderRef.current = new MediaRecorder(combinedStream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setMediaChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        saveRecording();
        combinedStream.getTracks().forEach((track) => track.stop()); 
        setMediaChunks([]); 
        videoRef.current.srcObject = null; 
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      videoRef.current.srcObject = combinedStream; 
    } catch (error) {
      console.error("Error accessing media:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const saveRecording = async () => {
    if (mediaChunks.length > 0) {
      const blob = new Blob(mediaChunks, { type: "video/webm" });
      const formData = new FormData();
      formData.append("video", blob);

      try {
        const response = await axios.post("http://localhost:8080/api/recording", formData); 
        console.log("Recording saved successfully:", response.data);
      } catch (error) {
        console.error("An error occurred while saving recording:", error);
      }
    }
  };

  const downloadRecording = () => {
    if (mediaChunks.length > 0) {
      const blob = new Blob(mediaChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recorded-video.webm";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="screen-record-wrapper">
      <video ref={videoRef} autoPlay style={{ display: recording ? "block" : "none" }} />
      {!recording ? (
        <Button onClick={handleRecord}>Start Recording</Button>
      ) : (
        <>
          <Button onClick={handleStopRecording}>Stop Recording</Button>
          <Button onClick={downloadRecording}>Download Recording</Button>
        </>
      )}
    </div>
  );
};

export default ScreenRecording;
