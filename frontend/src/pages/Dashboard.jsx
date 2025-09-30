import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [newAccountUser, setNewAccountUser] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");

  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  // Debug: make sure token is present
  console.log("JWT Token:", token);

  // Axios instance with JWT token
  const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Fetch accounts
  const fetchAccounts = async () => {
    try {
      const res = await api.post("/api/accounts/list", { username });
      setAccounts(res.data);
    } catch (err) {
      console.error("Fetch accounts error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) handleLogout();
    }
  };

  // Create account
  const createAccount = async () => {
    if (!newAccountUser) return;
    try {
      console.log("Creating account for:", newAccountUser);
      await api.post("/api/accounts", { username: newAccountUser });
      setNewAccountUser("");
      fetchAccounts();
    } catch (err) {
      console.error("Create account error:", err);
    }
  };

  // View transactions
  const viewTransactions = async (account) => {
    setSelectedAccount(account);
    try {
      const res = await api.get(`/api/transactions/${account.id}`);
      setTransactions(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("View transactions error:", err);
    }
  };

  // Deposit
  const handleDeposit = async () => {
    if (!selectedAccount || !amount) return;
    try {
      await api.post("/api/transactions/deposit", {
        accountId: selectedAccount.id,
        amount: parseFloat(amount),
      });
      setAmount("");
      fetchAccounts();
      viewTransactions(selectedAccount);
    } catch (err) {
      console.error("Deposit error:", err);
    }
  };

  // Withdraw
  const handleWithdraw = async () => {
    if (!selectedAccount || !amount) return;
    try {
      await api.post("/api/transactions/withdraw", {
        accountId: selectedAccount.id,
        amount: parseFloat(amount),
      });
      setAmount("");
      fetchAccounts();
      viewTransactions(selectedAccount);
    } catch (err) {
      console.error("Withdraw error:", err);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  useEffect(() => {
    if (!token) {
      handleLogout();
    } else {
      fetchAccounts();
    }
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Create Account */}
      <div className="mb-3 d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="New account username"
          value={newAccountUser}
          onChange={(e) => setNewAccountUser(e.target.value)}
        />
        <button className="btn btn-success" onClick={createAccount}>
          Create Account
        </button>
      </div>

      {/* Accounts Table */}
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc.id}>
              <td>{acc.id}</td>
              <td>{acc.user?.username || acc.username}</td>
              <td>{acc.balance}</td>
              <td>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => viewTransactions(acc)}
                >
                  Transactions
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Transactions Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Transactions for {selectedAccount?.user?.username || selectedAccount?.username}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3 d-flex">
            <input
              type="number"
              className="form-control me-2"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="btn btn-success me-2" onClick={handleDeposit}>
              Deposit
            </button>
            <button className="btn btn-warning" onClick={handleWithdraw}>
              Withdraw
            </button>
          </div>

          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.id}</td>
                    <td>{tx.amount}</td>
                    <td>{tx.date}</td>
                    <td>{tx.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}