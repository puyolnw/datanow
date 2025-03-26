import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/dashboard';
import Layout from '../components/Layout';
import AuthenLayout from '../components/Auth/AuthenLayout';
import LoginPage from '../pages/Auth/Login/login';
import ProtectedRoute from '../components/Auth/ProtectedRoute'; // นำเข้า ProtectedRoute


import AllData from '../pages/Data/AllData';
import AddData from '../pages/Data/AddData';
import EditData from '../pages/Data/EditData';
import ExportData from '../pages/Data/ExportData';
import {
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
export const routes = [
  {
    path: '/',
    element: <ProtectedRoute />, // ใช้ ProtectedRoute เพื่อบังคับให้ต้อง login ก่อน
    children: [
      {
        path: '/',
        element: <Layout />, // Layout หลักสำหรับหน้า Dashboard และอื่นๆ
        children: [
          {
            path: '',
            name: 'Dashboard',
            nameTH: 'แดชบอร์ด',
            icon: DashboardIcon,
            element: <Dashboard />
          },
          {
            path: '/data',
            name: 'Data',
            nameTH: 'ข้อมูลทั้งหมด',
            icon: DashboardIcon,
            element: <AllData />
          },
          {
            path: '/data/addnew',
            name: 'Add New Data',
            nameTH: 'เพิ่มข้อมูล',
            icon: DashboardIcon,
            element: <AddData />
          },
          {
            path: '/data/edit/:id',
            name: 'Edit Data',
            nameTH: 'แก้ไขข้อมูล',
            icon: DashboardIcon,
            element: <EditData />
          },
          {
            path: '/data/export',
            name: 'Export Data',
            nameTH: 'ส่งออกข้อมูล',
            icon: DashboardIcon,
            element: <ExportData />
          },
        ]
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthenLayout />, // Layout สำหรับ Authentication
    children: [
      {
        path: 'login',
        name: 'Login',
        nameTH: 'เข้าสู่ระบบ',
        element: <LoginPage />
      }
    ]
  }
];
const router = createBrowserRouter(routes);
export default router;