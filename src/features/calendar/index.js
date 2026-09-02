import { useEffect, useState } from 'react'
import CalendarView from '../../components/CalendarView'
import moment from 'moment'
import { CALENDAR_INITIAL_EVENTS } from '../../utils/dummyData'
import { useDispatch } from 'react-redux'
import { openRightDrawer } from '../common/rightDrawerSlice'
import { RIGHT_DRAWER_TYPES } from '../../utils/globalConstantUtil'
import { showNotification } from '../common/headerSlice'
import api from '../../axios'

const INITIAL_EVENTS = CALENDAR_INITIAL_EVENTS
const EVENT_THEMES = ["BLUE", "GREEN", "PURPLE", "ORANGE", "PINK"]
// Toggle API usage. Set to true when your backend /api/events is ready.
const USE_API = false

function Calendar(){

    const dispatch = useDispatch()

    const [events, setEvents] = useState(() => {
        try {
            const stored = localStorage.getItem('calendar_events')
            if(stored){
                const parsed = JSON.parse(stored)
                return parsed.map((e, idx) => ({ ...e, id: e.id || `evt-${idx}-${moment(e.startTime).valueOf()}`}))
            }
        } catch (err) {
            // ignore
        }
        return INITIAL_EVENTS.map((e, idx) => ({ ...e, id: e.id || `evt-${idx}-${moment(e.startTime).valueOf()}`}))
    })
    const persistEvents = (items) => {
        try { localStorage.setItem('calendar_events', JSON.stringify(items)) } catch (e) {}
    }
    const [projects, setProjects] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [eventError, setEventError] = useState("")
    const [isEditMode, setIsEditMode] = useState(false)
    const [selectedEventId, setSelectedEventId] = useState(null)
    const [eventForm, setEventForm] = useState({
        title : "",
        date : moment().format('YYYY-MM-DD'),
        startTime : "09:00",
        endTime : "10:00",
        projectId : "",
        theme : "BLUE",
        description : ""
    })

    const eventSuggestions = [...new Set(INITIAL_EVENTS.map((event) => event.title))]

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const { data } = await api.get('/projects')
                const items = Array.isArray(data) ? data : data.data || []
                setProjects(items)
            } catch (err) {
                console.error(err)
                setProjects([])
            }
        }
        loadProjects()
    }, [])

    const openAddEventModal = (date) => {
        const targetDate = date ? moment(date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
        setEventForm({
            title : "",
            date : targetDate,
            startTime : "09:00",
            endTime : "10:00",
            projectId : "",
            theme : "BLUE",
            description : ""
        })
        setEventError("")
        setIsEditMode(false)
        setSelectedEventId(null)
        setIsModalOpen(true)
    }

    const openEditEventModal = (event) => {
        if(!event) return
        const date = moment(event.startTime).format('YYYY-MM-DD')
        const startTime = moment(event.startTime).format('HH:mm')
        const endTime = moment(event.endTime).format('HH:mm')
        // try to find projectId if projectName exists
        const project = event.projectName ? projects.find((p) => p.name === event.projectName) : null
        setEventForm({
            title : event.title || "",
            date,
            startTime,
            endTime,
            projectId : project ? project.id : "",
            theme : event.theme || "BLUE",
            description : event.description || ""
        })
        setEventError("")
        setIsEditMode(true)
        setSelectedEventId(event.id || null)
        setIsModalOpen(true)
    }

    const updateFormValue = (field, value) => {
        setEventForm((prev) => ({ ...prev, [field] : value }))
    }

    const saveEvent = async () => {
        try {
            if(!eventForm.title || !eventForm.title.trim()) return setEventError("Event title is required.")
            if(!eventForm.date) return setEventError("Event date is required.")

            const start = moment(`${eventForm.date} ${eventForm.startTime}`, 'YYYY-MM-DD HH:mm')
            const end = moment(`${eventForm.date} ${eventForm.endTime}`, 'YYYY-MM-DD HH:mm')
            if(!end.isAfter(start)) return setEventError("End time must be after start time.")

            const project = Array.isArray(projects) ? projects.find((item) => item.id === eventForm.projectId) : null
            const projectName = project ? project.name : ""
            const title = projectName ? `${projectName} - ${eventForm.title}` : eventForm.title

            const newEvent = {
                title,
                theme : eventForm.theme,
                startTime : start,
                endTime : end,
                projectName,
                description : eventForm.description,
            }

            // debug logging to help trace runtime errors
            // eslint-disable-next-line no-console
            console.log('saveEvent debug', { isEditMode, selectedEventId, projectsType: Array.isArray(projects), eventsType: Array.isArray(events) })

            if(isEditMode && selectedEventId){
                if(USE_API){
                    try {
                        await api.put(`/events/${selectedEventId}`, {
                            title,
                            theme : eventForm.theme,
                            startTime : start.toISOString(),
                            endTime : end.toISOString(),
                            projectName,
                            description : eventForm.description,
                        })
                    } catch (e) {
                        // ignore server errors, continue local update
                        // eslint-disable-next-line no-console
                        console.warn('API update failed', e)
                    }
                }

                const updatedEvent = { ...newEvent, id: selectedEventId }
                const updatedEvents = (Array.isArray(events) ? events.map((ev) => ev.id === selectedEventId ? updatedEvent : ev) : [updatedEvent])
                setEvents(updatedEvents)
                persistEvents(updatedEvents)
                setIsEditMode(false)
                setSelectedEventId(null)
                setIsModalOpen(false)
                dispatch(showNotification({ message : `Event updated${projectName ? ` in ${projectName}` : ''}`, status : 1 }))
            } else {
                let serverRes = null
                if(USE_API){
                    try {
                        serverRes = await api.post('/events', {
                            title,
                            theme : eventForm.theme,
                            startTime : start.toISOString(),
                            endTime : end.toISOString(),
                            projectName,
                            description : eventForm.description,
                        })
                    } catch (e) {
                        // ignore server create errors
                        // eslint-disable-next-line no-console
                        console.warn('API create failed', e)
                    }
                }

                const evt = { ...newEvent, id: serverRes && serverRes.data && serverRes.data.id ? serverRes.data.id : `evt-${Date.now()}` }
                const newEventsArr = (Array.isArray(events) ? [...events, evt] : [evt])
                setEvents(newEventsArr)
                persistEvents(newEventsArr)
                setIsModalOpen(false)
                dispatch(showNotification({ message : `Event added${projectName ? ` to ${projectName}` : ''}`, status : 1 }))
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('saveEvent caught', err)
            dispatch(showNotification({ message : `Unable to save event`, status : 0 }))
        }
    }

    const deleteEvent = async () => {
        if(!selectedEventId) return
        if(!window.confirm('Delete this event?')) return
        if(USE_API){
            try {
                await api.delete(`/events/${selectedEventId}`).catch(() => {})
            } catch (err) {
                console.error(err)
            }
        }
        const remaining = events.filter((ev) => ev.id !== selectedEventId)
        setEvents(remaining)
        persistEvents(remaining)
        setIsModalOpen(false)
        setIsEditMode(false)
        setSelectedEventId(null)
        dispatch(showNotification({ message : `Event deleted`, status : 1 }))
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEventError("")
        setIsEditMode(false)
        setSelectedEventId(null)
    }

    const openDayDetail = ({filteredEvents, title}) => {
        dispatch(openRightDrawer({header : title, bodyType : RIGHT_DRAWER_TYPES.CALENDAR_EVENTS, extraObject : {filteredEvents}}))
    }

    return(
        <>
         <CalendarView 
             calendarEvents={events}
             addNewEvent={openAddEventModal}
             openDayDetail={openDayDetail}
             onEventClick={openEditEventModal}
         />

           <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
                <div className="modal-box max-w-xl">
                    <h3 className="font-bold text-lg">Add Calendar Event</h3>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label className="label"><span className="label-text">Event Title</span></label>
                            <input type="text" value={eventForm.title} onChange={(e) => updateFormValue('title', e.target.value)} className="input input-bordered w-full" placeholder="Event title" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label"><span className="label-text">Date</span></label>
                                <input type="date" value={eventForm.date} onChange={(e) => updateFormValue('date', e.target.value)} className="input input-bordered w-full" />
                            </div>
                            <div>
                                <label className="label"><span className="label-text">Project</span></label>
                                <select value={eventForm.projectId} onChange={(e) => updateFormValue('projectId', e.target.value)} className="select select-bordered w-full">
                                    <option value="">Choose project (optional)</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>{project.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="label"><span className="label-text">Start Time</span></label>
                                <input type="time" value={eventForm.startTime} onChange={(e) => updateFormValue('startTime', e.target.value)} className="input input-bordered w-full" />
                            </div>
                            <div>
                                <label className="label"><span className="label-text">End Time</span></label>
                                <input type="time" value={eventForm.endTime} onChange={(e) => updateFormValue('endTime', e.target.value)} className="input input-bordered w-full" />
                            </div>
                            <div>
                                <label className="label"><span className="label-text">Theme</span></label>
                                <select value={eventForm.theme} onChange={(e) => updateFormValue('theme', e.target.value)} className="select select-bordered w-full">
                                    {EVENT_THEMES.map((theme) => (
                                        <option key={theme} value={theme}>{theme}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="label"><span className="label-text">Suggested Title</span></label>
                            <select value={eventForm.title} onChange={(e) => updateFormValue('title', e.target.value)} className="select select-bordered w-full">
                                <option value="">Use dummy title</option>
                                {eventSuggestions.map((suggestion, index) => (
                                    <option key={index} value={suggestion}>{suggestion}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label"><span className="label-text">Description</span></label>
                            <textarea value={eventForm.description} onChange={(e) => updateFormValue('description', e.target.value)} className="textarea textarea-bordered w-full" placeholder="Optional event notes"></textarea>
                        </div>
                        {eventError && <div className="text-sm text-error">{eventError}</div>}
                    </div>
                    <div className="modal-action">
                        <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                        {isEditMode && <button className="btn btn-error" onClick={deleteEvent}>Delete</button>}
                        <button className="btn btn-primary" onClick={saveEvent}>{isEditMode ? 'Update Event' : 'Save Event'}</button>
                    </div>
                </div>
           </div>
        </>
    )
}

export default Calendar