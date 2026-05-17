# S Coffee - Hệ Thống Quản Lý Quán Coffee

## 📋 Báo Cáo Môn Học HỆ THỐNG THÔNG TIN TÍCH HỢP

### 👥 Thành Viên
- **22810310254** - Nguyễn Thị Hoài Sương

---

## 📝 Mô Tả Dự Án

**S Coffee** là hệ thống quản lý toàn diện cho quán cà phê, bao gồm:
- ☕ Quản lý sản phẩm (cà phê, trà sữa, bánh, snack)
- 📦 Quản lý đơn hàng (dine-in, delivery, online)
- 👥 Quản lý khách hàng và tài khoản
- 💳 Tích hợp Thanh toán trực tuyến (VNPay, COD, QR Code)
- 📊 Dashboard và báo cáo

Hệ thống hỗ trợ **24 điểm bán** tại các thành phố (HCM, Hà Nội, Đà Nẵng, Cần Thơ) với tổng cộng **35 sản phẩm** và **5 chương trình khuyến mãi**.

---

## 🔧 Yêu Cầu Môi Trường

### **Backend**
- **Node.js**: v16.x hoặc cao hơn
- **npm**: v8.x hoặc npm packages
- **PostgreSQL**: Qua Supabase Cloud
- **Redis**: Qua Upstash (tùy chọn cho session storage)

### **Frontend**
- **Node.js**: v16.x hoặc cao hơn
- **npm**: v8.x

### **External Services**
- **Supabase**: PostgreSQL Database + Storage
- **Render**: Backend deployment
- **Vercel**: Frontend deployment
- **GHN API**: Giao hàng nhanh (optional)
- **VNPay API**: Thanh toán (optional)
- **SendGrid**: Email service (optional)
- **Google OAuth**: Đăng nhập xã hội (optional)

---

## 🚀 Cách Cài Đặt và Khởi Chạy

### ** CÁCH CHẠY LOCAL (Development)**

#### **1. Clone Repository**
```bash
git clone https://github.com/suongnth22810310254-gif/Cafe_S.git
cd Suli_Coffee_Web
```

#### **2. Cài Đặt Backend**
```bash
cd backend

# Cài dependencies
npm install

# Khởi động server
npm start
# Server chạy tại: http://localhost:5000
```

#### **3. Cài Đặt Frontend** (Terminal khác)
```bash
cd frontend

# Cài dependencies
npm install

# Khởi động app React
npm start
# App chạy tại: http://localhost:3000
```

#### **4. File .env Configuration (Backend)**
```dotenv
# Database
DATABASE_URL=postgresql://postgres:PASSWORD@sgdxfykglufwwplotttk.supabase.co:5432/postgres
DB_HOST=sgdxfykglufwwplotttk.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_NAME=postgres
DB_SSL=true

# JWT Secret
JWT_SECRET=your-secret-key-32-chars-minimum

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Optional - Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
```

---


## 🔐 Tài Khoản Đăng Nhập Mặc Định

| Role | Username | Password | Email |
|------|----------|----------|-------|
| **Admin** | `admin` | `1` | hoaisuong2874@gmail.com |
| **User** | `user1` | `1` | suong@gmail.com |
| **User** | `hsuong28` | `Nths@280704` | example2@gmail.com |

### Cấp Quyền
- **admin**: Truy cập toàn bộ Dashboard, quản lý sản phẩm, đơn hàng, khách hàng
- **user**: Khách hàng, có thể xem sản phẩm, đặt hàng, thanh toán

---

## 📂 Cấu Trúc Thư Mục và Mô Tả Chức Năng

### **Backend Structure** (`/backend`)
```
backend/
├── config/
│   ├── db.js                 # PostgreSQL connection (pg)
│   ├── sequelize.js          # Sequelize ORM configuration
│   └── middlewareSetup.js    # CORS, CSP, authentication setup
├── controllers/
│   ├── admin/
│   │   ├── categoryController.js    # Quản lý danh mục
│   │   ├── foodController.js        # Quản lý sản phẩm
│   │   └── home.js                  # Dashboard admin
│   ├── user/
│   │   ├── orderController.js       # Đặt hàng
│   │   ├── cartController.js        # Giỏ hàng
│   │   └── profileController.js     # Thông tin cá nhân
│   ├── signin.js             # Đăng nhập
│   ├── signup.js             # Đăng ký
│   └── chatbotController.js  # Chatbot AI
├── models/                   # Sequelize models (30 bảng)
│   ├── Users.js              # Người dùng
│   ├── Orders.js             # Đơn hàng
│   ├── Food.js               # Sản phẩm
│   ├── Category.js           # Danh mục
│   ├── Ingredient.js         # Nguyên vật liệu
│   ├── Warehouse.js          # Kho hàng
│   ├── Vouchers.js           # Mã giảm giá
│   ├── CuaHang.js            # Cửa hàng (24 điểm)
│   └── ... (22 bảng khác)
├── routes/
│   ├── admin/                # Admin routes
│   ├── user/                 # User routes
│   ├── shared/               # Public routes
│   └── webhooks/             # Webhook handlers (GHN, VNPay)
├── services/
│   ├── emailService.js           # Email notification
│   ├── ghnService.js             # Giao Hàng Nhanh API
│   ├── chatbotService.js         # Chatbot logic
│   └── supabaseService.js        # File upload
├── utils/
│   ├── logger.js             # Logging
│   └── realtimeHelper.js     # Socket.IO helpers
├── public/
│   ├── analyze.html          # CSP violation analysis
│   ├── csp_test.html         # CSP testing page
│   └── images/               # Static images
├── server.js                 # Main server file
├── socketManager.js          # Real-time Socket.IO
├── cspMiddleware.js          # Content Security Policy
├── securityHeaders.js        # Security headers
└── .env                      # Environment variables
```

