import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 

const TECHNICAL_EXPLANATION = "A **full-stack financial portfolio management application** demonstrating proficiency in enterprise-grade development. The robust backend is engineered with **Java and the Spring Boot framework**, exposing secure RESTful APIs. Security is prioritized through the implementation of **JSON Web Token (JWT) authentication** for stateless user management and secure communication via **HTTPS**. The modern frontend is built with **React and Vite**. The entire application utilizes a modern DevOps workflow, being **Dockerized** and deployed on a **Microsoft Azure Virtual Machine** leveraging a scalable **Azure PostgreSQL database** for persistence.";

const api = axios.create({
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

const MessageBox = ({ show, message, onClose, onConfirm, type }) => {
    if (!show) return null;

    const isConfirm = type === 'confirm';
    const bgColor = isConfirm ? 'bg-yellow-50' : 'bg-red-50';
    const borderColor = isConfirm ? 'border-yellow-500' : 'border-red-500';
    const headerColor = isConfirm ? 'text-yellow-800' : 'text-red-800';

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md">
                <div className={`${bgColor} p-4 border-b border-l-4 ${borderColor}`}>
                    <h4 className={`text-lg font-bold ${headerColor}`}>
                        {isConfirm ? "Confirm Deletion" : "Action Failed"}
                    </h4>
                </div>
                <div className="p-6">
                    <p className="text-gray-700 mb-6">{message}</p>
                    <div className="flex justify-end space-x-3">
                        <button 
                            onClick={onClose} 
                            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition duration-150"
                        >
                            {isConfirm ? "Cancel" : "Close"}
                        </button>
                        {isConfirm && (
                            <button 
                                onClick={onConfirm} 
                                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-150"
                            >
                                Delete Permanently
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const TransactionModal = ({ show, onClose, account, transactions, amount, setAmount, handleDeposit, handleWithdraw, transactionError, setTransactionError }) => {
  if (!show) return null;

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (/^\d*\.?\d*$/.test(val)) {
        setAmount(val);
        setTransactionError(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden transform transition-transform duration-300 scale-100">
        
        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-teal-50">
          <h3 className="text-xl font-bold text-gray-800">
            Transactions for Account: {account?.name || 'N/A'} (Current Balance: €{parseFloat(account?.balance || 0).toFixed(2)})
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
              onChange={handleAmountChange}
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

          {transactionError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm transition-opacity duration-300">
                  <p className="font-semibold mb-1">Transaction Error:</p>
                  <p>{transactionError}</p>
              </div>
          )}

          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No transactions found for this account.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg border border-gray-200">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-teal-50/50 transition duration-100">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.id.substring(0, 8)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          €{parseFloat(tx.amount ?? 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(() => {
                          if (!tx.date || String(tx.date) === 'null' || String(tx.date) === 'undefined') {
                            return 'N/A';
                          }

                          try {
                            const date = new Date(tx.date);
                            if (date.toString() !== 'Invalid Date') {
                              return new Intl.DateTimeFormat('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit',
                                minute: '2-digit'
                              }).format(date);
                            }
                          } catch (e) {
                            console.error("Date parsing error:", e);
                          }
                          return String(tx.date);
                        })()}
                      </td>
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
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  
  const [deleteMessage, setDeleteMessage] = useState({ 
      show: false, 
      text: "", 
      accountId: null, 
      type: 'confirm' 
  });
  
  const [transactionError, setTransactionError] = useState(null);

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
      setAccounts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch accounts error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) handleLogout();
    }
  }, [username, handleLogout]);

  const createAccount = async () => {
    try {
      await api.post("/api/accounts/create", { accountName: newAccountName });
      setNewAccountName("");
      fetchAccounts();
    } catch (err) {
      console.error("Create account error:", err);
    }
  };
  
  const handleCreateAccountClick = () => {
    if (!newAccountName.trim()) {
      setShowValidationMessage(true);
      setTimeout(() => setShowValidationMessage(false), 3000); 
    } else {
      createAccount();
    }
  };

  const showDeleteConfirmation = useCallback((accountId) => {
    setDeleteMessage({
        show: true,
        text: `Are you sure you want to delete account ID ${accountId}? This action cannot be undone.`,
        accountId: accountId,
        type: 'confirm'
    });
  }, []);

  const confirmDeleteAccount = useCallback(async () => {
    const accountId = deleteMessage.accountId;
    if (!accountId) return;

    setDeleteMessage({ show: false, text: "", accountId: null, type: 'confirm' });
    
    try {
      await api.delete(`/api/accounts/${accountId}`); 
      console.log(`[FRONTEND] Account ${accountId} deleted successfully.`);
      fetchAccounts(); 
    } catch (err) {
      console.error("Delete account error:", err);
      
      let displayMessage = "An unexpected error occurred. Please try again.";
      const status = err.response?.status;
      const specificErrorMessage = err.response?.data?.message;

      if (status === 401 || status === 403) {
          console.error("Session unauthorized (401/403). Forcing logout.");
          displayMessage = "Your security session has expired. Please log out and log back in to continue.";
          handleLogout(); 
          return; 
      } 
      else if (status === 400 && specificErrorMessage) {
          displayMessage = specificErrorMessage; 
      }
      else {
          displayMessage = `Deletion failed with status ${status || 'N/A'}. Please check the console for details.`;
      }
      
      setDeleteMessage({
        show: true,
        text: displayMessage,
        accountId: null,
        type: 'error'
      });
    }
  }, [deleteMessage.accountId, fetchAccounts, handleLogout]); 


  const viewTransactions = useCallback(async (account) => {
    setSelectedAccount(account);
    setTransactionError(null); 
    try {
      const res = await api.get(`/api/transactions/${account.id}`);
      setTransactions(Array.isArray(res.data) ? res.data : []);
      setShowModal(true);
      setAmount(""); 
    } catch (err) {
      console.error("View transactions error:", err);
      setTransactions(Array.isArray(err.response?.data) ? err.response.data : []); 
      setShowModal(true);
      setAmount(""); 
    }
  }, []);

  const updateLocalAccountBalance = useCallback((accountId, newBalance) => {
      setAccounts(prevAccounts => 
          prevAccounts.map(account => 
              account.id === accountId ? { ...account, balance: newBalance } : account
          )
      );
      setSelectedAccount(prevAccount => 
          prevAccount && prevAccount.id === accountId ? { ...prevAccount, balance: newBalance } : prevAccount
      );
  }, []);


  const handleDeposit = async () => {
    if (!selectedAccount || !amount || parseFloat(amount) <= 0) {
        setTransactionError("Please enter a valid amount greater than zero.");
        return;
    }
    const depositAmount = parseFloat(amount);
    
    try {
      await api.post("/api/transactions/deposit", {
        accountId: selectedAccount.id,
        amount: depositAmount,
      });
      
      setAmount("");
      setTransactionError(null); 

      const currentBalance = parseFloat(selectedAccount.balance);
      const newBalance = (currentBalance + depositAmount).toFixed(2);

      updateLocalAccountBalance(selectedAccount.id, newBalance);
      
      await viewTransactions({ ...selectedAccount, balance: newBalance }); 

    } catch (err) {
      console.error("Deposit error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
          handleLogout();
          return; 
      }
      const errorMessage = err.response?.data?.message || "Deposit failed due to server error.";
      setTransactionError(errorMessage);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedAccount) return;

    if (!amount || parseFloat(amount) <= 0) {
        setTransactionError("Please enter a valid amount greater than zero.");
        return;
    }
    
    const withdrawAmount = parseFloat(amount);
    const currentBalance = parseFloat(selectedAccount.balance);

    if (withdrawAmount > currentBalance) {
        setTransactionError(`Insufficient funds. Account balance is €${currentBalance.toFixed(2)}.`);
        return;
    }

    try {
      await api.post("/api/transactions/withdraw", {
        accountId: selectedAccount.id,
        amount: withdrawAmount,
      });
      
      setAmount("");
      setTransactionError(null); 

      const newBalance = (currentBalance - withdrawAmount).toFixed(2);
      
      updateLocalAccountBalance(selectedAccount.id, newBalance);

      await viewTransactions({ ...selectedAccount, balance: newBalance });
      
    } catch (err) {
      console.error("Withdraw error:", err);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
          handleLogout();
          return; 
      }
      
      const errorMessage = err.response?.data?.message || "Withdrawal failed due to server error.";
      setTransactionError(errorMessage);
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

  const renderTechnicalExplanation = () => {
    const parts = TECHNICAL_EXPLANATION.split('**');
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      <div className="bg-teal-50 p-4 sm:p-8 flex-grow">
        
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border-t-4 border-teal-600">
          <div className="flex justify-between items-start flex-col sm:flex-row sm:items-center">
              <h1 className="text-3xl font-extrabold text-gray-800">
                  Welcome, {username || "User"}
              </h1>
              <button 
                  className="mt-3 sm:mt-0 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:-red-700 transition duration-150"
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
              className={`px-6 py-3 font-semibold rounded-lg shadow-md transition duration-150 ${
                newAccountName.trim()
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-400 text-gray-700 hover:bg-gray-500 cursor-pointer'
              }`} 
              onClick={handleCreateAccountClick}>
              Create Account
            </button>
          </div>
          
          {showValidationMessage && (
            <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm transition-opacity duration-300">
              Please enter a name for the new account before creating it.
            </div>
          )}

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
              {accounts.map((acc) => {
                const balance = parseFloat(acc.balance);
                const isBalanceZero = balance === 0;
                
                const deleteButtonClasses = isBalanceZero
                    ? "px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full hover:bg-red-600 transition duration-150 shadow-sm"
                    : "px-3 py-1 bg-gray-400 text-white text-xs font-semibold rounded-full cursor-not-allowed shadow-sm";
                
                const deleteTooltip = isBalanceZero 
                    ? undefined 
                    : "Cannot delete account: balance must be zero. Please withdraw all funds first.";

                return (
                  <tr key={acc.id} className="hover:bg-teal-50/50 transition duration-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{acc.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-600">{acc.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{acc.user?.username || acc.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-gray-900">
                        €{balance.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full hover:bg-blue-600 transition duration-150 shadow-sm"
                        onClick={() => viewTransactions(acc)}
                      >
                        View
                      </button>
                      <button
                        className={deleteButtonClasses}
                        onClick={() => isBalanceZero && showDeleteConfirmation(acc.id)} 
                        title={deleteTooltip} 
                        disabled={!isBalanceZero}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <TransactionModal 
          show={showModal} 
          onClose={() => {setShowModal(false); setTransactionError(null)}} 
          account={selectedAccount} 
          transactions={transactions} 
          amount={amount} 
          setAmount={setAmount}
          handleDeposit={handleDeposit}
          handleWithdraw={handleWithdraw}
          transactionError={transactionError}
          setTransactionError={setTransactionError}
        />
        
        <MessageBox
            show={deleteMessage.show}
            message={deleteMessage.text}
            accountId={deleteMessage.accountId}
            type={deleteMessage.type}
            onClose={() => setDeleteMessage({ show: false, text: "", accountId: null, type: 'confirm' })}
            onConfirm={confirmDeleteAccount}
        />
        
      </div>
      
      <footer className="mt-auto text-center text-xs text-gray-600 py-4 bg-white border-t border-gray-200">
        <p>
          <a
            href="https://github.com/Stiofain-MacMathuna"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-600 underline"
          >
            GitHub
          </a>{" "}
          | {" "}
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
    </div>
  );
}