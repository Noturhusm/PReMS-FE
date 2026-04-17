import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import InputText from '../../../components/Input/InputText';
import TextAreaInput from '../../../components/Input/TextAreaInput';
import { useParams } from 'react-router-dom';
import FileUploader from "./components/Upload"; // 👈 Ensure this matches your filename

function ProjectDetails() {
    const { id } = useParams(); 

    const [formData, setFormData] = useState({
        startDate: "",
        endDate: "",
        projectCode: "",
        type: "-",
        category: "-",
        cost: "-",
        description: "-",
        status: "Planned",
        teamMembers: "-",
        documents: []
    });

    const fetchData = useCallback(async () => {
    if (!id) return;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/projects/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        // 1. Rename 'data' to 'project' here 👈
        const project = await response.json(); 

        // 2. Check if project exists and has an ID
        if (project && project.id) {
            setFormData({
                // Now these 'project.xxx' references will work perfectly!
                startDate: project.created_at ? project.created_at.split(/[ T]/)[0] : "",
                endDate: project.project_end_date || "",
                projectCode: project.projectCode || "", 
                type: project.projectType || "-", 
                category: project.projectCategory || "-", 
                cost: project.projectCost || "-", 
                description: project.projectDetail || "",
                status: project.status || "Planned",
                teamMembers: project.projectManager || "", 
                documents: project.documents || [] 
            });
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}, [id]);


const updateFormValue = ({ updateType, value }) => {
    setFormData(prev => ({ ...prev, [updateType]: value }));
};
    return (
        <TitleCard title="Project Details" topMargin="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputText labelTitle="Project Start Date" type="date" defaultValue={formData.startDate} updateFormValue={({ value }) => updateFormValue({ updateType: "startDate", value })} />
                <InputText labelTitle="Project End Date" type="date" defaultValue={formData.endDate} updateFormValue={({ value }) => updateFormValue({ updateType: "endDate", value })} />
                <InputText key={formData.projectCode} labelTitle="Project Code" defaultValue={formData.projectCode} updateFormValue={({ value }) => updateFormValue({ updateType: "projectCode", value })} />
                <InputText labelTitle="Project Type" defaultValue={formData.type} updateFormValue={({ value }) => updateFormValue({ updateType: "type", value })} />
                <InputText labelTitle="Project Category" defaultValue={formData.category} updateFormValue={({ value }) => updateFormValue({ updateType: "category", value })} />
                <InputText labelTitle="Project Cost" defaultValue={formData.cost} updateFormValue={({ value }) => updateFormValue({ updateType: "cost", value })} />
                <TextAreaInput labelTitle="Project Description" defaultValue={formData.description} updateFormValue={({ value }) => updateFormValue({ updateType: "description", value })} />
                
                <div>
                    <span className="label-text text-base-content font-semibold">Project Status</span>
                    <select className="select select-bordered w-full mt-2" value={formData.status} onChange={(e) => updateFormValue({ updateType: "status", value: e.target.value })}>
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="divider"></div>
            <TextAreaInput labelTitle="Project Team Members" defaultValue={formData.teamMembers} updateFormValue={({ value }) => updateFormValue({ updateType: "teamMembers", value })} />

            <div className="divider"></div>

            {/* DOCUMENT SECTION */}
            <div className="mt-4">
                <div className="max-w-md">
                    <FileUploader 
                        label="Project Documents"
                        url={`http://127.0.0.1:8000/api/projects/${id}/upload`}
                        allowMultiple={true}
                        onSuccess={fetchData} // Refresh table on success
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
            {/* If documents exist, map them. Otherwise show 'No documents found' */}
            {formData.documents && formData.documents.length > 0 ? (
                formData.documents.map((doc, index) => (
                    <tr key={index}>
                        <td>{doc.file_name}</td>
                        <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                        <td>
                            <button 
                            className="btn btn-xs btn-ghost text-primary"
                            onClick={() => window.open(`http://127.0.0.1:8000/storage/${doc.file_path}`, '_blank')}
                            >
                            View
                            </button>
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
                <button className="btn btn-primary">Update Details</button>
            </div>
        </TitleCard>
    );
}

export default ProjectDetails;