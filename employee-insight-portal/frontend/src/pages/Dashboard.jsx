import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = 'http://localhost:8000';

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/employees?limit=1000`);
      setEmployees(response.data.employees);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate KPIs
  const totalEmployees = employees.length;
  const avgChurnProb = employees.reduce((sum, emp) => sum + emp.churn_probability, 0) / totalEmployees;
  const highRiskCount = employees.filter(emp => emp.status === 'High Risk').length;
  const avgSatisfaction = employees.reduce((sum, emp) => sum + emp.satisfaction_level, 0) / totalEmployees;

  // Department-wise data
  const deptData = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = { department: emp.department, count: 0, avgRisk: 0, totalRisk: 0 };
    }
    acc[emp.department].count++;
    acc[emp.department].totalRisk += emp.churn_probability;
    return acc;
  }, {});

  const departmentChartData = Object.values(deptData).map(dept => ({
    department: dept.department,
    avgRisk: ((dept.totalRisk / dept.count) * 100).toFixed(1),
    employees: dept.count
  }));

  // Risk distribution
  const riskDistribution = [
    { name: 'Low Risk', value: employees.filter(e => e.status === 'Low Risk').length },
    { name: 'Medium Risk', value: employees.filter(e => e.status === 'Medium Risk').length },
    { name: 'High Risk', value: employees.filter(e => e.status === 'High Risk').length }
  ];

  // Tenure vs Churn
  const tenureGroups = {
    '0-12': { tenure: '0-12 months', count: 0, totalRisk: 0 },
    '13-24': { tenure: '13-24 months', count: 0, totalRisk: 0 },
    '25-36': { tenure: '25-36 months', count: 0, totalRisk: 0 },
    '37+': { tenure: '37+ months', count: 0, totalRisk: 0 }
  };

  employees.forEach(emp => {
    if (emp.tenure <= 12) {
      tenureGroups['0-12'].count++;
      tenureGroups['0-12'].totalRisk += emp.churn_probability;
    } else if (emp.tenure <= 24) {
      tenureGroups['13-24'].count++;
      tenureGroups['13-24'].totalRisk += emp.churn_probability;
    } else if (emp.tenure <= 36) {
      tenureGroups['25-36'].count++;
      tenureGroups['25-36'].totalRisk += emp.churn_probability;
    } else {
      tenureGroups['37+'].count++;
      tenureGroups['37+'].totalRisk += emp.churn_probability;
    }
  });

  const tenureChartData = Object.values(tenureGroups).map(group => ({
    tenure: group.tenure,
    avgRisk: group.count > 0 ? ((group.totalRisk / group.count) * 100).toFixed(1) : 0
  }));

  const COLORS = ['#6b8e4e', '#f59e0b', '#ef4444'];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Employee analytics and churn insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Employees</p>
              <p className="text-3xl font-bold text-gray-800">{totalEmployees}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Avg Churn Risk</p>
              <p className="text-3xl font-bold text-gray-800">{(avgChurnProb * 100).toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">High Risk Count</p>
              <p className="text-3xl font-bold text-red-600">{highRiskCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Avg Satisfaction</p>
              <p className="text-3xl font-bold text-gray-800">{(avgSatisfaction * 100).toFixed(0)}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Department Risk */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Churn Risk by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgRisk" fill="#6b8e4e" name="Avg Risk %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Risk Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tenure vs Churn */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Churn Risk by Tenure</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tenureChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tenure" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgRisk" stroke="#6b8e4e" strokeWidth={2} name="Avg Risk %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Employee Count */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Employees by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="employees" fill="#8fa876" name="Employee Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Key Insights</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">⚠️ High Risk Alert</h3>
            <p className="text-red-700 text-sm">
              {highRiskCount} employees are at high risk of churning. Immediate intervention recommended.
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">📊 Department Focus</h3>
            <p className="text-blue-700 text-sm">
              {departmentChartData.sort((a, b) => b.avgRisk - a.avgRisk)[0]?.department} department shows highest churn risk.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">⏱️ Tenure Pattern</h3>
            <p className="text-yellow-700 text-sm">
              New employees (0-12 months) require additional support and engagement.
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">✓ Retention Rate</h3>
            <p className="text-green-700 text-sm">
              {((1 - avgChurnProb) * 100).toFixed(1)}% average retention probability across all employees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
