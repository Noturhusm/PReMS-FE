import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useLocation } from 'react-router-dom' // 👈 Added these
import { setPageTitle } from '../../features/common/headerSlice'
import ProjectDetails from '../../features/projectlist/projectdetails'

function InternalPage(){
    const dispatch = useDispatch()
    const { id } = useParams() // 👈 Grabs the ID if you used /:id in routes
    const location = useLocation() // 👈 Grabs state if you passed it silently
    
    // We cover both bases! It checks the URL first, then falls back to passed state.
    const projectId = id || location.state?.id;

    useEffect(() => {
        dispatch(setPageTitle({ title : "Project Details"}))
    }, [dispatch])

    return(
        //  Pass that ID straight into your actual feature file as a prop!
        <ProjectDetails projectId={projectId} />
    )
}

export default InternalPage