import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import TitleCard from "../../../components/Cards/TitleCard"
import { showNotification } from '../../common/headerSlice'
import InputText from '../../../components/Input/InputText'
import TextAreaInput from '../../../components/Input/TextAreaInput'
import ToogleInput from '../../../components/Input/ToogleInput'

const DEFAULT_PROFILE = {
    name: "",
    emailId: "",
    birthDate: "",
    company: "",
    title: "",
    place: "",
    about: "",
    language: "",
    timezone: "",
    syncData: true,
    userRole: "",
    projectInvolve: "",
}

function ProfileSettings(){
    const dispatch = useDispatch()
    const [profileData, setProfileData] = useState(DEFAULT_PROFILE)
    const [updated, setUpdated] = useState(false)
    const [loadingStatus, setLoadingStatus] = useState(false)

    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser')
        const savedUser = JSON.parse(localStorage.getItem(`user_${currentUser}`) || '{}')
        const savedProfile = JSON.parse(localStorage.getItem(`profileSettings_${currentUser}`) || 'null')

        setProfileData({
            ...DEFAULT_PROFILE,
            emailId: savedUser.emailId || savedProfile?.emailId || "",
            name: savedProfile?.name || savedUser.name || "",
            birthDate: savedProfile?.birthDate || "",
            company: savedProfile?.company || "",
            title: savedProfile?.title || "",
            place: savedProfile?.place || "",
            about: savedProfile?.about || "",
            language: savedProfile?.language || "",
            timezone: savedProfile?.timezone || "",
            syncData: savedProfile?.syncData ?? true,
            userRole: savedProfile?.userRole || "",
            projectInvolve: savedProfile?.projectInvolve || "",
        })
    }, [])

    const updateFormValue = ({updateType, value}) => {
        if (!updateType) return
        setProfileData(prev => ({ ...prev, [updateType]: value }))
    }

    const updateProfile = () => {
        setLoadingStatus(true)
        const currentUser = localStorage.getItem('currentUser')
        localStorage.setItem(`profileSettings_${currentUser}`, JSON.stringify(profileData))
        dispatch(showNotification({ message: "Profile Updated Successfully", status: 1 }))
        setLoadingStatus(false)
        setUpdated(true)
    }

    return(
        <>
            <TitleCard title="Profile Settings" topMargin="mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText labelTitle="Name" updateType="name" defaultValue={profileData.name} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Email Id" updateType="emailId" defaultValue={profileData.emailId} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Birth Date" updateType="birthDate" defaultValue={profileData.birthDate} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Company" updateType="company" defaultValue={profileData.company} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Title" updateType="title" defaultValue={profileData.title} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Place" updateType="place" defaultValue={profileData.place} updateFormValue={updateFormValue}/>
                    <TextAreaInput labelTitle="About" updateType="about" defaultValue={profileData.about} updateFormValue={updateFormValue}/>
                </div>

                <div className="divider"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText labelTitle="Language" updateType="language" defaultValue={profileData.language} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Timezone" updateType="timezone" defaultValue={profileData.timezone} updateFormValue={updateFormValue}/>
                    <ToogleInput updateType="syncData" labelTitle="Sync Data" defaultValue={profileData.syncData} updateFormValue={updateFormValue}/>
                </div>

                <div className="divider"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText labelTitle="User Role" updateType="userRole" defaultValue={profileData.userRole} updateFormValue={updateFormValue}/>
                    <InputText labelTitle="Project Involve" updateType="projectInvolve" defaultValue={profileData.projectInvolve} updateFormValue={updateFormValue}/>
                </div>

                <div className="mt-6">
                    {updated && <div className="text-sm text-success">Your profile has been updated successfully.</div>}
                </div>

                <div className="mt-16">
                    <button className={`btn btn-primary float-right ${loadingStatus ? "loading" : ""}`} onClick={updateProfile}>
                        {loadingStatus ? "Updating..." : "Update"}
                    </button>
                </div>
            </TitleCard>
        </>
    )
}

export default ProfileSettings
