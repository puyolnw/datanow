import React from 'react';
import { 
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Container,
  styled
} from '@mui/material';
import { 
  EmojiEmotions as WelcomeIcon,
  Book as BookIcon,
  People as PeopleIcon,
  Assessment as ReportIcon,
  Help as HelpIcon
} from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8]
  }
}));

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ py: 5, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <WelcomeIcon fontSize="large" />
            ระบบบันทึกข้อมูล
          </Typography>
          <Typography variant="h5" color="text.secondary">
            ยินดีต้อนรับเข้าสู่ระบบจัดการข้อมูลของพี่ตั๊ก
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6} lg={3}>
            <StyledPaper elevation={3}>
              <BookIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                บันทึกข้อมูล
              </Typography>
              <Typography color="text.secondary">
                ระบบสำหรับบันทึกข้อมูลต่างๆ อย่างเป็นระเบียบ
              </Typography>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <StyledPaper elevation={3}>
              <PeopleIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                จัดการข้อมูล
              </Typography>
              <Typography color="text.secondary">
                ดูและจัดการข้อมูลที่บันทึกไว้ในระบบ
              </Typography>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <StyledPaper elevation={3}>
              <ReportIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                สถิติ
              </Typography>
              <Typography color="text.secondary">
                ดูรายงานและสถิติข้อมูลต่างๆ
              </Typography>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <StyledPaper elevation={3}>
              <HelpIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                คู่มือ
              </Typography>
              <Typography color="text.secondary">
                วิธีการใช้งานระบบ
              </Typography>
            </StyledPaper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Welcome Message */}
        <Box sx={{ 
          bgcolor: 'primary.light', 
          p: 4, 
          borderRadius: 2,
          textAlign: 'center'
        }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.contrastText' }}>
            เริ่มต้นใช้งานระบบ
          </Typography>
          <Typography variant="body1" sx={{ color: 'primary.contrastText', mb: 2 }}>
            ระบบบันทึกข้อมูลออกแบบมาเพื่อให้คุณสามารถจัดการข้อมูลได้อย่างง่ายดาย
          </Typography>
          <Typography variant="body2" sx={{ color: 'primary.contrastText' }}>
            เลือกเมนูที่ต้องการจากด้านบนเพื่อเริ่มต้นใช้งาน
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;