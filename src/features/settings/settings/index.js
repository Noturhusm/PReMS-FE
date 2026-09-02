import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import TitleCard from "../../../components/Cards/TitleCard"
import { showNotification } from '../../common/headerSlice'
import InputText from '../../../components/Input/InputText'
import SelectBox from '../../../components/Input/SelectBox'
import ToogleInput from '../../../components/Input/ToogleInput'

const DEFAULT_SETTINGS = {
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    notificationFrequency: "daily", // daily, weekly, never
    
    // Theme & Display
    theme: "light", // light, dark, auto
    language: "en", // en, es, fr, de
    dateFormat: "MM/DD/YYYY", // MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
    
    // Privacy & Security
    twoFactorAuth: false,
    sessionTimeout: "30", // minutes
    activityLogging: true,
    
    // Account Preferences
    autoSave: true,
    autoSaveInterval: "5", // minutes
    dataRetention: "365", // days
    
    // Privacy
    profileVisibility: "private", // private, friends, public
    showActivity: false,
}

function GeneralSettings(){
    const dispatch = useDispatch()
    const [settings, setSettings] = useState(DEFAULT_SETTINGS)
    const [updated, setUpdated] = useState(false)
    const [loadingStatus, setLoadingStatus] = useState(false)

    useEffect(() => {
        const savedSettings = JSON.parse(localStorage.getItem('generalSettings') || 'null')
        if (savedSettings) {
            setSettings({
                ...DEFAULT_SETTINGS,
                ...savedSettings
            })
        }
    }, [])

    const updateFormValue = ({updateType, value}) => {
        if (!updateType) return
        setSettings(prev => ({ ...prev, [updateType]: value }))
    }

    const updateSettings = () => {
        setLoadingStatus(true)
        localStorage.setItem('generalSettings', JSON.stringify(settings))
        dispatch(showNotification({ message: "Settings Updated Successfully", status: 1 }))
        setLoadingStatus(false)
        setUpdated(true)
        setTimeout(() => setUpdated(false), 3000)
    }

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS)
        localStorage.removeItem('generalSettings')
        dispatch(showNotification({ message: "Settings Reset to Default", status: 2 }))
    }

    return(
        <>
            <TitleCard title="General Settings" topMargin="mt-2">
                
                {/* Notification Settings */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-base-content">Notifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ToogleInput 
                            labelTitle="Email Notifications" 
                            updateType="emailNotifications" 
                            defaultValue={settings.emailNotifications} 
                            updateFormValue={updateFormValue}
                        />
                        <ToogleInput 
                            labelTitle="Push Notifications" 
                            updateType="pushNotifications" 
                            defaultValue={settings.pushNotifications} 
                            updateFormValue={updateFormValue}
                        />
                        <ToogleInput 
                            labelTitle="Weekly Digest" 
                            updateType="weeklyDigest" 
                            defaultValue={settings.weeklyDigest} 
                            updateFormValue={updateFormValue}
                        />
                        <SelectBox 
                            labelTitle="Notification Frequency" 
                            updateType="notificationFrequency" 
                            defaultValue={settings.notificationFrequency}
                            updateFormValue={updateFormValue}
                            options={[
                                { value: 'daily', name: 'Daily' },
                                { value: 'weekly', name: 'Weekly' },
                                { value: 'never', name: 'Never' }
                            ]}
                        />
                    </div>
                </div>
                
                <div className="divider"></div>

                {/* Theme & Display Settings */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-base-content">Display & Language</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectBox 
                            labelTitle="Theme" 
                            updateType="theme" 
                            defaultValue={settings.theme}
                            updateFormValue={updateFormValue}
                            options={[
                                { value: 'light', name: 'Light Mode' },
                                { value: 'dark', name: 'Dark Mode' },
                                { value: 'auto', name: 'Auto (System)' }
                            ]}
                        />
                        <SelectBox 
                            labelTitle="Language" 
                            updateType="language" 
                            defaultValue={settings.language}
                            updateFormValue={updateFormValue}
                            options={[
                                { value: 'en', name: 'English' },
                                { value: 'es', name: 'Spanish' },
                                { value: 'fr', name: 'French' },
                                { value: 'de', name: 'German' }
                            ]}
                        />
                        <SelectBox 
                            labelTitle="Date Format" 
                            updateType="dateFormat" 
                            defaultValue={settings.dateFormat}
                            updateFormValue={updateFormValue}
                            options={[
                                { value: 'MM/DD/YYYY', name: 'MM/DD/YYYY (US)' },
                                { value: 'DD/MM/YYYY', name: 'DD/MM/YYYY (EU)' },
                                { value: 'YYYY-MM-DD', name: 'YYYY-MM-DD (ISO)' }
                            ]}
                        />
                    </div>
                </div>

                <div className="divider"></div>

                {/* Security Settings */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-base-content">Security & Privacy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ToogleInput 
                            labelTitle="Two-Factor Authentication" 
                            updateType="twoFactorAuth" 
                            defaultValue={settings.twoFactorAuth} 
                            updateFormValue={updateFormValue}
                        />
                        <InputText 
                            labelTitle="Session Timeout (minutes)" 
                            type="number"
                            updateType="sessionTimeout" 
                            defaultValue={settings.sessionTimeout} 
                            updateFormValue={updateFormValue}
                        />
                        <ToogleInput 
                            labelTitle="Activity Logging" 
                            updateType="activityLogging" 
                            defaultValue={settings.activityLogging} 
                            updateFormValue={updateFormValue}
                        />
                        <SelectBox 
                            labelTitle="Profile Visibility" 
                            updateType="profileVisibility" 
                            defaultValue={settings.profileVisibility}
                            updateFormValue={updateFormValue}
                            options={[
                                { value: 'private', name: 'Private' },
                                { value: 'friends', name: 'Friends Only' },
                                { value: 'public', name: 'Public' }
                            ]}
                        />
                    </div>
                </div>

                <div className="divider"></div>

                {/* Account Preferences */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-base-content">Account Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ToogleInput 
                            labelTitle="Auto-Save" 
                            updateType="autoSave" 
                            defaultValue={settings.autoSave} 
                            updateFormValue={updateFormValue}
                        />
                        <InputText 
                            labelTitle="Auto-Save Interval (minutes)" 
                            type="number"
                            updateType="autoSaveInterval" 
                            defaultValue={settings.autoSaveInterval} 
                            updateFormValue={updateFormValue}
                        />
                        <InputText 
                            labelTitle="Data Retention (days)" 
                            type="number"
                            updateType="dataRetention" 
                            defaultValue={settings.dataRetention} 
                            updateFormValue={updateFormValue}
                        />
                        <ToogleInput 
                            labelTitle="Show Activity Status" 
                            updateType="showActivity" 
                            defaultValue={settings.showActivity} 
                            updateFormValue={updateFormValue}
                        />
                    </div>
                </div>

                <div className="divider"></div>

                {/* Update Status Message */}
                <div className="mt-6">
                    {updated && <div className="text-sm text-success">✓ Your settings have been updated successfully.</div>}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex gap-4 justify-end">
                    <button 
                        className="btn btn-outline" 
                        onClick={resetSettings}
                    >
                        Reset to Default
                    </button>
                    <button 
                        className={`btn btn-primary ${loadingStatus ? "loading" : ""}`} 
                        onClick={updateSettings}
                    >
                        {loadingStatus ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </TitleCard>
        </>
    )
}

export default GeneralSettings
