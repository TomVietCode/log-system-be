# Đặc tả Hệ thống Quản lý Log Làm việc

## 1. Tổng quan Hệ thống

### 1.1 Mục đích
Hệ thống phần mềm quản lý log làm việc theo tháng của nhân viên trong công ty. Phần mềm có thể dùng làm cơ sở để tính lương và hỗ trợ theo dõi được nội dung làm việc của nhân viên cho phòng hành chính tổng hợp.

### 1.2 Phạm vi
- Quản lý devlog hàng ngày của nhân viên
- Quản lý dự án và task
- Phân quyền theo vai trò
- Thống kê và báo cáo
- Hệ thống thông báo tự động

## 2. Phân cấp Tài khoản

### 2.1 Vai trò và Quyền hạn

| Vai trò | Mô tả | Quyền hạn chính |
|---------|-------|-----------------|
| **ADMIN** | Quản trị viên hệ thống | Toàn quyền quản lý hệ thống |
| **HCNS** | Nhân sự hành chính | Xem báo cáo, xuất dữ liệu |
| **LEADER** | Trưởng nhóm dự án | Quản lý dự án, task và thành viên |
| **DEV** | Nhân viên phát triển | Nhập devlog, xem thông tin cá nhân |

### 2.2 Ma trận Phân quyền Chi tiết

| Chức năng | ADMIN | HCNS | LEADER | DEV |
|-----------|-------|------|--------|-----|
| Đăng ký/Đăng nhập | ✓ | ✓ | ✓ | ✓ |
| Xem dashboard | ✓ | ✓ | ✓ | ✓ |
| Nhập devlog | ✓ | ✓ | ✓ | ✓ |
| Xem lịch sử devlog cá nhân | ✓ | ✓ | ✓ | ✓ |
| Thay đổi mật khẩu | ✓ | ✓ | ✓ | ✓ |
| Thay đổi thông tin cá nhân | ✓ | ✓ | ✓ | ✓ |
| Tạo dự án | ✓ | ✗ | ✓ | ✗ |
| Thêm dev vào dự án | ✓ | ✗ | ✓ | ✗ |
| Thêm task vào dự án | ✓ | ✗ | ✓ | ✓ |
| Sửa tên task | ✓ | ✗ | ✓ | ✗ |
| Xem dev chưa nhập devlog | ✓ | ✗ | ✓ | ✗ |
| Xem devlog người khác | ✓ | ✓ | ✓ | ✗ |
| Gán quyền user | ✓ | ✗ | ✗ | ✗ |
| Xem danh sách user | ✓ | ✓ | ✗ | ✗ |
| Xuất CSV | ✓ | ✓ | ✗ | ✗ |
| Thay đổi mật khẩu người khác | ✓ | ✗ | ✗ | ✗ |

## 3. Chức năng Chi tiết

### 3.1 Authentication & Authorization

#### 3.1.1 Đăng ký
- **Input**: Email, mật khẩu, xác nhận mật khẩu
- **Validation**: 
  - Email phải nằm trong whitelist domain
  - Mật khẩu tối thiểu 8 ký tự
  - Email chưa được sử dụng
- **Output**: Tài khoản mới với role mặc định là DEV

#### 3.1.2 Đăng nhập
- **Input**: Email, mật khẩu
- **Output**: JWT token, thông tin user
- **Features**: Remember me, forgot password

### 3.2 Dashboard

#### 3.2.1 Dashboard Tổng quan
- **Dev**: Devlog hôm nay, dự án đang tham gia, task đang làm
- **Leader**: Thống kê team, dự án quản lý, dev chưa nhập log
- **HCNS/Admin**: Thống kê toàn công ty, báo cáo tổng hợp

### 3.3 Devlog Management

#### 3.3.1 Nhập Devlog
- **Fields**:
  - Ngày (tự động = ngày hiện tại)
  - Dự án (dropdown)
  - Task (dropdown dựa vào dự án)
  - Thời gian bắt đầu
  - Thời gian kết thúc
  - Mô tả công việc (textarea)
  - Ghi chú (optional)
- **Validation**:
  - Không được nhập trùng thời gian
  - Thời gian kết thúc > thời gian bắt đầu
  - Tối đa 8 tiếng/ngày

