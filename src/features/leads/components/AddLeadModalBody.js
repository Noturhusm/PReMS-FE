import { useState } from "react";
import ErrorText from '../../../components/Typography/ErrorText';
import { useDispatch } from "react-redux";
import { addNewLead } from "../leadSlice";
import { showNotification } from "../../common/headerSlice";
import api from '../../../axios';

const INITIAL_LEAD_OBJ = {
    projectName: "",
    clientName: "",
    projectManager: "",
    projectCode: ""
};

function AddLeadModalBody({ closeModal }) {
    const dispatch = useDispatch();
    const [leadObj, setLeadObj] = useState(INITIAL_LEAD_OBJ);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e, fieldName) => {
        setErrorMessage("");
        setLeadObj({ ...leadObj, [fieldName]: e.target.value });
    };

    const saveNewLead = async () => {
        if (!leadObj.projectName || !leadObj.clientName || !leadObj.projectManager || !leadObj.projectCode) {
            setErrorMessage("All fields are required!");
            return;
        }

        setLoading(true);

        try {
            // This now ONLY sends the 4 columns that exist in your database!
            const resp = await api.post('/projects', leadObj); 
            dispatch(addNewLead({ newLeadObj: resp.data.project }));
            dispatch(showNotification({ message: "New Project Added!", status: 1 }));
            closeModal();
        } catch (err) {
            setErrorMessage(err.response?.data?.message || "Failed to add project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="form-control w-full mt-4">
                <label className="label"><span className="label-text">Project Name</span></label>
                <input 
                    type="text" 
                    className="input input-bordered w-full" 
                    value={leadObj.projectName} 
                    onChange={(e) => handleInputChange(e, 'projectName')} 
                />
            </div>

            <div className="form-control w-full mt-4">
                <label className="label"><span className="label-text">Project Manager</span></label>
                <input 
                    type="text" 
                    className="input input-bordered w-full" 
                    value={leadObj.projectManager} 
                    onChange={(e) => handleInputChange(e, 'projectManager')} 
                />
            </div>

            <div className="form-control w-full mt-4">
                <label className="label"><span className="label-text">Client Name</span></label>
                <input 
                    type="text" 
                    className="input input-bordered w-full" 
                    value={leadObj.clientName} 
                    onChange={(e) => handleInputChange(e, 'clientName')} 
                />
            </div>

            <div className="form-control w-full mt-4">
                <label className="label"><span className="label-text">Project Code</span></label>
                <input 
                    type="text" 
                    className="input input-bordered w-full" 
                    value={leadObj.projectCode} 
                    onChange={(e) => handleInputChange(e, 'projectCode')} 
                />
            </div>

            <ErrorText styleClass="mt-4">{errorMessage}</ErrorText>

            <div className="modal-action mt-4">
                <button className="btn btn-ghost" onClick={closeModal} type="button">Cancel</button>
                <button className={`btn btn-primary px-6 ${loading ? 'loading' : ''}`} onClick={saveNewLead} type="button">Save</button>
            </div>
        </>
    );
}

export default AddLeadModalBody;