### **Frontend Structure** (`/frontend`)
```
frontend/
├── public/
│   ├── index.html            # Main HTML
│   ├── images/               # Product images
│   └── video/                # Product videos
├── src/
│   ├── components/           # React components
│   │   ├── Header.js         # Navigation bar
│   │   ├── ProductList.js    # Sản phẩm
│   │   ├── CartItem.js       # Giỏ hàng
│   │   ├── Checkout.js       # Thanh toán
│   │   └── AdminPanel.js     # Admin dashboard
│   ├── pages/
│   │   ├── Home.js           # Trang chủ
│   │   ├── Contact.js        # Liên hệ
│   │   ├── Login.js          # Đăng nhập
│   │   ├── Admin.js          # Admin page
│   │   └── OrderTracking.js  # Theo dõi đơn
│   ├── redux/
│   │   ├── store.js          # Redux store
│   │   ├── cartSlice.js      # Cart state
│   │   ├── authSlice.js      # Auth state
│   │   └── orderSlice.js     # Order state
│   ├── hooks/
│   │   ├── useAuth.js        # Authentication hook
│   │   ├── useCart.js        # Cart hook
│   │   └── useFetch.js       # Data fetching hook
│   ├── styles/
│   │   ├── Home.css
│   │   ├── Product.css
│   │   ├── Admin.css
│   │   └── CSP.css
│   ├── utils/
│   │   ├── api.js            # API endpoints
│   │   ├── auth.js           # Auth utilities
│   │   └── validators.js     # Form validation
│   ├── App.js                # Main app component
│   ├── CSPProvider.js        # CSP context provider
│   └── index.js              # React entry point
├── setupProxy.js             # Proxy to backend
├── .env.production           # Production config
└── package.json
```

---

## 🗄️ Cơ Sở Dữ Liệu

### **30 Bảng PostgreSQL**
1. **Users** - Người dùng (4 records)
2. **Account** - Tài khoản quản lý (6 records)
3. **AccRole** - Vai trò (3 records)
4. **Category** - Danh mục (5 danh mục)
5. **Food** - Sản phẩm (35 sản phẩm)
6. **Ingredient** - Nguyên vật liệu (31 items)
7. **Size** - Kích cỡ (3 sizes)
8. **Topping** - Toppings (11 toppings)
9. **CuaHang** - Cửa hàng (24 điểm)
10. **Orders** - Đơn hàng
11. **OrderDetails** - Chi tiết đơn hàng
12. **OrderStatus** - Trạng thái đơn (5 trạng thái)
13. **PaymentStatus** - Trạng thái thanh toán (4 trạng thái)
14. **PhuongThucThanhToan** - Phương thức thanh toán (3 loại: VNPay, COD, QR)
15. **Vouchers** - Mã giảm giá (5 vouchers)
16. **UserVouchers** - Vouchers của user
17. **Warehouse** - Kho hàng
18. **GioHang** - Giỏ hàng
19. **GioHang_Topping** - Toppings trong giỏ
20. **TableFood** - Bàn ăn (12 bàn)
21. **Invoice** - Hóa đơn dine-in
22. **InvoiceDetail** - Chi tiết hóa đơn
23. **DeliveryAddresses** - Địa chỉ giao hàng
24. **ShippingOrders** - Đơn giao hàng (GHN)
25. **FoodIngredient** - Recipe (nguyên vật liệu cho món)
26. **FoodDimensions** - Kích thước đóng gói
27. **OrderDetails_Topping** - Toppings cho đơn hàng
28. **Notifications** - Thông báo real-time
29. **OrderReviews** - Đánh giá sản phẩm
30. **Staff** - Nhân viên

---

## 🔒 Bảo Mật - Content Security Policy (CSP)

Dự án tập trung vào **CSP Implementation** với:
- `cspMiddleware.js` - Middleware áp dụng CSP headers
- `securityHeaders.js` - Security headers
- `/public/csp_test.html` - Test CSP violation
- `/public/analyze.html` - CSP violation analysis
- `nonce` generation cho inline scripts
- CSP report-uri tracking

---

## 🎯 Các Chức Năng Chính

### **👤 Khách Hàng**
- ✅ Đăng ký / Đăng nhập (Email, OAuth)
- ✅ Xem danh sách sản phẩm (35 items)
- ✅ Tìm kiếm & lọc theo danh mục
- ✅ Thêm vào giỏ hàng + tùy chỉnh topping/size
- ✅ Thanh toán Online (VNPay) hoặc COD
- ✅ Theo dõi đơn hàng real-time
- ✅ Quản lý profile & địa chỉ giao
- ✅ Đánh giá sản phẩm

### **🔐 Admin**
- ✅ Dashboard (doanh thu, đơn hàng, sản phẩm hot)
- ✅ Quản lý 35 sản phẩm
- ✅ Quản lý danh mục
- ✅ Quản lý 24 cửa hàng
- ✅ Quản lý đơn hàng & trạng thái
- ✅ Quản lý voucher (5 chương trình)
- ✅ Quản lý kho nguyên vật liệu
- ✅ Xem báo cáo & thống kê

---

## 📞 Hỗ Trợ

**Các API Endpoints chính:**
- `GET /api/products` - Danh sách sản phẩm
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/:id` - Chi tiết đơn
- `POST /auth/login` - Đăng nhập
- `POST /auth/signup` - Đăng ký
- `GET /admin/dashboard` - Dashboard admin

---

## 📄 License
Dự án học tập - Môn Hệ Thống Thông Tin Tích Hợp

**Repository**: https://github.com/suongnth22810310254-gif/Cafe_S  
**Frontend**: https://cafe-s-inky.vercel.app  
**Backend**: https://coffee-s-backend-48rw.onrender.com

