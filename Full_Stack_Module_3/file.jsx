import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, RefreshCw, CreditCard, TrendingUp } from 'lucide-react';
import BankAccountList from '../components/bankaccounts/BankAccountList';
import ConnectBankAccountModal from '../components/bankaccounts/ConnectBankAccountModal';

const BankAccountsPage = () => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-secondary-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center text-secondary-600 hover:text-secondary-900 mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="logo-container h-8 w-8">
                <img src="/lgoog_proeject.png" alt="FINANCIFY Logo" className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Bank Accounts
            </h1>
            <p className="text-secondary-600">
              Connect and manage your bank accounts for automatic transaction syncing.
            </p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn btn-secondary"
            >
              {refreshing ? (
                <>
                  <div className="spinner"></div>
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Sync All
                </>
              )}
            </button>
            <button 
              onClick={() => setShowConnectModal(true)}
              className="btn btn-gradient"
            >
              <Plus className="h-4 w-4" />
              Connect Account
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Total Balance</p>
                  <p className="text-2xl font-bold text-secondary-900">$13,800.57</p>
                </div>
                <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Connected Accounts</p>
                  <p className="text-2xl font-bold text-secondary-900">3</p>
                </div>
                <div className="h-12 w-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Last Sync</p>
                  <p className="text-2xl font-bold text-secondary-900">2 min ago</p>
                </div>
                <div className="h-12 w-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-warning-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Accounts List */}
        <BankAccountList />

        {/* Connect Account Modal */}
        <ConnectBankAccountModal 
          isOpen={showConnectModal} 
          onClose={() => setShowConnectModal(false)} 
        />
      </div>
    </div>
  );
};

export default BankAccountsPage;
