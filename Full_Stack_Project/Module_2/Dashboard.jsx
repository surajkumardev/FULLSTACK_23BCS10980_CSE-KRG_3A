import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Settings, CreditCard, TrendingUp, DollarSign, BarChart3, Star } from 'lucide-react';
import FinancialCharts from '../components/dashboard/FinancialCharts';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'analytics'

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-secondary-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="logo-container h-8 w-8">
                <img src="/lgoog_proeject.png" alt="FINANCIFY Logo" className="w-full h-full" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-secondary-600" />
                <span className="text-sm text-secondary-700">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="btn btn-secondary btn-sm"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-lg text-secondary-600">
            Here's an overview of your financial status.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="card bg-gradient-primary text-white">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Total Balance</p>
                  <p className="text-2xl font-bold text-white">$13,800.57</p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-secondary text-white">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Monthly Income</p>
                  <p className="text-2xl font-bold text-white">$5,250.00</p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-accent text-white">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Monthly Expenses</p>
                  <p className="text-2xl font-bold text-white">$3,847.32</p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="card glass-card text-white">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Savings Rate</p>
                  <p className="text-2xl font-bold text-white">27%</p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-secondary-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Overview</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Analytics & Charts</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Recent Transactions */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="card-header">
                  <h2 className="text-xl font-semibold text-secondary-900">Recent Transactions</h2>
                </div>
                <div className="card-body">
                  <div className="text-center py-12">
                    <div className="h-16 w-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-secondary-400 text-2xl">📊</span>
                    </div>
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">No transactions yet</h3>
                    <p className="text-secondary-600 mb-4">
                      Start by adding your first transaction to see your financial data here.
                    </p>
                    <Link to="/transactions" className="btn btn-primary">
                      Add Transaction
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className="card">
                <div className="card-header">
                  <h2 className="text-xl font-semibold text-secondary-900">Quick Actions</h2>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    <Link to="/transactions" className="btn btn-gradient w-full">
                      <CreditCard className="h-4 w-4" />
                      Manage Transactions
                    </Link>
                    <Link to="/bank-accounts" className="btn btn-primary w-full">
                      <CreditCard className="h-4 w-4" />
                      Bank Accounts
                    </Link>
                    <Link to="/subscriptions" className="btn btn-secondary w-full">
                      <Star className="h-4 w-4" />
                      Subscriptions
                    </Link>
                    <button className="btn btn-secondary w-full">
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <FinancialCharts />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
 
