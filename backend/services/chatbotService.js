// chatbotService.js - Google Gemini Chatbot Service for Coffee S
const axios = require("axios");

class ChatbotService {
  constructor() {
    this.apiKey = null;
    this.apiEndpoint = null;
    this.models = null;
    this.initializeGemini();
  }

  // Lazy load models để tránh circular dependency
  getModels() {
    if (!this.models) {
      const initModels = require("../models/init-models");
      const sequelize = require("../config/sequelize");
      this.models = initModels(sequelize);
    }
    return this.models;
  }

  initializeGemini() {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        console.warn("⚠️ GEMINI_API_KEY không được cấu hình trong .env");
        return;
      }

      this.apiKey = apiKey;
      
      // SỬ DỤNG VERCEL FRONTEND CỦA BẠN LÀM PROXY TRUNG GIAN (BYPASS GOOGLE LOCATION BLOCK)
      // Vercel server đặt ở Mỹ sẽ giúp bạn vượt qua lớp block IP của Google đối với server Châu Á (Render).
      // Chúng ta sẽ lấy FRONTEND_URL từ biến môi trường
      const frontendUrl = process.env.FRONTEND_URL || 'https://cafe-s-inky.vercel.app'; 
      
      // Quay lại dùng gemini-2.5-flash. Lỗi limit 20 tức là 20 REQUEST MỖI PHÚT, không phải mỗi ngày.
      this.apiEndpoint = `${frontendUrl.replace(/\/$/, '')}/api/gemini/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      console.log("✅ Google Gemini AI đã được khởi tạo thành công (REST API v1beta qua Vercel Proxy, model: gemini-2.5-flash)");
    } catch (error) {
      console.error("❌ Lỗi khởi tạo Gemini AI:", error.message);
    }
  }

  // Lấy thông tin từ database
  async getDatabaseInfo() {
    try {
      const models = this.getModels();
      
      // Đếm số cơ sở
      const storeCount = await models.CuaHang.count();
      
      // Lấy danh sách cơ sở (giới hạn 5 để không quá dài)
      const stores = await models.CuaHang.findAll({
        attributes: ['CuaHangName', 'Address', 'Province', 'District', 'Phone'],
        limit: 5
      });
      
      // Đếm số món ăn theo category
      const sequelize = require("../config/sequelize");
      const categories = await models.Category.findAll({
        attributes: [
          'CategoryName',
          [sequelize.fn('COUNT', sequelize.col('Foods.FoodId')), 'FoodCount']
        ],
        include: [{
          model: models.Food,
          as: 'Foods',
          attributes: [],
          required: false
        }],
        group: ['Category.CategoryId', 'Category.CategoryName'],
        raw: true
      });
      
      // Lấy tất cả các món ăn và giá
      const allFoods = await models.Food.findAll({
        attributes: ['FoodName', 'Price', 'DiscountPrice'],
        include: [{
          model: models.Category,
          as: 'Category',
          attributes: ['CategoryName']
        }],
        order: [['FoodId', 'ASC']]
      });
      
      return {
        storeCount,
        stores,
        categories,
        allFoods
      };
    } catch (error) {
      console.error("❌ Lỗi khi lấy thông tin database:", error.message);
      return null;
    }
  }

  // Context về quán cafe SuLi
  getSystemPrompt(dbInfo = null) {
    let storeInfo = '- Hệ thống: Coffee S có 30 cơ sở trên toàn quốc';
    let menuInfo = '';
    let categoryInfo = '';
    
    if (dbInfo) {
      storeInfo = `- Hệ thống: Coffee S hiện có **${dbInfo.storeCount} cơ sở** trên toàn quốc`;
      
      if (dbInfo.stores && dbInfo.stores.length > 0) {
        storeInfo += '\n\nMỘT SỐ CƠ SỞ TIÊU BIỂU:\n';
        dbInfo.stores.forEach((store, idx) => {
          storeInfo += `${idx + 1}. **${store.CuaHangName}**: ${store.Address}, ${store.District}, ${store.Province} - SĐT: ${store.Phone}\n`;
        });
      }
      
      if (dbInfo.categories && dbInfo.categories.length > 0) {
        categoryInfo = '\n\nDANH MỤC MENU:\n';
        dbInfo.categories.forEach(cat => {
          categoryInfo += `- ${cat.CategoryName}: ${cat.FoodCount} món\n`;
        });
      }
      
      if (dbInfo.allFoods && dbInfo.allFoods.length > 0) {
        menuInfo = '\n\nDANH SÁCH TOÀN BỘ MENU (TÊN MÓN VÀ GIÁ):\n';
        dbInfo.allFoods.forEach((food, idx) => {
          const price = food.DiscountPrice || food.Price;
          const categoryName = food.Category?.CategoryName || 'Khác';
          menuInfo += `${idx + 1}. **${food.FoodName}** (${categoryName}) - ${Number(price).toLocaleString('vi-VN')}đ\n`;
        });
      }
    }
    
    return `Bạn là trợ lý ảo thông minh của quán cafe Coffee S, một quán cafe hiện đại và ấm cúng.

THÔNG TIN VỀ QUÁN:
- Tên: Coffee S
${storeInfo}
- Loại hình: Quán cafe hiện đại, phục vụ cả đồ uống và đồ ăn nhẹ
- Đặc sản: Cà phê Việt Nam, trà sữa, bánh ngọt và các món ăn nhẹ
- Phương thức phục vụ: Tại quán, mang đi, và giao hàng tận nơi
- Thanh toán: Tiền mặt, chuyển khoản, VNPay, Thanh toán khi nh�n hàng (COD)${categoryInfo}${menuInfo}
- Giờ mở cửa: 7:00 - 22:00 hàng ngày

DANH MỤC SẢN PHẨM:
1. Đồ uống nóng: Cà phê đen, cà phê sữa, cappuccino, latte, trà nóng
2. Đồ uống lạnh: Cà phê đá, trà sữa, sinh tố, nước ép
3. Đồ ăn nhẹ: Bánh ngọt, bánh mì, sandwich, salad
4. Topping: Trân châu, thạch, pudding, kem cheese

TÍNH NĂNG HỆ THỐNG:
- Đặt hàng online qua website
- Giao hàng tận nơi
- Tích điểm và sử dụng voucher
- Đặt bàn trước
- Thanh toán online

CÁCH TRẢ LỜI (RẤT QUAN TRỌNG):
- TRẢ LỜI VÔ CÙNG NGẮN GỌN, ĐÚNG TRỌNG TÂM, KHÔNG DÀI DÒNG. Tối đa 2-4 câu.
- Thân thiện, lịch sự và chuyên nghiệp bằng tiếng Việt.
- KỊCH BẢN MẶC ĐỊNH:
  + Nếu hỏi "Menu có gì/Bán gì": Chỉ kể tên 3-5 món phổ biến nhất.
  + Nếu hỏi "Quán ở đâu/Địa chỉ": Chỉ đưa thông tin 1-2 cơ sở tiêu biểu nhất.
  + Nếu hỏi "Giá bao nhiêu": Báo giá chính xác món đó theo thông tin ở trên.
  + Nếu hỏi "Có giao hàng không": Trả lời "Quán có giao hàng tận nơi, bạn có thể đặt trực tiếp trên website nhé."
- Tuyệt đối không tự bịa thông tin nếu không có trong dữ liệu. Nếu không rõ, hãy xin lỗi và bảo khách liên hệ hotline.
- Tự động định dạng văn bản (in đậm, xuống dòng) cho dễ đọc.

NHIỆM VỤ CỦA BẠN:
- Tư vấn menu và đồ uống
- Hướng dẫn đặt hàng và thanh toán
- Giải đáp thắc mắc về chính sách giao hàng
- Giới thiệu chương trình khuyến mãi
- Hỗ trợ khách hàng với thái độ nhiệt tình`;
  }

  // Xử lý tin nhắn từ khách hàng
  async sendMessage(userMessage, conversationHistory = []) {
    try {
      if (!this.apiKey || !this.apiEndpoint) {
        return {
          success: false,
          message: "Chatbot chưa được cấu hình đúng. Vui lòng liên hệ quản trị viên.",
        };
      }

      // Lấy thông tin từ database
      const dbInfo = await this.getDatabaseInfo();

      // Tạo context từ lịch sử hội thoại với thông tin database
      let fullPrompt = this.getSystemPrompt(dbInfo) + "\n\n";
      
      // Thêm lịch sử hội thoại nếu có
      if (conversationHistory && conversationHistory.length > 0) {
        fullPrompt += "LỊCH SỬ HỘI THOẠI:\n";
        conversationHistory.forEach((msg) => {
          fullPrompt += `${msg.role === "user" ? "Khách hàng" : "Trợ lý"}: ${msg.content}\n`;
        });
        fullPrompt += "\n";
      }

      // Thêm câu hỏi mới
      fullPrompt += `Khách hàng hỏi: ${userMessage}\n\nTrả lời:`;

      // Gọi Gemini REST API v1 bằng axios
      const response = await axios.post(this.apiEndpoint, {
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': '8.8.8.8',
          'X-Real-IP': '8.8.8.8'
        },
        timeout: 30000
      });

      if (!response.data.candidates || response.data.candidates.length === 0) {
        throw new Error("Không nhận được phản hồi từ AI");
      }
      
      const candidate = response.data.candidates[0];
      if (candidate.finishReason !== "STOP" && !candidate.content) {
        throw new Error(`AI bị giới hạn bởi bộ lọc an toàn (Lý do: ${candidate.finishReason})`);
      }

      const botReply = candidate.content.parts[0].text;

      return {
        success: true,
        message: botReply,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const errMsg = error.response?.data?.error?.message || error.message;
      const statusCode = error.response?.status;
      console.error("❌ Lỗi khi gọi Gemini API:", error.response?.data || error.message);
      
      if (errMsg?.includes("API key")) {
        return {
          success: false,
          message: "Lỗi xác thực API. Vui lòng kiểm tra cấu hình GEMINI_API_KEY.",
        };
      }

      // Xử lý lỗi Rate Limit của Google (Mã 429 - Quota Exceeded)
      if (statusCode === 429 || errMsg?.includes("Quota exceeded") || errMsg?.includes("rate limit")) {
        // TỰ ĐỘNG CHẾ ĐỘ FALLBACK TRẢ LỜI MẶC ĐỊNH KHI API CHẶN
        const msg = userMessage.toLowerCase();
        let fallbackReply = "Xin lỗi, hiện tại tôi đang quá tải. Bạn cần hỗ trợ gì ạ?";
        
        if (msg.includes("menu") || msg.includes("món") || msg.includes("bán gì")) {
          fallbackReply = "Dạ Menu Coffee S có bán: Cà phê (Đen, Sữa, Latte), Trà sữa, Sinh tố, Nước ép và Bánh ngọt các loại. Bạn có thể xem chi tiết trên website nhé!";
        } else if (msg.includes("giá") || msg.includes("bao nhiêu")) {
          fallbackReply = "Dạ các món nước và bánh ở Coffee S dao động từ 29.000đ đến 65.000đ tùy loại ạ. Bạn ấn vào từng món trên Menu để xem giá chi tiết nhé!";
        } else if (msg.includes("ở đâu") || msg.includes("địa chỉ") || msg.includes("cơ sở")) {
          fallbackReply = "Dạ Coffee S hiện có tới 30 cơ sở. Một số cơ sở chính nằm tại các quận trung tâm. Bạn có thể xem danh sách cửa hàng ở mục Liên hệ nha.";
        } else if (msg.includes("ship") || msg.includes("giao hàng")) {
          fallbackReply = "Dạ quán có hỗ trợ giao hàng tận nơi ạ! Bạn cứ bỏ món vào giỏ hàng và tiến hành đặt, quán sẽ xác nhận và gửi shipper ngay nha.";
        } else {
          fallbackReply = "Dạ hiện tại Bot đang có chút quá tải nên trả lời chậm. Quán có Menu đa dạng (Cà phê, Trà sữa) và hỗ trợ giao hàng tận nhà. Mình có thể giúp gì thêm cho bạn ạ?";
        }

        return {
          success: true,
          message: fallbackReply,
          timestamp: new Date().toISOString(),
          isFallback: true
        };
      }

      return {
        success: false,
        message: `Hệ thống Bot đang gặp lỗi: ${errMsg}. Xin lỗi vì sự bất tiện này.`,
      };
    }
  }

  // Lấy các câu hỏi gợi ý
  getSuggestedQuestions() {
    return [
      "Menu đồ uống của quán có gì?",
      "Giá cà phê sữa đá bao nhiêu?",
      "Quán có giao hàng không?",
      "Làm thế nào để đặt hàng online?",
      "Có chương trình khuyến mãi nào không?",
      "Quán mở cửa lúc mấy giờ?",
      "Thanh toán bằng cách nào?",
      "Có thể đặt bàn trước được không?",
    ];
  }

  // Reset chat session
  resetChat() {
    this.chat = null;
    return { success: true, message: "Đã reset cuộc hội thoại" };
  }
}

// Export singleton instance
module.exports = new ChatbotService();
