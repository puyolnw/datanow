import {
  Dashboard as DashboardIcon,
  People,
  List,
  PersonAdd,
} from '@mui/icons-material';

export const menuItems = [
  {
    text: 'Dashboard',
    icon: DashboardIcon,
    path: '/',
    nameTH: 'หน้าหลัก',
  },
  {
    text: 'Data ',
    icon: People,
    path: '/data',
    nameTH: 'ข้อมูลทั้งหมด',
    children: [
      {
        text: 'Data Lists',
        icon: List,
        path: '/data',
        nameTH: 'ข้อมูลทั้งหมด',
      },
      {
        text: 'Add Data',
        icon: PersonAdd,
        path: '/data/addnew',
        nameTH: 'เพิ่มข้อมูล',
      },
    ],
  },

];