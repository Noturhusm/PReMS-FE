import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    leads: []
};

export const leadSlice = createSlice({
    name: 'lead',
    initialState,
    reducers: {
        setLeads: (state, action) => {
            state.leads = action.payload;
        },
        addNewLead: (state, action) => {
            state.leads.push(action.payload);
        },
        deleteLead: (state, action) => {
            state.leads = state.leads.filter(lead => {
                const leadCode = lead.project_code || lead.projectCode;
                const actionCode = action.payload.project_code || action.payload.projectCode || action.payload;
                
                return leadCode !== actionCode;
            });
        }
    }
});

export const { setLeads, addNewLead, deleteLead } = leadSlice.actions;
export default leadSlice.reducer;