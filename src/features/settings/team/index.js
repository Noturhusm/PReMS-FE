import moment from "moment"
import { useState } from "react"
import { useDispatch } from "react-redux"
import TitleCard from "../../../components/Cards/TitleCard"
import { showNotification } from '../../common/headerSlice'

const ROLE_OPTIONS = ["Owner", "Admin", "Manager", "Support", "Other"]

const TEAM_MEMBERS = [
    {name : "Alex", avatar : "https://reqres.in/img/faces/1-image.jpg", email : "alex@dashwind.com", role : "Owner", joinedOn : moment(new Date()).add(-5*1, 'days').format("DD MMM YYYY"), lastActive : "5 hr ago"},
    {name : "Ereena", avatar : "https://reqres.in/img/faces/2-image.jpg", email : "ereena@dashwind.com", role : "Admin", joinedOn : moment(new Date()).add(-5*2, 'days').format("DD MMM YYYY"), lastActive : "15 min ago"},
    {name : "John", avatar : "https://reqres.in/img/faces/3-image.jpg", email : "jhon@dashwind.com", role : "Admin", joinedOn : moment(new Date()).add(-5*3, 'days').format("DD MMM YYYY"), lastActive : "20 hr ago"},
    {name : "Matrix", avatar : "https://reqres.in/img/faces/4-image.jpg", email : "matrix@dashwind.com", role : "Manager", joinedOn : moment(new Date()).add(-5*4, 'days').format("DD MMM YYYY"), lastActive : "1 hr ago"},
    {name : "Virat", avatar : "https://reqres.in/img/faces/5-image.jpg", email : "virat@dashwind.com", role : "Support", joinedOn : moment(new Date()).add(-5*5, 'days').format("DD MMM YYYY"), lastActive : "40 min ago"},
    {name : "Miya", avatar : "https://reqres.in/img/faces/6-image.jpg", email : "miya@dashwind.com", role : "Support", joinedOn : moment(new Date()).add(-5*7, 'days').format("DD MMM YYYY"), lastActive : "5 hr ago"},
]

const initialFormState = {
    name: "",
    email: "",
    joinedOn: moment().format("YYYY-MM-DD"),
    role: "Admin",
    customRole: "",
    lastActive: "Just now",
}

const TopSideButtons = ({ openInviteModal }) => {
    return(
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={openInviteModal}>Invite New</button>
        </div>
    )
}

function Team(){
    const dispatch = useDispatch()
    const [members, setMembers] = useState(TEAM_MEMBERS)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [memberForm, setMemberForm] = useState(initialFormState)
    const [errorMessage, setErrorMessage] = useState("")

    const openInviteModal = () => {
        setErrorMessage("")
        setMemberForm(initialFormState)
        setIsModalOpen(true)
    }

    const closeInviteModal = () => {
        setIsModalOpen(false)
    }

    const updateFormValue = (field, value) => {
        setMemberForm((prev) => ({ ...prev, [field]: value }))
    }

    const saveNewMember = () => {
        const roleValue = memberForm.role === "Other" ? memberForm.customRole.trim() : memberForm.role
        if (!memberForm.name.trim() || !memberForm.email.trim() || !memberForm.joinedOn.trim() || !roleValue || !memberForm.lastActive.trim()) {
            setErrorMessage("Please complete all fields before saving.")
            return
        }

        const newMember = {
            name: memberForm.name.trim(),
            avatar: "https://reqres.in/img/faces/7-image.jpg",
            email: memberForm.email.trim(),
            role: roleValue,
            joinedOn: moment(memberForm.joinedOn, "YYYY-MM-DD").format("DD MMM YYYY"),
            lastActive: memberForm.lastActive.trim(),
        }

        setMembers((prev) => [newMember, ...prev])
        setIsModalOpen(false)
        dispatch(showNotification({ message: "New team member invited successfully", status: 1 }))
    }

    const getRoleComponent = (role) => {
        if(role === "Admin") return <div className="badge badge-secondary">{role}</div>
        if(role === "Manager") return <div className="badge">{role}</div>
        if(role === "Owner") return <div className="badge badge-primary">{role}</div>
        if(role === "Support") return <div className="badge badge-accent">{role}</div>
        return <div className="badge badge-ghost">{role}</div>
    }

    return(
        <>
            <TitleCard title="Active Members" topMargin="mt-2" TopSideButtons={<TopSideButtons openInviteModal={openInviteModal} />}>
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email Id</th>
                            <th>Joined On</th>
                            <th>Role</th>
                            <th>Last Active</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                members.map((l, k) => {
                                    return(
                                        <tr key={k}>
                                            <td>
                                                <div className="flex items-center space-x-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-circle w-12 h-12">
                                                            <img src={l.avatar} alt="Avatar" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{l.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{l.email}</td>
                                            <td>{l.joinedOn}</td>
                                            <td>{getRoleComponent(l.role)}</td>
                                            <td>{l.lastActive}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </TitleCard>

            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box relative max-w-3xl">
                        <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeInviteModal}>✕</button>
                        <h3 className="text-lg font-bold">Invite New Team Member</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text">Name</span></label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={memberForm.name}
                                    onChange={(e) => updateFormValue('name', e.target.value)}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text">Email Id</span></label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full"
                                    value={memberForm.email}
                                    onChange={(e) => updateFormValue('email', e.target.value)}
                                    placeholder="name@example.com"
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text">Joined On</span></label>
                                <input
                                    type="date"
                                    className="input input-bordered w-full"
                                    value={memberForm.joinedOn}
                                    onChange={(e) => updateFormValue('joinedOn', e.target.value)}
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text">Role</span></label>
                                <select
                                    className="select select-bordered w-full"
                                    value={memberForm.role}
                                    onChange={(e) => updateFormValue('role', e.target.value)}
                                >
                                    {ROLE_OPTIONS.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            {memberForm.role === "Other" && (
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text">Custom Role</span></label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={memberForm.customRole}
                                        onChange={(e) => updateFormValue('customRole', e.target.value)}
                                        placeholder="Enter custom role"
                                    />
                                </div>
                            )}
                            <div className="form-control w-full md:col-span-2">
                                <label className="label"><span className="label-text">Last Active</span></label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={memberForm.lastActive}
                                    onChange={(e) => updateFormValue('lastActive', e.target.value)}
                                    placeholder="e.g. 5 hr ago"
                                />
                            </div>
                        </div>
                        {errorMessage && <div className="text-sm text-error mt-4">{errorMessage}</div>}
                        <div className="modal-action mt-6 justify-end">
                            <button className="btn btn-ghost" type="button" onClick={closeInviteModal}>Cancel</button>
                            <button className="btn btn-primary" type="button" onClick={saveNewMember}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Team
