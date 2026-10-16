import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import InputText from "../../../components/Input/InputText";
import TextAreaInput from "../../../components/Input/TextAreaInput";
import { useParams } from "react-router-dom";
import FileUploader from "./components/Upload";
import api from "../../../axios";
import { showNotification } from "../../common/headerSlice";

function ProjectDetails({ projectId }) {
    const { id: routeId } = useParams();
    const id = projectId || routeId;
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        startDate: "",
        endDate: "",
        projectCode: "",
        type: "",
        category: "",
        cost: "",
        description: "",
        status: "",
        teamMembers: "",
        documents: []
    });

    const fetchData = useCallback(async () => {
        if (!id) return;

        try {
            const { data: project } = await api.get(`/projects/${id}`);

            if (project && (project.project_id || project.id)) {
                setFormData({
                    startDate: project.projectStartDate || project.project_start_date || (project.created_at ? project.created_at.split(/[ T]/)[0] : ""),
                    endDate: project.projectEndDate || project.project_end_date || "",
                    projectCode: project.projectCode || project.project_code || "",
                    type: project.projectType || project.project_type || "",
                    category: project.projectCategory || project.project_category || "",
                    cost: project.projectCost || project.project_cost || "-",
                    description: project.projectDetail ?? project.Project_description ?? "",
                    status: project.projectStatus || project.status || "Planned",
                    teamMembers: project.projectTeamMembers || project.project_team_members || project.projectManager || "-",
                    documents: Array.isArray(project.documents) ? project.documents : []
                });
            }
        } catch (error) {
            console.error("Fetch error:", error);
            dispatch(showNotification({ message: "Failed to load project details", status: 0 }));
        }
    }, [dispatch, id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateFormValue = ({ updateType, value }) => {
        setFormData((prev) => ({ ...prev, [updateType]: value }));
    };

    const saveProjectDetails = async () => {
        try {
            await api.put(`/projects/${id}`, {
                projectStartDate: formData.startDate || null,
                projectEndDate: formData.endDate || null,
                projectCode: formData.projectCode,
                projectType: formData.type === "-" ? null : formData.type,
                projectCategory: formData.category === "-" ? null : formData.category,
                projectCost: formData.cost === "-" ? null : formData.cost,
                projectDetail: formData.description === "-" ? "" : formData.description,
                projectStatus: formData.status,
                projectTeamMembers: formData.teamMembers === "-" ? "" : formData.teamMembers
            });

            dispatch(showNotification({ message: "Updated successfully", status: 1 }));
            await fetchData();
        } catch (error) {
            console.error("Update error:", error);
            dispatch(showNotification({ message: "Failed to update project details", status: 0 }));
        }
    };

    const deleteDocument = async (documentId) => {
        if (!window.confirm("Are you sure you want to delete this document?")) {
            return;
        }

        try {
            await api.delete(`/project-documents/${documentId}`);
            dispatch(showNotification({ message: "Document deleted successfully", status: 1 }));
            await fetchData();
        } catch (error) {
            console.error("Delete document error:", error);
            dispatch(showNotification({ message: "Failed to delete document", status: 0 }));
        }
    };

    return (
        <TitleCard title="Project Details" topMargin="mt-2">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InputText
                    labelTitle="Project Start Date"
                    type="date"
                    defaultValue={formData.startDate}
                    updateFormValue={({ value }) => updateFormValue({ updateType: "startDate", value })}
                />
                <InputText
                    labelTitle="Project End Date"
                    type="date"
                    defaultValue={formData.endDate}
                    updateFormValue={({ value }) => updateFormValue({ updateType: "endDate", value })}
                />
                <InputText
                    labelTitle="Project Code"
                    defaultValue={formData.projectCode}
                    updateFormValue={({ value }) => updateFormValue({ updateType: "projectCode", value })}
                />
                 <div>
                    <span className="label-text text-base-content font-semibold">Project Type</span>
                    <select
                        className="select select-bordered mt-2 w-full"
                        value={formData.type}
                        onChange={(e) => updateFormValue({ updateType: "type", value: e.target.value })}
                    >
                        <option value="New Installation">New Installation</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Other">Other</option>

                    </select>
                </div>
                <div>
                    <span className="label-text text-base-content font-semibold">Project Category</span>
                    <select
                        className="select select-bordered mt-2 w-full"
                        value={formData.category}
                        onChange={(e) => updateFormValue({ updateType: "category", value: e.target.value })}
                    >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>

                    </select>
                </div>
                <InputText
                    labelTitle="Project Cost"
                    defaultValue={formData.cost}
                    updateFormValue={({ value }) => updateFormValue({ updateType: "cost", value })}
                />
                <TextAreaInput
                    labelTitle="Project Description"
                    defaultValue={formData.description}
                    updateFormValue={({ value }) => updateFormValue({ updateType: "description", value })}
                />

                <div>
                    <span className="label-text text-base-content font-semibold">Project Status</span>
                    <select
                        className="select select-bordered mt-2 w-full"
                        value={formData.status}
                        onChange={(e) => updateFormValue({ updateType: "status", value: e.target.value })}
                    >
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="active">active</option>
                    </select>
                </div>
            </div>

            <div className="divider"></div>
            <TextAreaInput
                labelTitle="Project Team Members"
                defaultValue={formData.teamMembers}
                updateFormValue={({ value }) => updateFormValue({ updateType: "teamMembers", value })}
            />

            <div className="divider"></div>

            <div className="mt-4">
                <div className="max-w-md">
                    <FileUploader
                        label="Project Documents"
                        url={`${api.defaults.baseURL}/projects/${id}/upload`}
                        allowMultiple={true}
                        onSuccess={fetchData}
                    />
                </div>

                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Document Name</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.documents.length > 0 ? (
                            formData.documents.map((doc) => (
                                <tr key={doc.document_id || doc.id || doc.file_path}>
                                    <td>{doc.file_name}</td>
                                    <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-xs btn-ghost text-primary"
                                                onClick={() => {
                                                    const appUrl = api.defaults.baseURL.replace(/\/api\/?$/, "");
                                                    window.open(`${appUrl}/storage/${doc.file_path}`, "_blank");
                                                }}
                                                type="button"
                                            >
                                                View
                                            </button>
                                            <button
                                                className="btn btn-xs btn-ghost text-error"
                                                onClick={() => deleteDocument(doc.document_id || doc.id)}
                                                type="button"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">No documents found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-16 flex justify-end">
                <button className="btn btn-primary" onClick={saveProjectDetails} type="button">Update Details</button>
            </div>
        </TitleCard>
    );
}

export default ProjectDetails;
