import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { showNotification } from "../common/headerSlice"
import TitleCard from "../../components/Cards/TitleCard"
import { RECENT_TRANSACTIONS } from "../../utils/dummyData"
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import SearchBar from "../../components/Input/SearchBar"
import ChevronUpIcon from '@heroicons/react/24/outline/ChevronUpDownIcon'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'

const ITEMS_PER_PAGE = 10

const TopSideButtons = ({removeFilter, applyFilter, applySearch, minAmount, maxAmount, setMinAmount, setMaxAmount, openCreateModal}) => {

    const [filterParam, setFilterParam] = useState("")
    const [searchText, setSearchText] = useState("")
    const locationFilters = ["Paris", "London", "Canada", "Peru", "Tokyo", "US", "Japan"]

    const showFiltersAndApply = (params) => {
        applyFilter(params)
        setFilterParam(params)
    }

    const removeAppliedFilter = () => {
        removeFilter()
        setFilterParam("")
        setSearchText("")
    }

    useEffect(() => {
        if(searchText == ""){
            removeAppliedFilter()
        }else{
            applySearch(searchText)
        }
    }, [searchText])

    return(
        <div className="inline-block float-right">
            <button className="btn btn-primary btn-sm mr-4" onClick={openCreateModal}>
                <PlusIcon className="w-5 mr-2"/>Add Transaction
            </button>
            <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText}/>
            {filterParam != "" && <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">{filterParam}<XMarkIcon className="w-4 ml-2"/></button>}
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2"/>Filter</label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
                    {
                        locationFilters.map((l, k) => {
                            return  <li key={k}><a onClick={() => showFiltersAndApply(l)}>{l}</a></li>
                        })
                    }
                    <div className="divider mt-0 mb-0"></div>
                    <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
                </ul>
            </div>
        </div>
    )
}

