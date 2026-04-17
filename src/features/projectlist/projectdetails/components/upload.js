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

  const startUpload = () => {
  if (selectedFiles.length === 0) return;
  setIsUploading(true);

  selectedFiles.forEach(file => {
    const formData = new FormData();
    formData.append("uploads", file);

    // 1. ADD 'const' HERE 👈
    const xhr = new XMLHttpRequest(); 
    
    xhr.open("POST", url, true);

    const token = localStorage.getItem('token');
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Accept", "application/json");

    xhr.upload.addEventListener("progress", e => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        setFileProgress(prev => ({ ...prev, [file.name]: progress }));
      }
    });

    xhr.onreadystatechange = () => {
      // 2. Because xhr is declared with 'const' above, 
      // it is now available inside this function scope.
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 201) {
          setFileStatus(prev => ({ ...prev, [file.name]: "Uploaded" }));
          setTimeout(() => {
            if (onSuccess) onSuccess();
            setSelectedFiles([]);
            setIsUploading(false);
          }, 1000);
        } else {
          setFileStatus(prev => ({ ...prev, [file.name]: "Failed" }));
          setIsUploading(false);
        }
      }
    };
    
    xhr.send(formData);
  });
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
              <span className={fileStatus[name] === "Uploaded" ? "text-success" : ""}>
                {fileStatus[name] || `${prog}%`}
              </span>
            </div>
            <progress className="progress progress-primary w-full" value={prog} max="100" />
          </div>
        ))}
      </div>
    </div>
  )
}