#### 3.3.2 Xem Lịch sử Devlog
- **Filter**: Theo ngày, tuần, tháng, dự án
- **View**: Calendar view, List view
- **Export**: PDF cho cá nhân

### 3.4 Project Management

#### 3.4.1 Tạo Dự án (Leader only)
- **Fields**: Tên dự án, mô tả, ngày bắt đầu, ngày kết thúc dự kiến
- **Auto**: Tạo leader làm project manager

#### 3.4.2 Quản lý Thành viên Dự án
- **Add Member**: Chọn từ danh sách dev
- **Remove Member**: Chỉ khi dev chưa có devlog nào
- **Role**: Dev, Leader

#### 3.4.3 Task Management
- **CRUD Tasks**: Tên task, mô tả, priority, status
- **Assign**: Gán task cho dev trong dự án

### 3.5 Reporting & Analytics

#### 3.5.1 Báo cáo HCNS/Admin
- **Team Performance**: Thống kê theo team, tháng
- **Individual Report**: Báo cáo chi tiết từng nhân viên
- **Project Report**: Tiến độ, thời gian đầu tư
- **Export**: CSV, Excel với nhiều format

#### 3.5.2 Leader Dashboard
- **Team Overview**: Dev đang online, offline
- **Daily Report**: Ai chưa nhập devlog hôm nay
- **Project Status**: Tiến độ các dự án đang quản lý

### 3.6 Notification System

#### 3.6.1 Email Notifications
- **Daily Reminder**: 5PM gửi email cho dev chưa nhập devlog
- **Weekly Report**: Gửi báo cáo tuần cho leader
- **Monthly Report**: Gửi báo cáo tháng cho HCNS

#### 3.6.2 In-app Notifications
- **Bell Icon**: Hiển thị số thông báo chưa đọc
- **Types**: Reminder, deadline, team update
- **Real-time**: WebSocket/SSE

## 4. Technical Requirements

### 4.1 Database Schema

#### 4.1.1 Core Tables
```sql
- users (id, email, password, role, profile_info)
- projects (id, name, description, leader_id, dates)
- tasks (id, project_id, name, description, status)
- devlogs (id, user_id, project_id, task_id, date, times, description)
- notifications (id, user_id, type, content, read_status)
- email_whitelist (id, email, domain, is_active)
```

### 4.2 API Specifications

#### 4.2.1 Authentication
```
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
POST /auth/forgot-password
```

#### 4.2.2 User Management
```
GET /users (HCNS/Admin only)
PUT /users/:id/role (Admin only)
PUT /users/:id/password (Admin only)
GET /users/profile
PUT /users/profile
```

#### 4.2.3 Devlog
```
POST /devlogs
GET /devlogs
GET /devlogs/user/:id (Leader/HCNS/Admin)
PUT /devlogs/:id
DELETE /devlogs/:id
```

#### 4.2.4 Projects & Tasks
```
GET /projects
POST /projects (Leader only)
PUT /projects/:id (Leader only)
POST /projects/:id/members (Leader only)
GET /tasks
POST /tasks
PUT /tasks/:id (Leader only)
```

### 4.3 Security Requirements
- JWT Authentication with refresh token
- Role-based access control (RBAC)
- Password hashing (bcrypt)
- Rate limiting for API calls
- Input validation and sanitization
- CORS configuration
- HTTPS enforcement

### 4.4 Performance Requirements
- Response time < 200ms for dashboard
- Support 100 concurrent users
- Database query optimization
- Caching for frequently accessed data

## 5. User Interface Requirements

### 5.1 Responsive Design
- Desktop: 1920x1080
- Tablet: 768x1024
- Mobile: 375x667 (view only)

### 5.2 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 5.3 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support

## 6. Deployment & Infrastructure

### 6.1 Environment
- Development: Local Docker
- Staging: Cloud VPS
- Production: Cloud with load balancer

### 6.2 Monitoring
- Application logs
- Error tracking (Sentry)
- Performance monitoring
- Database query monitoring

## 7. Testing Requirements

### 7.1 Unit Testing
- Service layer: 80% coverage
- Utility functions: 90% coverage

### 7.2 Integration Testing
- API endpoints
- Database operations
- Authentication flow

### 7.3 E2E Testing
- Critical user journeys
- Cross-browser testing
