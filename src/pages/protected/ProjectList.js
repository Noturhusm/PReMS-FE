import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "features/common/headerSlice";
import api from "../../axios"; // make sure path is correct

// 1. 👇 Add the router hook so we can change pages
import { useNavigate } from "react-router-dom"; 

import ProjectItem from "./ProjectItem";
// Make sure to rename this file later to AddProjectModalBody when you clean up the folders!
import AddLeadModalBody from "../../features/leads/components/AddLeadModalBody"; 



function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // 2. 👇 Initialize the navigate hook

  // Fetch Projects
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get("/projects"); // Updated endpoint
      setProjects(response.data || []);
    } catch (error) {
      console.error("Failed to fetch projects", error);
      dispatch(showNotification({ message: "Failed to load projects", status: 0 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
    {/* This fixes the header text at the top */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Projects List</h1>
      <button className="btn btn-primary px-6" onClick={openAddModal}>
        Add New Project
      </button>
    </div>

    {loading ? (
      <div className="text-center py-4">Loading projects...</div>
    ) : projects.length === 0 ? (
      <div className="text-center py-4 text-gray-500">No projects found. Add one to get started!</div>
    ) : (
      /* A real table container to enforce columns */
      <div className="overflow-x-auto w-full bg-white rounded-lg shadow">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="py-4 px-6 text-left text-gray-600 font-semibold">No.</th>
              <th className="py-4 px-6 text-left text-gray-600 font-semibold">Project Name</th>
              <th className="py-4 px-6 text-left text-gray-600 font-semibold">Project Manager</th>
              <th className="py-4 px-6 text-left text-gray-600 font-semibold">Client Name</th>
              <th className="py-4 px-6 text-left text-gray-600 font-semibold">Project Code</th>
              <th className="py-4 px-6 text-center text-gray-600 font-semibold bg-gray-100"></th>
          </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
            <ProjectItem
              key={project.id || project.projectCode}
              project={project}
              index={index} 
              refreshProjects={fetchProjects}  
              openEditModal={() => navigate(`/app/project-details/${project.id}`)} 
            />
          ))}
          </tbody>
        </table>
      </div>
    )}

    {/* Modal block below stays as is for ADDING */}
    {isModalOpen && (
      <div className="modal modal-open">
        <div className="modal-box relative">
          <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeModal}>✕</button>
          <h3 className="font-bold text-lg mb-4">Add New Project</h3>
          <AddLeadModalBody closeModal={closeModal} refreshProjects={fetchProjects} />
        </div>
      </div>
    )}
  </div>
  );
}

export default ProjectList;