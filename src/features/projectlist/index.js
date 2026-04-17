// src/features/projectlist/index.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { DocumentPlusIcon } from "@heroicons/react/16/solid";
import { showNotification } from "../common/headerSlice";
import { useNavigate } from "react-router-dom";
import api from "../../axios";

const TopSideButtons = () => {
  const dispatch = useDispatch();
  const openAddNewProjectModal = () => {
    // Reuse your existing modal registry key for now
    dispatch(openModal({ title: "Add New Project", bodyType: MODAL_BODY_TYPES.LEAD_ADD_NEW }));
  };
  return (
    <div className="inline-block float-right">
      <button className="btn px-6 btn-sm normal-case btn-primary" onClick={openAddNewProjectModal}>
        Add New Project
      </button>
    </div>
  );
};

function ProjectListFeature() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/projects");
      // if paginated: data.data; else: data is array
      setItems(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error(err);
      dispatch(showNotification({ message: "Failed to load projects", status: 0 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();

    // optional: allow triggering a reload from elsewhere
    const onReload = () => load();
    window.addEventListener("projects:reload", onReload);
    return () => window.removeEventListener("projects:reload", onReload);
  }, []);

  const deleteProject = async (row) => {
    // Optional: use your confirmation modal
    // dispatch(openModal({ title: "Confirmation", bodyType: MODAL_BODY_TYPES.CONFIRMATION, extraObject: { message: `Delete "${row.name}"?`, type: CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE, index: row.id } }));
    try {
      await api.delete(`/projects/${row.id}`);
      dispatch(showNotification({ message: "Project deleted", status: 1 }));
      load();
    } catch (err) {
      console.error(err);
      dispatch(showNotification({ message: "Delete failed", status: 0 }));
    }
  };

  const openProjectDetails = (project) => 
    {

      navigate(`/app/project-details/${project.id}`);
    };

  const renderStatus = (val) => {
    const label = val === "in_progress" ? "In Progress" : val === "archived" ? "Archived" : "Planned";
    const cls =
      val === "in_progress"
        ? "badge badge-primary"
        : val === "archived"
        ? "badge"
        : "badge badge-ghost";
    return <div className={cls}>{label}</div>;
  };

  return (
    <>
      <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Project Manager</th>
                <th>Project Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-4 text-center" colSpan={4}>
                    Loading…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={4}>
                    No projects
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src="https://i.pravatar.cc/300" alt="Avatar" />
                          alt="Avatar" 
                          crossOrigin="anonymous" //
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{row.manager_name}</div>
                        </div>
                      </div>
                    </td>
                    <td>{renderStatus(row.status)}</td>
                    <td>
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => deleteProject(row)}
                        title="Delete"
                      >
                        <TrashIcon className="w-5" />
                      </button>
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => openProjectDetails(row)}
                        title="Open details"
                      >
                        <DocumentPlusIcon className="w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <th>Project Name</th>
                <th>Project Manager</th>
                <th>Project Status</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </TitleCard>
    </>
  );
}

export default ProjectListFeature;