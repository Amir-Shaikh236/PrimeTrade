import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Trash2, Plus, LogOut, Pencil, X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function Trades() {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ symbol: "", entryPrice: "", notes: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const userString = localStorage.getItem("user");
    let currentUser = null;
    try {
        if (userString && userString !== "undefined") {
            currentUser = JSON.parse(userString);
        }
    } catch (error) {
        console.error("Corrupt data found");
        localStorage.clear();
    }

    const isAdmin = currentUser?.role === 'admin';
    const currentUserId = currentUser?.id || currentUser?._id;

    const navigate = useNavigate();

    useEffect(() => {
        fetchTrades();
    }, []);

    const fetchTrades = async () => {
        try {
            const { data } = await API.get("/trades");
            setTrades(data);
        } catch (error) {
            if (error.response?.status === 401) handleLogout();
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.symbol || !formData.entryPrice) return;

        setIsSubmitting(true);
        try {
            if (editingId) {
                const { data } = await API.put(`/trades/${editingId}`, formData);
                const oldTrade = trades.find(t => t._id === editingId);
                const updatedTrade = { ...data, user: oldTrade.user };

                setTrades(trades.map(t => (t._id === editingId ? updatedTrade : t)));
                toast.success("Trade Updated");
                handleCancelEdit();
            } else {
                const { data } = await API.post("/trades", formData);
                const userEmail = currentUser.email || (currentUser.user && currentUser.user.email);
                const uiUser = { _id: currentUserId, email: userEmail };

                const newTrade = { ...data, user: uiUser };

                setTrades([newTrade, ...trades]);
                setFormData({ symbol: "", entryPrice: "", notes: "" });
                toast.success("Trade Added");
            }
        } catch (error) {
            console.error(error);
            toast.error("Operation failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (trade) => {
        setEditingId(trade._id);
        setFormData({ symbol: trade.symbol, entryPrice: trade.entryPrice, notes: trade.notes });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ symbol: "", entryPrice: "", notes: "" });
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this?")) return;
        const previousTrades = [...trades];
        setTrades(trades.filter((t) => t._id !== id));
        try {
            await API.delete(`/trades/${id}`);
            toast.success("Deleted");
        } catch (error) {
            setTrades(previousTrades);
            toast.error("Failed to delete");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login", { replace: true });
        toast.info("Logged out");
    };

    const isMyTrade = (trade) => {
        if (!trade.user) return false;
        if (typeof trade.user === 'object') {
            return trade.user._id === currentUserId;
        }
        return trade.user === currentUserId;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                            Dashboard
                            {isAdmin && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                    <ShieldAlert className="w-3 h-3 mr-1" /> ADMIN MODE
                                </span>
                            )}
                        </h1>
                        <p className="text-gray-500">
                            {isAdmin ? "Viewing ALL system trades." : "Manage your active trading positions."}
                        </p>
                    </div>
                    <Button variant="destructive" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </div>

                <Card className={editingId ? "border-blue-500 border-2" : ""}>
                    <CardHeader>
                        <CardTitle className="text-lg flex justify-between items-center">
                            {editingId ? "Edit Trade" : "Add New Trade"}
                            {editingId && (
                                <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="text-gray-500">
                                    Cancel <X className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                            <div className="grid w-full gap-2">
                                <Input
                                    placeholder="Symbol"
                                    value={formData.symbol}
                                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="grid w-full gap-2">
                                <Input
                                    type="number"
                                    placeholder="Price"
                                    value={formData.entryPrice}
                                    onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                                />
                            </div>
                            <div className="grid w-full gap-2">
                                <Input
                                    placeholder="Notes"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className={editingId ? "bg-blue-600" : ""}>
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? "" : <Plus className="h-4 w-4" />}
                                <span className="ml-2">{editingId ? "Update" : "Add"}</span>
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-8">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Symbol</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Notes</TableHead>
                                    {isAdmin && <TableHead>User ID</TableHead>}
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={5} className="text-center h-24">Loading...</TableCell></TableRow>
                                ) : trades.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center h-24 text-gray-500">No trades found.</TableCell></TableRow>
                                ) : (
                                    trades.map((trade) => (
                                        <TableRow key={trade._id} className={editingId === trade._id ? "bg-blue-50" : ""}>
                                            <TableCell className="font-medium">{trade.symbol}</TableCell>
                                            <TableCell>${trade.entryPrice}</TableCell>
                                            <TableCell className="text-gray-500">{trade.notes || "-"}</TableCell>

                                            {isAdmin && (
                                                <TableCell className="text-xs text-blue-600 font-mono">
                                                    {typeof trade.user === 'object' ? trade.user.email : trade.user}
                                                </TableCell>
                                            )}

                                            <TableCell className="text-right space-x-2">

                                                {isMyTrade(trade) && (
                                                    <Button variant="outline" size="icon" onClick={() => handleEditClick(trade)}>
                                                        <Pencil className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                )}

                                                {(isMyTrade(trade) || isAdmin) && (
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="text-red-500 hover:bg-red-50"
                                                        onClick={() => handleDelete(trade._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}

                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}