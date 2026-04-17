import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "features/common/headerSlice";
import api from "../../axios";

const AddLeadModalBody = ({ closeModal, projectToEdit, refreshProjects }) => {
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (projectToEdit) {
      setProjectName(projectToEdit.projectName || "");
      setClientName(projectToEdit.clientName || "");
      setProjectCode(projectToEdit.projectCode || "");
    } else {
      setProjectName("");
      setClientName("");
      setProjectCode("");
    }
  }, [projectToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (projectToEdit) {
        // Update existing project
        await api.put(`/projects/${projectToEdit.id}`, {
          projectName,
          clientName,
          projectCode,
        });
        dispatch(showNotification({ message: "Project updated!", status: 1 }));
      } else {
        // Add new project
        await api.post("/projects", { projectName, clientName, projectCode });
        dispatch(showNotification({ message: "Project added!", status: 1 }));
      }

      refreshProjects(); // Refresh project list
      closeModal();      // Close modal
    } catch (error) {
      console.error("Failed to save project:", error);
      dispatch(showNotification({ message: "Failed to save project", status: 0 }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Project Name</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label>Client Name</label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label>Project Code</label>
        <input
          type="text"
          value={projectCode}
          onChange={(e) => setProjectCode(e.target.value)}
          required
          className="input input-bordered w-full"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
        <button type="submit" className="btn btn-primary">
          {projectToEdit ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
};

export default AddLeadModalBody;