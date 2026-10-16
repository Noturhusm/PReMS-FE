"use client"
import React, { useState, useRef } from "react"
import { FaCheck, FaTimes, FaUpload } from "react-icons/fa"



export default function FileUploader(props) {
  const { url, onSuccess, label, allowMultiple } = props
  const [selectedFiles, setSelectedFiles] = useState([])
  const [fileProgress, setFileProgress] = useState({})
  const [fileStatus, setFileStatus] = useState({})
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
      setFileProgress({})
      setFileStatus({})
    }
  }

  const uploadFile = (file) => new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("uploads", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

    const token = localStorage.getItem("token");
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    xhr.setRequestHeader("Accept", "application/json");

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setFileProgress((previous) => ({ ...previous, [file.name]: progress }));
      }
    });

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error("Upload network request failed"));
    xhr.send(formData);
  });

  const startUpload = async () => {
    if (selectedFiles.length === 0 || isUploading) return;

    setIsUploading(true);
    let allUploaded = true;

    for (const file of selectedFiles) {
      try {
        await uploadFile(file);
        setFileStatus((previous) => ({ ...previous, [file.name]: "Uploaded" }));
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        setFileStatus((previous) => ({ ...previous, [file.name]: "Failed" }));
        allUploaded = false;
      }
    }

    setIsUploading(false);

    if (allUploaded) {
      setSelectedFiles([]);
      if (onSuccess) await onSuccess();
    }
  };

  return (
    <div className="w-full">
      <label className="label pt-0"><span className="label-text font-semibold">{label}</span></label>
      
      <div className="flex gap-2">
        <input 
          type="file" 
          className="file-input file-input-bordered file-input-primary file-input-sm w-full" 
          onChange={handleFileChange} 
          multiple={allowMultiple} 
          ref={fileInputRef} 
        />
        {selectedFiles.length > 0 && !isUploading && (
          <button className="btn btn-primary btn-sm" onClick={startUpload}>
            <FaUpload className="mr-2" /> Upload
          </button>
        )}
      </div>

      <div className="mt-2 space-y-2">
        {Object.entries(fileProgress).map(([name, prog]) => (
          <div key={name} className="text-xs border p-2 rounded bg-base-200">
            <div className="flex justify-between mb-1">
              <span className="truncate font-medium">{name}</span>
              <span className={fileStatus[name] === "Uploaded" ? "text-success" : fileStatus[name] === "Failed" ? "text-error" : ""}>
                {fileStatus[name] === "Uploaded" ? <><FaCheck className="inline mr-1" />Uploaded</> : fileStatus[name] === "Failed" ? <><FaTimes className="inline mr-1" />Failed</> : `${prog}%`}
              </span>
            </div>
            <progress className="progress progress-primary w-full" value={prog} max="100" />
          </div>
        ))}
      </div>
    </div>
  )
}