function Transactions(){
    const dispatch = useDispatch()
    const [transactions, setTransactions] = useState(RECENT_TRANSACTIONS.map((t, i) => ({ ...t, invoiceNo: i + 1 })))
    const [filteredTransactions, setFilteredTransactions] = useState(RECENT_TRANSACTIONS.map((t, i) => ({ ...t, invoiceNo: i + 1 })))
    const [currentPage, setCurrentPage] = useState(1)
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })
    const [minAmount, setMinAmount] = useState(0)
    const [maxAmount, setMaxAmount] = useState(1000)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editForm, setEditForm] = useState({ name: "", email: "", location: "", amount: "", date: moment().format("YYYY-MM-DD") })
    const [editingIndex, setEditingIndex] = useState(null)
    const [editError, setEditError] = useState("")
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [viewTransaction, setViewTransaction] = useState(null)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [createForm, setCreateForm] = useState({ name: "", email: "", location: "", amount: "", date: moment().format("YYYY-MM-DD") })
    const [createError, setCreateError] = useState("")

    // Calculate pagination
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const removeFilter = () => {
        setFilteredTransactions(transactions)
        setCurrentPage(1)
    }

    const applyFilter = (params) => {
        let filteredTrans = transactions.filter((t) => t.location === params)
        setFilteredTransactions(filteredTrans)
        setCurrentPage(1)
    }

    // Search by name, email, location
    const applySearch = (value) => {
        let filteredTrans = transactions.filter((t) => {
            return (
                t.name.toLowerCase().includes(value.toLowerCase()) ||
                t.email.toLowerCase().includes(value.toLowerCase()) ||
                t.location.toLowerCase().includes(value.toLowerCase())
            )
        })
        setFilteredTransactions(filteredTrans)
        setCurrentPage(1)
    }

    const openEditModal = (transaction) => {
        const index = transactions.findIndex((t) => t.invoiceNo === transaction.invoiceNo)
        if (index < 0) return

        setEditingIndex(index)
        setEditForm({
            name: transaction.name,
            email: transaction.email,
            location: transaction.location,
            amount: transaction.amount.toString(),
            date: moment(transaction.date).format("YYYY-MM-DD")
        })
        setEditError("")
        setIsEditModalOpen(true)
    }

    const closeEditModal = () => {
        setIsEditModalOpen(false)
        setEditError("")
    }

    const handleEditChange = (field, value) => {
        setEditForm((prev) => ({ ...prev, [field]: value }))
    }

    const saveEditTransaction = () => {
        if (!editForm.name.trim() || !editForm.email.trim() || !editForm.location.trim() || !editForm.amount.trim() || !editForm.date.trim()) {
            setEditError("Please complete all fields before saving.")
            return
        }

        const updatedTransactions = [...transactions]
        const updatedTransaction = {
            ...updatedTransactions[editingIndex],
            name: editForm.name.trim(),
            email: editForm.email.trim(),
            location: editForm.location.trim(),
            amount: Number(editForm.amount),
            date: moment(editForm.date, "YYYY-MM-DD").toDate()
        }
        updatedTransactions[editingIndex] = updatedTransaction

        setTransactions(updatedTransactions)
        setFilteredTransactions((prev) => prev.map((item) => item.invoiceNo === updatedTransaction.invoiceNo ? updatedTransaction : item))
        setIsEditModalOpen(false)
        dispatch(showNotification({ message: `Transaction updated for ${editForm.name}`, status: 1 }))
    }

    // Sort transactions
    const handleSort = (key) => {
        let direction = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })

        let sorted = [...filteredTransactions].sort((a, b) => {
            const aVal = a[key]
            const bVal = b[key]
            
            if (key === 'date') {
                return direction === 'asc' 
                    ? new Date(aVal) - new Date(bVal)
                    : new Date(bVal) - new Date(aVal)
            } else if (key === 'amount') {
                return direction === 'asc' ? aVal - bVal : bVal - aVal
            } else {
                return direction === 'asc' 
                    ? String(aVal).localeCompare(String(bVal))
                    : String(bVal).localeCompare(String(aVal))
            }
        })
        setFilteredTransactions(sorted)
    }

    // View transaction details
    const handleViewTransaction = (transaction) => {
        setViewTransaction(transaction)
        setIsViewModalOpen(true)
    }

    const closeViewModal = () => {
        setIsViewModalOpen(false)
        setViewTransaction(null)
    }

    // Edit transaction
    const handleEditTransaction = (transaction) => {
        openEditModal(transaction)
    }

    // Delete transaction
    const handleDeleteTransaction = (transaction, index) => {
        const filteredIndex = filteredTransactions.findIndex((t) => t.invoiceNo === transaction.invoiceNo)
        if (filteredIndex < 0) return

        const newFiltered = filteredTransactions.filter((_, i) => i !== filteredIndex)
        setFilteredTransactions(newFiltered)

        const newTransactions = transactions.filter((t) => t.invoiceNo !== transaction.invoiceNo)
        setTransactions(newTransactions)

        dispatch(showNotification({
            message: `Transaction from ${transaction.name} deleted successfully`,
            status: 1
        }))
    }

    // Create transaction
    const openCreateModal = () => {
        setCreateForm({ name: "", email: "", location: "", amount: "", date: moment().format("YYYY-MM-DD") })
        setCreateError("")
        setIsCreateModalOpen(true)
    }

    const closeCreateModal = () => {
        setIsCreateModalOpen(false)
        setCreateError("")
    }

    const handleCreateChange = (field, value) => {
        setCreateForm((prev) => ({ ...prev, [field]: value }))
    }

    const saveCreateTransaction = () => {
        if (!createForm.name.trim() || !createForm.email.trim() || !createForm.location.trim() || !createForm.amount.trim() || !createForm.date.trim()) {
            setCreateError("Please complete all fields before saving.")
            return
        }

        const newInvoiceNo = Math.max(...transactions.map(t => t.invoiceNo || 0), 0) + 1
        const newTransaction = {
            invoiceNo: newInvoiceNo,
            name: createForm.name.trim(),
            email: createForm.email.trim(),
            location: createForm.location.trim(),
            amount: Number(createForm.amount),
            date: moment(createForm.date, "YYYY-MM-DD").toDate(),
            avatar: "https://reqres.in/img/faces/1-image.jpg" // Default avatar
        }

        const updatedTransactions = [...transactions, newTransaction]
        setTransactions(updatedTransactions)
        setFilteredTransactions(updatedTransactions)
        setIsCreateModalOpen(false)
        dispatch(showNotification({ message: `Transaction created for ${createForm.name}`, status: 1 }))
    }

    const SortableHeader = ({ label, sortKey }) => {
        const isActive = sortConfig.key === sortKey
        const arrow = isActive ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ''
        
        return (
            <th 
                onClick={() => handleSort(sortKey)}
                className="cursor-pointer hover:bg-base-200 select-none"
            >
                {label}{arrow}
            </th>
        )
    }

    return(
        <>
            <TitleCard 
                title="Recent Transactions" 
                topMargin="mt-2" 
                TopSideButtons={<TopSideButtons 
                    applySearch={applySearch} 
                    applyFilter={applyFilter} 
                    removeFilter={removeFilter}
                    minAmount={minAmount}
                    maxAmount={maxAmount}
                    setMinAmount={setMinAmount}
                    setMaxAmount={setMaxAmount}
                    openCreateModal={openCreateModal}
                />}
            >
                {/* Transaction Table */}
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email Id</th>
                                <th>Location</th>
                                <SortableHeader label="Amount" sortKey="amount" />
                                <SortableHeader label="Transaction Date" sortKey="date" />
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                paginatedTransactions.length > 0 ? (
                                    paginatedTransactions.map((transaction, k) => {
                                        return(
                                            <tr key={k} className="hover:bg-base-100">
                                                <td>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="avatar">
                                                            <div className="mask mask-circle w-10 h-10">
                                                                <img src={transaction.avatar} alt="Avatar" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-sm">{transaction.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="text-sm">{transaction.email}</span>
                                                </td>
                                                <td>
                                                    <span className="badge badge-lg">{transaction.location}</span>
                                                </td>
                                                <td>
                                                    <span className="font-semibold text-success">${transaction.amount}</span>
                                                </td>
                                                <td>
                                                    <span className="text-sm text-gray-500">{moment(transaction.date).format("DD MMM YYYY")}</span>
                                                </td>
                                                <td>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            className="btn btn-ghost btn-xs"
                                                            onClick={() => handleViewTransaction(transaction)}
                                                            title="View"
                                                        >
                                                            <EyeIcon className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            className="btn btn-ghost btn-xs"
                                                            onClick={() => openEditModal(transaction)}
                                                            title="Edit"
                                                        >
                                                            <PencilIcon className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            className="btn btn-ghost btn-xs text-error"
                                                            onClick={() => handleDeleteTransaction(transaction, k)}
                                                            title="Delete"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-gray-500">
                                            No transactions found
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>

                {isEditModalOpen && (
                    <div className="modal modal-open">
                        <div className="modal-box relative max-w-3xl">
                            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeEditModal}>✕</button>
                            <h3 className="text-lg font-bold">Edit Transaction</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text">Name</span></label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={editForm.name}
                                        onChange={(e) => handleEditChange('name', e.target.value)}
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text">Email Id</span></label>
                                    <input
                                        type="email"
                                        className="input input-bordered w-full"
                                        value={editForm.email}
                                        onChange={(e) => handleEditChange('email', e.target.value)}
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text">Location</span></label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={editForm.location}
                                        onChange={(e) => handleEditChange('location', e.target.value)}
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text">Amount</span></label>
                                    <input
                                        type="number"
                                        className="input input-bordered w-full"
                                        value={editForm.amount}
                                        onChange={(e) => handleEditChange('amount', e.target.value)}
                                    />
                                </div>
                                <div className="form-control w-full md:col-span-2">
                                    <label className="label"><span className="label-text">Transaction Date</span></label>
                                    <input
                                        type="date"
                                        className="input input-bordered w-full"
                                        value={editForm.date}
                                        onChange={(e) => handleEditChange('date', e.target.value)}
                                    />
                                </div>
                            </div>
                            {editError && <div className="text-sm text-error mt-4">{editError}</div>}
                            <div className="modal-action mt-6 justify-end">
                                <button className="btn btn-ghost" type="button" onClick={closeEditModal}>Cancel</button>
                                <button className="btn btn-primary" type="button" onClick={saveEditTransaction}>Save</button>
                            </div>
                        </div>
                    </div>
                )}

                {isViewModalOpen && viewTransaction && (
                    <div className="modal modal-open">
                        <div className="modal-box relative max-w-3xl">
                            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeViewModal}>✕</button>
                            <h3 className="text-lg font-bold">View Transaction</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text">Name</span></label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={viewTransaction.name}
                                        readOnly
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text">Email Id</span></label>
                                    <input
                                        type="email"
                                        className="input input-bordered w-full"
                                        value={viewTransaction.email}
                                        readOnly
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text">Location</span></label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={viewTransaction.location}
                                        readOnly
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text">Amount</span></label>
                                    <input
                                        type="number"
                                        className="input input-bordered w-full"
                                        value={viewTransaction.amount}
                                        readOnly
                                    />
                                </div>
                                <div className="form-control w-full md:col-span-2">
                                    <label className="label"><span className="label-text">Transaction Date</span></label>
                                    <input
                                        type="date"
                                        className="input input-bordered w-full"
                                        value={moment(viewTransaction.date).format("YYYY-MM-DD")}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="modal-action mt-6 justify-end">
                                <button className="btn btn-ghost" type="button" onClick={closeViewModal}>Close</button>
                            </div>
                        </div>
                    </div>
                )}

                {isCreateModalOpen && (
                    <div className="modal modal-open">
                        <div className="modal-box relative max-w-3xl">
                            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={closeCreateModal}>✕</button>
                            <h3 className="text-lg font-bold">Create Transaction</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text">Name</span></label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={createForm.name}
                                        onChange={(e) => handleCreateChange('name', e.target.value)}
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text">Email Id</span></label>
                                    <input
                                        type="email"
                                        className="input input-bordered w-full"
                                        value={createForm.email}
                                        onChange={(e) => handleCreateChange('email', e.target.value)}
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text">Location</span></label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={createForm.location}
                                        onChange={(e) => handleCreateChange('location', e.target.value)}
                                    />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text">Amount</span></label>
                                    <input
                                        type="number"
                                        className="input input-bordered w-full"
                                        value={createForm.amount}
                                        onChange={(e) => handleCreateChange('amount', e.target.value)}
                                    />
                                </div>
                                <div className="form-control w-full md:col-span-2">
                                    <label className="label"><span className="label-text">Transaction Date</span></label>
                                    <input
                                        type="date"
                                        className="input input-bordered w-full"
                                        value={createForm.date}
                                        onChange={(e) => handleCreateChange('date', e.target.value)}
                                    />
                                </div>
                            </div>
                            {createError && <div className="text-sm text-error mt-4">{createError}</div>}
                            <div className="modal-action mt-6 justify-end">
                                <button className="btn btn-ghost" type="button" onClick={closeCreateModal}>Cancel</button>
                                <button className="btn btn-primary" type="button" onClick={saveCreateTransaction}>Create</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6 px-4">
                        <div className="text-sm text-gray-500">
                            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length} transactions
                        </div>
                        <div className="btn-group">
                            <button 
                                className="btn btn-sm"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                                «
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    className={`btn btn-sm ${currentPage === page ? 'btn-active' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button 
                                className="btn btn-sm"
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                            >
                                »
                            </button>
                        </div>
                    </div>
                )}
            </TitleCard>
        </>
    )
}

export default Transactions
