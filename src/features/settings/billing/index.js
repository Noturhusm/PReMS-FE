import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import TitleCard from "../../../components/Cards/TitleCard"
import { showNotification } from '../../common/headerSlice'
import SearchBar from '../../../components/Input/SearchBar'

const INITIAL_BILLS = [
    { invoiceNo: "#4567", amount: 23989, description: "Product usages", status: "Pending", generatedOn: moment().add(-30, 'days').format("DD MMM YYYY"), paidOn: "-" },
    { invoiceNo: "#4523", amount: 34989, description: "Product usages", status: "Pending", generatedOn: moment().add(-60, 'days').format("DD MMM YYYY"), paidOn: "-" },
    { invoiceNo: "#4453", amount: 39989, description: "Product usages", status: "Paid", generatedOn: moment().add(-90, 'days').format("DD MMM YYYY"), paidOn: moment().add(-62, 'days').format("DD MMM YYYY") },
    { invoiceNo: "#4359", amount: 28927, description: "Product usages", status: "Paid", generatedOn: moment().add(-120, 'days').format("DD MMM YYYY"), paidOn: moment().add(-92, 'days').format("DD MMM YYYY") },
    { invoiceNo: "#3359", amount: 28927, description: "Product usages", status: "Paid", generatedOn: moment().add(-150, 'days').format("DD MMM YYYY"), paidOn: moment().add(-122, 'days').format("DD MMM YYYY") },
    { invoiceNo: "#3367", amount: 28927, description: "Product usages", status: "Paid", generatedOn: moment().add(-180, 'days').format("DD MMM YYYY"), paidOn: moment().add(-152, 'days').format("DD MMM YYYY") },
    { invoiceNo: "#3359", amount: 28927, description: "Product usages", status: "Paid", generatedOn: moment().add(-210, 'days').format("DD MMM YYYY"), paidOn: moment().add(-182, 'days').format("DD MMM YYYY") },
    { invoiceNo: "#2359", amount: 28927, description: "Product usages", status: "Paid", generatedOn: moment().add(-240, 'days').format("DD MMM YYYY"), paidOn: moment().add(-212, 'days').format("DD MMM YYYY") },
]

const PAYMENT_STATUSES = ["All", "Paid", "Pending"]

function Billing(){
    const dispatch = useDispatch()
    const [bills, setBills] = useState([])
    const [filteredBills, setFilteredBills] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("All")
    const [sortKey, setSortKey] = useState("generatedOn")
    const [sortDirection, setSortDirection] = useState("desc")

    useEffect(() => {
        const savedBills = JSON.parse(localStorage.getItem('billingHistory') || 'null')
        const initial = savedBills ?? INITIAL_BILLS
        setBills(initial)
        setFilteredBills(initial)
    }, [])

    useEffect(() => {
        applyListing()
    }, [searchTerm, statusFilter, bills, sortKey, sortDirection])

    const saveBillingHistory = (data) => {
        localStorage.setItem('billingHistory', JSON.stringify(data))
    }

    const applyListing = () => {
        let list = [...bills]

        if (statusFilter !== "All") {
            list = list.filter((item) => item.status === statusFilter)
        }

        if (searchTerm.trim() !== "") {
            const lowerSearch = searchTerm.toLowerCase()
            list = list.filter((item) => {
                return (
                    item.invoiceNo.toLowerCase().includes(lowerSearch) ||
                    item.description.toLowerCase().includes(lowerSearch) ||
                    item.status.toLowerCase().includes(lowerSearch) ||
                    String(item.amount).includes(lowerSearch)
                )
            })
        }

        list.sort((a, b) => {
            if (sortKey === 'amount') {
                return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount
            }
            const dateA = moment(a.generatedOn, "DD MMM YYYY")
            const dateB = moment(b.generatedOn, "DD MMM YYYY")
            return sortDirection === 'asc' ? dateA.diff(dateB) : dateB.diff(dateA)
        })

        setFilteredBills(list)
    }

    const updateStatus = (invoiceNo) => {
        const updated = bills.map((bill) => {
            if (bill.invoiceNo === invoiceNo && bill.status === "Pending") {
                const paidOn = moment().format("DD MMM YYYY")
                return {
                    ...bill,
                    status: "Paid",
                    paidOn,
                }
            }
            return bill
        })
        setBills(updated)
        saveBillingHistory(updated)
        dispatch(showNotification({ message: `Invoice ${invoiceNo} marked as paid.`, status: 1 }))
    }

    const getPaymentBadge = (status) => {
        if (status === "Paid") return <div className="badge badge-success">Paid</div>
        if (status === "Pending") return <div className="badge badge-primary">Pending</div>
        return <div className="badge badge-ghost">{status}</div>
    }

    const toggleSort = (key) => {
        if (sortKey === key) {
            setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortKey(key)
            setSortDirection('asc')
        }
    }

    return (
        <>
            <TitleCard title="Billing History" topMargin="mt-2">
                <div className="flex flex-col lg:flex-row gap-4 mb-4 justify-between items-start lg:items-center">
                    <SearchBar searchText={searchTerm} styleClass="w-full lg:w-96" setSearchText={setSearchTerm} />
                    <div className="flex gap-3 items-center w-full lg:w-auto">
                        <label className="label-text">Status:</label>
                        <select
                            className="select select-bordered"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            {PAYMENT_STATUSES.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Invoice No</th>
                                <th onClick={() => toggleSort('generatedOn')} className="cursor-pointer">Invoice Generated On {sortKey === 'generatedOn' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                                <th>Description</th>
                                <th onClick={() => toggleSort('amount')} className="cursor-pointer">Amount {sortKey === 'amount' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
                                <th>Status</th>
                                <th>Invoice Paid On</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBills.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500">No invoices found.</td>
                                </tr>
                            ) : (
                                filteredBills.map((bill, idx) => (
                                    <tr key={idx}>
                                        <td>{bill.invoiceNo}</td>
                                        <td>{bill.generatedOn}</td>
                                        <td>{bill.description}</td>
                                        <td>${bill.amount.toLocaleString()}</td>
                                        <td>{getPaymentBadge(bill.status)}</td>
                                        <td>{bill.paidOn}</td>
                                        <td>
                                            {bill.status === 'Pending' ? (
                                                <button className="btn btn-xs btn-primary" onClick={() => updateStatus(bill.invoiceNo)}>
                                                    Mark Paid
                                                </button>
                                            ) : (
                                                <button className="btn btn-xs btn-outline" disabled>
                                                    Paid
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </TitleCard>
        </>
    )
}

export default Billing
