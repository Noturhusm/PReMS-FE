import React from "react";
import api from "axios"; 
import { useDispatch } from "react-redux";
import { showNotification } from "features/common/headerSlice"; 

// Added "index" prop so we can display the row number!
function ProjectItem({ project, index, refreshProjects, openEditModal }) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const deleteProject = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const projectCode = project?.project_code || project?.projectCode;
      
      await api.delete(`/projects/${projectCode}`, config);    
        
      dispatch(showNotification({ message: "Project Deleted!", status: 1 }));
      refreshProjects();
    } catch (error) {
      console.error("Failed to delete project", error);
      dispatch(showNotification({ message: "Delete failed!", status: 0 }));
    }
  };

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      {/* 1. Row Number Column */}
      <td className="py-4 px-6 font-medium text-gray-700">{index + 1}</td>
      
      {/* 2. Project Name Column */}
      <td className="py-4 px-6 text-gray-800 font-semibold">
        {project?.project_name || project?.projectName}
      </td>
      
      {/* 3. Project Manager Column with Picture Slot */}
      <td className="py-4 px-6 text-gray-600">
        <div className="flex items-center gap-3">
          {/* Avatar Slot */}
          <div className="avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-10 h-10 ring ring-primary ring-offset-2">
              <span className="text-xs">
                {(project?.project_manager || project?.projectManager)?.substring(0, 2).toUpperCase() || 'PM'}
              </span>
            </div>
          </div>

          {/* Manager Name */}
          <div>
            <div className="font-semibold text-gray-800">
              {project?.project_manager || project?.projectManager}
            </div>
            <div className="text-xs opacity-60">Manager</div>
          </div>
        </div>
      </td>
      
      {/* 4. Client Name Column */}
      <td className="py-4 px-6 text-gray-600">
        {project?.client_name || project?.clientName}
      </td>
      
      {/* 5. Project Code Column */}
      <td className="py-4 px-6">
        <span className="badge badge-ghost font-mono text-gray-700">
          {project?.project_code || project?.projectCode}
        </span>
      </td>

      {/* 👇 6. Brand Aligned Action Buttons at the very end of the row! 👇 */}
      <td className="py-4 px-6 text-center">
        <div className="flex justify-center gap-2">
          <button
            className="btn btn-sm border-0 bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold px-4"
            onClick={() => openEditModal?.(project)}
            type="button"
          >
            Edit
          </button>
          <button 
            className="btn btn-sm border-0 bg-red-100 text-red-700 hover:bg-red-200 font-semibold px-4" 
            onClick={deleteProject}
            type="button"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default ProjectItem;