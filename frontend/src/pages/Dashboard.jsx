import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 

const TECHNICAL_EXPLANATION = "A **full-stack financial portfolio management application** demonstrating proficiency in enterprise-grade development. The robust backend is engineered with **Java and the Spring Boot framework**, exposing secure RESTful APIs. Security is prioritized through the implementation of **JSON Web Token (JWT) authentication** for stateless user management and secure communication via **HTTPS**. The modern frontend is built with **React and Vite**. The entire application utilizes a modern DevOps workflow, being **Dockerized** and deployed on a **Microsoft Azure Virtual Machine** leveraging a scalable **Azure PostgreSQL database** for persistence.";

const api = axios.create({
  baseURL: "http://20.199.81.36", 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const TransactionModal = ({ show, onClose, account, transactions, amount, setAmount, handleDeposit, handleWithdraw }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden transform transition-transform duration-300 scale-100">
        
        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-teal-50">
          <h3 className="text-xl font-bold text-gray-800">
            Transactions for Account: {account?.name || 'N/A'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row mb-4 space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-150"
              placeholder="Amount"
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*\.?\d*$/.test(val)) setAmount(val);
              }}
            />
            <button 
              className="px-4 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-150" 
              onClick={handleDeposit}
            >
              Deposit
            </button>
            <button 
              className="px-4 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-150" 
              onClick={handleWithdraw}
            >
              Withdraw
            </button>
          </div>

          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No transactions found for this account.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg border border-gray-200">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-teal-50/50 transition duration-100">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {tx.amount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition duration-150"
            onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [newAccountName, setNewAccountName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");

  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  }, [navigate]);

  const fetchAccounts = useCallback(async () => {
    try {
      const res = await api.post("/api/accounts/list", { username });
      setAccounts(res.data);
    } catch (err) {
      console.error("Fetch accounts error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) handleLogout();
    }
  }, [username, handleLogout]);

  const createAccount = async () => {
    if (!newAccountName) return;
    try {
      await api.post("/api/accounts/create", { accountName: newAccountName });
      setNewAccountName("");
      fetchAccounts();
    } catch (err) {
      console.error("Create account error:", err);
    }
  };

  const viewTransactions = useCallback(async (account) => {
    setSelectedAccount(account);
    try {
      const res = await api.get(`/api/transactions/${account.id}`);
      setTransactions(res.data);
      setShowModal(true);
      setAmount(""); 
    } catch (err) {
      console.error("View transactions error:", err);
    }
  }, []);

  const handleDeposit = async () => {
    if (!selectedAccount || !amount) return;
    try {
      await api.post("/api/transactions/deposit", {
        accountId: selectedAccount.id,
        amount: parseFloat(amount),
      });
      setAmount("");
      await fetchAccounts(); 
      await viewTransactions(selectedAccount); 
    } catch (err) {
      console.error("Deposit error:", err);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedAccount || !amount) return;
    try {
      await api.post("/api/transactions/withdraw", {
        accountId: selectedAccount.id,
        amount: parseFloat(amount),
      });
      setAmount("");
      await fetchAccounts();
      await viewTransactions(selectedAccount);
    } catch (err) {
      console.error("Withdraw error:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleLogout();
    } else {
      fetchAccounts();
    }
  }, [handleLogout, fetchAccounts]);

  // Function to render the technical explanation with JSX formatting
  const renderTechnicalExplanation = () => {
    // We replace the Markdown '**' with <strong> tags manually
    const parts = TECHNICAL_EXPLANATION.split('**');
    
    return parts.map((part, index) => {
      // Every odd index (1, 3, 5, etc.) is the text that should be bold
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      }
      return part;
    });
  };

  return (
    <> 
      <div className="min-h-screen bg-teal-50 p-4 sm:p-8">
        
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border-t-4 border-teal-600">
          <div className="flex justify-between items-start flex-col sm:flex-row sm:items-center">
              <h1 className="text-3xl font-extrabold text-gray-800">
                  Welcome, {username || "User"}
              </h1>
              <button 
                  className="mt-3 sm:mt-0 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-150"
                  onClick={handleLogout}
              >
                  Logout
              </button>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-teal-700 mb-2">Portfolio Demo Details:</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                  {renderTechnicalExplanation()}
              </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Account Management</h3>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-150"
              placeholder="New account name"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
            />
            <button 
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150" 
              onClick={createAccount}>
              Create Account
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Your Accounts</h3>
          <table className="min-w-full bg-white rounded-lg border border-gray-200">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-teal-50/50 transition duration-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acc.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-600">{acc.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acc.user?.username || acc.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">
                      ${parseFloat(acc.balance).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full hover:bg-blue-600 transition duration-150 shadow-sm"
                      onClick={() => viewTransactions(acc)}
                    >
                      View Transactions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TransactionModal 
          show={showModal} 
          onClose={() => setShowModal(false)} 
          account={selectedAccount} 
          transactions={transactions} 
          amount={amount} 
          setAmount={setAmount}
          handleDeposit={handleDeposit}
          handleWithdraw={handleWithdraw}
        />
      </div>
      
      <footer className="mt-10 text-center text-xs text-gray-600 pb-4">
        <p>
          <a
            href="https://github.com/Stiofain-MacMathuna"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-600 underline"
          >
            GitHub
          </a>{" "}
          |{" "}
          <a
            href="https://www.linkedin.com/in/stephen-m-15b85a113/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-600 underline"
          >
            LinkedIn
          </a>
        </p>
      </footer>
    </>
  );
}