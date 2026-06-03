// DeepSeek API 配置
const DEEPSEEK_API_KEY = 'sk-f1e2ce3faf714f9f832180bcbaa780c9';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// 聊天历史记录
let chatHistory = [
    {
        role: 'system',
        content: `你是酸枣枝制膜平台的智能客服"小枣"。你的职责是帮助用户解答关于平台的各种问题。

平台简介：
- 酸枣枝制膜平台是一个连接农户和企业的B2B交易平台
- 核心技术：利用废弃酸枣枝制可降解薄膜，变废为宝
- 主要交易产品：新鲜酸枣枝、干燥酸枣枝、粉碎酸枣枝
- 平台位于河北省邢台市，依托太行山区丰富的酸枣资源

背景说明：
- 每年酸枣采摘后，大量酸枣枝被废弃或焚烧，浪费资源且污染环境
- 酸枣枝富含纤维素和木质素，可制成可降解薄膜
- 平台帮助农户把废弃酸枣枝卖给需要的企业，实现资源再利用

平台功能：
1. 农户中心：农户可以挂牌销售酸枣枝，上传品控照片，查看订单，享受累积优惠
2. 企业采购：企业可以搜索、筛选、采购酸枣枝，查看品控照片
3. 价格标准：平台制定标准化价格体系，每月更新
4. 品控系统：农户上传酸枣枝照片，企业可在线查看品质
5. 交易累积优惠：农户累计交易可获得可降解薄膜购买优惠

价格参考：
- 新鲜酸枣枝：特级 ¥3/公斤，一级 ¥2.5/公斤
- 干燥酸枣枝：特级 ¥3.8/公斤，一级 ¥3.2/公斤
- 粉碎酸枣枝：特级 ¥4.2/公斤，一级 ¥3.5/公斤

注册流程：
1. 点击"注册"按钮
2. 选择身份（农户/企业）
3. 填写手机号、验证码
4. 设置密码
5. 完善个人信息

请用友好、专业的语气回答用户问题。如果用户问到平台相关问题，请详细解答。如果问题超出平台范围，请礼貌地引导用户回到平台相关话题。`
    }
];

// 聊天窗口状态
let isChatOpen = false;
let isLoading = false;

// 切换聊天窗口
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    isChatOpen = !isChatOpen;

    if (isChatOpen) {
        chatWindow.classList.add('active');
    } else {
        chatWindow.classList.remove('active');
    }
}

// 发送消息
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message || isLoading) return;

    // 清空输入框
    input.value = '';

    // 添加用户消息到界面
    addMessage(message, 'user');

    // 添加到聊天历史
    chatHistory.push({
        role: 'user',
        content: message
    });

    // 显示加载状态
    isLoading = true;
    addLoadingMessage();

    try {
        // 调用DeepSeek API
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: chatHistory,
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error('API请求失败');
        }

        const data = await response.json();
        const botReply = data.choices[0].message.content;

        // 移除加载状态
        removeLoadingMessage();

        // 添加机器人回复到界面
        addMessage(botReply, 'bot');

        // 添加到聊天历史
        chatHistory.push({
            role: 'assistant',
            content: botReply
        });

    } catch (error) {
        console.error('API调用错误:', error);
        removeLoadingMessage();

        // 使用本地预设回复
        const localReply = getLocalReply(message);
        addMessage(localReply, 'bot');

        chatHistory.push({
            role: 'assistant',
            content: localReply
        });
    } finally {
        isLoading = false;
    }
}

// 发送快捷回复
function sendQuickReply(question) {
    document.getElementById('chatInput').value = question;
    sendMessage();
}

