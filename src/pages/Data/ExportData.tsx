import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  SelectChangeEvent,
  Tooltip,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  TablePagination,
} from '@mui/material';
import {
  TableChart as ExcelIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';
import * as XLSX from 'xlsx';

interface DataItem {
  id: string;
  document_name: string;
  sender_name: string;
  receiver_name: string;
  notes?: string;
  created_at: string;
}

const ExportData: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const rowsPerPageOptions = [5, 10, 20];
  const [data, setData] = useState<DataItem[]>([]);
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'id', 'document_name', 'sender_name', 'receiver_name', 'notes', 'created_at'
  ]);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const apiUrl = import.meta.env.VITE_API_URL;

  const columns = [
    { id: 'id', label: 'เลขที่เอกสาร' },
    { id: 'document_name', label: 'เรื่อง' },
    { id: 'sender_name', label: 'จาก' },
    { id: 'receiver_name', label: 'ถึง' },
    { id: 'notes', label: 'หมายเหตุ' },
    { id: 'created_at', label: 'วันที่สร้าง' }
  ];
  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/data`);
      setData(response.data);
      setFilteredData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [startDate, endDate, data]);

  const filterData = () => {
    let filtered = [...data];

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate <= end;
      });
    }

    setFilteredData(filtered);
  };

  const handleColumnChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setSelectedColumns(value);
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'dd/MM/yyyy HH:mm', { locale: th });
  };

  // ฟังก์ชันสำหรับตัดข้อความที่ยาวเกินไป
  const truncateText = (text: string, maxLength: number = 30) => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return (
      <Tooltip title={text} arrow placement="top">
        <span>{text.substring(0, maxLength)}...</span>
      </Tooltip>
    );
  };

  const exportToExcel = () => {
    try {
      if (filteredData.length === 0) {
        setSnackbarMessage('ไม่มีข้อมูลที่จะส่งออก');
        setOpenSnackbar(true);
        return;
      }

      // สร้างข้อมูลสำหรับส่งออก
      const exportData = filteredData.map(item => {
        const row: Record<string, any> = {};
        
        selectedColumns.forEach(col => {
          if (col === 'created_at') {
            row['วันที่สร้าง'] = formatDate(item.created_at);
          } else {
            const column = columns.find(c => c.id === col);
            if (column) {
              row[column.label] = item[col as keyof DataItem] || '-';
            }
          }
        });
        
        return row;
      });

      // สร้าง worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // สร้าง workbook และเพิ่ม worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Documents');
      
      // กำหนดชื่อไฟล์
      const fileName = `document_export_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
      
      // ส่งออกไฟล์
      XLSX.writeFile(wb, fileName);
      
      setSnackbarMessage('ส่งออกข้อมูลเป็น Excel สำเร็จ');
      setOpenSnackbar(true);
    } catch (err) {
      console.error('Error exporting to Excel:', err);
      setSnackbarMessage('เกิดข้อผิดพลาดในการส่งออกข้อมูล');
      setOpenSnackbar(true);
    }
  };


  // แสดงผลแบบ Card สำหรับมือถือ
  const renderMobileView = () => {
    return (
      <Box>
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <Card key={item.id} sx={{ mb: 2, boxShadow: 2 }}>
              <CardContent>
                {selectedColumns.includes('id') && (
                  <Typography variant="subtitle1" fontWeight="bold">
                    เลขที่เอกสาร: {item.id}
                  </Typography>
                )}
                {selectedColumns.includes('document_name') && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>เรื่อง:</strong> {item.document_name}
                  </Typography>
                )}
                {selectedColumns.includes('sender_name') && (
                  <Typography variant="body2">
                    <strong>จาก:</strong> {item.sender_name}
                  </Typography>
                )}
                {selectedColumns.includes('receiver_name') && (
                  <Typography variant="body2">
                    <strong>ถึง:</strong> {item.receiver_name}
                  </Typography>
                )}
                {selectedColumns.includes('notes') && (
                  <Typography variant="body2">
                    <strong>หมายเหตุ:</strong> {item.notes || '-'}
                  </Typography>
                )}
                {selectedColumns.includes('created_at') && (
                  <Typography variant="body2">
                    <strong>วันที่สร้าง:</strong> {formatDate(item.created_at)}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography>ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา</Typography>
          </Paper>
        )}
      </Box>
    );
  };

  // แสดงผลแบบตารางสำหรับแท็บเล็ตและเดสก์ท็อป
  const renderTableView = () => {
    // คำนวณข้อมูลที่จะแสดงในหน้าปัจจุบัน
    const paginatedData = filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  
    return (
      <>
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table size={isTablet ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                {selectedColumns.map((colId) => {
                  const column = columns.find(col => col.id === colId);
                  return (
                    <TableCell key={colId} sx={{ color: 'primary.contrastText' }}>
                      {column ? column.label : colId}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <TableRow key={item.id} hover>
                    {selectedColumns.map((colId) => {
                      if (colId === 'created_at') {
                        return (
                          <TableCell key={colId}>
                            {formatDate(item.created_at)}
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={colId}>
                          {truncateText(item[colId as keyof DataItem] || '-')}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={selectedColumns.length} align="center">
                    ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* เพิ่ม TablePagination สำหรับการจัดการหน้า */}
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="รายการต่อหน้า:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count}`}
        />
      </>
    );
  };
  
  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        mb: 3,
        gap: 2
      }}>
        <Typography variant={isMobile ? "h5" : "h4"} component="h1">
          ส่งออกข้อมูลเอกสาร
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/data"
            size={isMobile ? "small" : "medium"}
            variant="outlined"
          >
            กลับ
          </Button>
          <IconButton onClick={fetchData} color="primary" size={isMobile ? "small" : "medium"}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>
  
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
  
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          ตัวกรองข้อมูล
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={th}>
              <DatePicker
                label="วันที่เริ่มต้น"
                value={startDate}
                onChange={(newValue: Date | null) => setStartDate(newValue)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    size: isMobile ? "small" : "medium"
                  } 
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={th}>
              <DatePicker
                label="วันที่สิ้นสุด"
                value={endDate}
                onChange={(newValue: Date | null) => setEndDate(newValue)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    size: isMobile ? "small" : "medium"
                  } 
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel id="columns-select-label">คอลัมน์ที่ต้องการส่งออก</InputLabel>
              <Select
                labelId="columns-select-label"
                multiple
                value={selectedColumns}
                onChange={handleColumnChange}
                input={<OutlinedInput label="คอลัมน์ที่ต้องการส่งออก" />}
                renderValue={(selected) => {
                  return selected.map(value => {
                    const column = columns.find(col => col.id === value);
                    return column ? column.label : value;
                  }).join(', ');
                }}
              >
                {columns.map((column) => (
                  <MenuItem key={column.id} value={column.id}>
                    <Checkbox checked={selectedColumns.indexOf(column.id) > -1} />
                    <ListItemText primary={column.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
  
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center',
        mb: 3,
        gap: 2
      }}>
        <Typography variant="h6">
          ผลลัพธ์: {filteredData.length} รายการ
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<ExcelIcon />}
            onClick={exportToExcel}
            color="success"
            disabled={filteredData.length === 0}
            size={isMobile ? "small" : "medium"}
            fullWidth={isMobile}
          >
            ส่งออก Excel
          </Button>
        </Box>
      </Box>
  
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {isMobile ? renderMobileView() : renderTableView()}
        </>
      )}
  
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
  };
  
  export default ExportData;
  