// 处理回车键
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// 添加消息到界面
function addMessage(content, type) {
    const messagesContainer = document.getElementById('chatMessages');

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    const avatarIcon = type === 'bot' ? 'fa-robot' : 'fa-user';

    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${avatarIcon}"></i>
        </div>
        <div class="message-content">
            <p>${formatMessage(content)}</p>
            <span class="message-time">${getCurrentTime()}</span>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// 添加加载消息
function addLoadingMessage() {
    const messagesContainer = document.getElementById('chatMessages');

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message loading-message';
    loadingDiv.id = 'loadingMessage';

    loadingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    messagesContainer.appendChild(loadingDiv);
    scrollToBottom();
}

// 移除加载消息
function removeLoadingMessage() {
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

// 滚动到底部
function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 获取当前时间
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// 格式化消息（支持简单的markdown）
function formatMessage(content) {
    // 换行
    content = content.replace(/\n/g, '<br>');
    // 粗体
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // 列表
    content = content.replace(/- (.*?)(<br>|$)/g, '<li>$1</li>');
    content = content.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    return content;
}

// 本地预设回复（API调用失败时使用）
function getLocalReply(message) {
    const replies = {
        '注册': '注册成为平台农户非常简单：\n\n1. 点击页面右上角的"注册"按钮\n2. 选择"农户"身份\n3. 填写手机号码并获取验证码\n4. 设置登录密码\n5. 完善个人信息和所在地区\n\n完成注册后，您就可以开始挂牌销售酸枣枝了！',
        '价格': '平台酸枣枝价格标准如下：\n\n**新鲜酸枣枝**\n- 特级：¥3/公斤\n- 一级：¥2.5/公斤\n\n**干燥酸枣枝**\n- 特级：¥3.8/公斤\n- 一级：¥3.2/公斤\n\n**粉碎酸枣枝**\n- 特级：¥4.2/公斤\n- 一级：¥3.5/公斤\n\n价格每月更新，确保公平合理。',
        '品控': '品控照片上传步骤：\n\n1. 登录后进入"农户中心"\n2. 点击"上传照片"标签\n3. 按照拍照建议拍摄酸枣枝照片\n4. 点击上传区域选择照片\n5. 系统会自动关联到您的挂牌商品\n\n**拍照建议：**\n- 在自然光下拍摄\n- 展示酸枣枝的整体和细节\n- 包含尺寸参照物\n- 展示不同干燥程度',
        '交易': '平台交易流程：\n\n1. **注册认证** - 农户或企业注册账户，完成实名认证\n2. **挂牌/采购** - 农户挂牌销售酸枣枝，企业浏览下单\n3. **品控确认** - 上传照片，企业审核确认品质\n4. **交易结算** - 确认收货，平台自动结算\n\n如有其他问题，欢迎继续咨询！',
        '优惠': '交易累积优惠规则：\n\n- 累计交易满500公斤：享受9.5折优惠\n- 累计交易满1000公斤：享受9折优惠\n- 累计交易满2000公斤：享受8.5折优惠\n\n此外，信誉评分4.5以上的优质农户还可获得额外专属优惠！\n\n优惠可用于购买平台生产的可降解薄膜产品。',
        '企业': '企业采购流程：\n\n1. 登录企业账户\n2. 在"企业采购中心"浏览酸枣枝供应列表\n3. 使用筛选功能找到符合需求的酸枣枝\n4. 点击"查看详情"查看品控照片\n5. 点击"立即采购"填写订单\n6. 确认订单并完成支付\n\n平台会自动通知农户确认订单。',
        '制膜': '酸枣枝制膜技术简介：\n\n酸枣枝富含纤维素和木质素，经过特殊工艺处理后，可以制成性能优良的可降解薄膜。\n\n**产品应用：**\n- 农业地膜：可自然降解，减少白色污染\n- 包装材料：环保可降解\n- 工业用膜：性能优良\n\n**环保价值：**\n- 变废为宝，减少资源浪费\n- 减少焚烧，保护环境\n- 推动循环经济发展'
    };

    // 检查关键词匹配
    for (const [key, value] of Object.entries(replies)) {
        if (message.includes(key)) {
            return value;
        }
    }

    // 默认回复
    return '感谢您的咨询！\n\n我是智能客服小枣，可以帮您解答以下问题：\n\n- 如何注册成为农户/企业\n- 酸枣枝的价格标准\n- 品控照片上传要求\n- 交易流程和优惠活动\n- 酸枣枝制膜技术介绍\n\n请问您想了解哪方面的内容？';
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('智能客服已加载');
});
