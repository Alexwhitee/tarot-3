// import express from 'express'
// import cors from 'cors'
//
// const app = express()
//
// // 中间件配置 - 修正版本
// app.use(cors())
// app.use(express.json({ limit: '10mb' })) // 增加请求体大小限制
// app.use(express.urlencoded({ extended: true })) // 支持 URL 编码的请求体
//
// // 添加请求日志中间件（用于调试）
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//   console.log('Headers:', req.headers);
//   console.log('Content-Type:', req.get('Content-Type'));
//   next();
// });
//
// // 复制你的 API 逻辑
// app.post('/', async (req, res) => {
//   console.log('收到请求 - req.body:', req.body);
//   console.log('请求体类型:', typeof req.body);
//
//   // 添加请求体验证
//   if (!req.body) {
//     console.error('请求体为空');
//     return res.status(400).json({ error: '请求体为空' });
//   }
//
//   try {
//     const { text, pms, spread, deck } = req.body;
//
//     // 验证必要字段
//     if (!pms || !Array.isArray(pms)) {
//       console.error('缺少必要的 pms 字段或格式不正确');
//       return res.status(400).json({ error: 'pms 字段是必需的且必须是数组' });
//     }
//
//     console.log('解析成功:', { text, pmsLength: pms.length, spread: spread?.name, deck: deck?.name });
//
//     const body = {
//       "messages": [{
//         "role": "system",
//         "content": `现在你是塔罗牌大师，根据我所选的牌去根据问题去解析`
//       },
//         {
//           "role": "user",
//           "content": `卡牌数组是：${JSON.stringify(pms)}，问题是：'${text || '未提供问题'}？'，请帮我解析`
//         }
//       ],
//       "stream": false,
//       "model": "glm-4-flash",
//       "temperature": 0,
//       "presence_penalty": 0,
//       "frequency_penalty": 0,
//       "top_p": 1
//     }
//
//     console.log('正在调用大模型API...');
//
//     const response = await fetch("https://nas-ai.4ce.cn/v1/chat/completions", {
//       "headers": {
//         "authorization": "Bearer sk-L8W2WtnCtdwG6nctF975D0E770144dE5Be3123Fa16720a03",
//         "content-type": "application/json"
//       },
//       "body": JSON.stringify(body),
//       "method": "POST"
//     });
//
//     // 智谱 API 调用
//     // const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
//     //   "method": "POST",
//     //   "headers": {
//     //     "Authorization": "593b809e3a72cb9323bf63c345386f14.I2P21rizsBJFGifD", // 请替换为你的实际 API 密钥
//     //     "Content-Type": "application/json"
//     //   },
//     //   "body": JSON.stringify(requestBody)
//     // });
//
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
//     }
//
//     const data = await response.json();
//     console.log('API调用成功');
//
//     res.send(data.choices[0].message.content);
//
//   } catch (error) {
//     console.error('处理请求时出错:', error);
//     res.status(500).json({
//       error: '处理请求失败',
//       details: error.message,
//       stack: error.stack
//     });
//   }
// });
//
// // 添加健康检查端点
// app.get('/health', (req, res) => {
//   res.json({ status: 'ok', timestamp: new Date().toISOString() });
// });
//
// // 添加通用错误处理中间件
// app.use((err, req, res, next) => {
//   console.error('Express 错误:', err);
//   res.status(500).json({ error: '服务器内部错误', details: err.message });
// });
//
// // 404 处理
// app.use((req, res) => {
//   res.status(404).json({ error: 'Not Found' });
// });
//
// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`本地API服务器运行在 http://localhost:${PORT}`);
//   console.log('健康检查: http://localhost:' + PORT + '/health');
//   console.log('等待前端请求...');
// });
// 在 local-server.js 中添加一个测试端点
// 在 local-server.js 中添加或替换测试端点

import express from 'express'
import cors from 'cors'

const app = express()

// 存储会话历史的内存存储（生产环境建议使用数据库）
const conversationHistory = new Map()

// 中间件配置
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// 添加请求日志中间件（用于调试）
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Content-Type:', req.get('Content-Type'));
  next();
});

// 生成会话ID的函数
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 获取或创建会话历史
function getConversationHistory(sessionId) {
  if (!conversationHistory.has(sessionId)) {
    // 初始化会话，包含系统提示词
    conversationHistory.set(sessionId, [
      {
        "role": "system",
        "content": `现在你是塔罗牌大师，根据我所选的牌去根据问题去解析，
如果用户继续提问，你可以基于之前的占卜结果进行深入解答或补充说明。`
      }
    ]);
  }
  return conversationHistory.get(sessionId);
}

// 主要的塔罗占卜API端点
app.post('/', async (req, res) => {
  console.log('收到请求 - req.body:', req.body);
  console.log('请求体类型:', typeof req.body);

  // 添加请求体验证
  if (!req.body) {
    console.error('请求体为空');
    return res.status(400).json({ error: '请求体为空' });
  }

  try {
    const { text, pms, spread, deck, sessionId: clientSessionId, followUp } = req.body;

    // 生成或使用现有的会话ID
    const sessionId = clientSessionId || generateSessionId();
    const messages = getConversationHistory(sessionId);

    let userMessage = '';

    if (followUp) {
      // 这是一个后续问题
      userMessage = text || '请继续解释';
      console.log('处理后续问题:', userMessage);
    } else {
      // 这是一个新的占卜请求
      // 验证必要字段
      if (!pms || !Array.isArray(pms)) {
        console.error('缺少必要的 pms 字段或格式不正确');
        return res.status(400).json({ error: 'pms 字段是必需的且必须是数组' });
      }

      console.log('解析成功:', { text, pmsLength: pms.length, spread: spread?.name, deck: deck?.name });

      // 构建用户消息
      userMessage = `请为我进行塔罗牌占卜解析：
问题：${text || '未提供具体问题'}
选择的卡牌：${JSON.stringify(pms)}
使用的牌阵：${spread?.name || '未指定牌阵'}（${spread?.count || 0}张牌）
牌阵说明：${spread?.desc || '无'}
牌位含义：${spread?.positions ? spread.positions.join('、') : '无'}
使用的牌组：${deck?.name || '标准塔罗牌'}

请根据以上信息进行详细的塔罗牌解析。`;
    }

    // 添加用户消息到会话历史
    messages.push({
      "role": "user",
      "content": userMessage
    });

    // 智谱 API 请求体格式 - 修正变量名
    const apiRequestBody = {
      "model": "glm-4-flash", // 根据文档使用 glm-4.5 或 glm-4-flash
      "messages": messages,
      "temperature": 0.6,
      "max_tokens": 2000
    };

    console.log('正在调用智谱 API...');
    console.log('会话ID:', sessionId);
    console.log('消息历史长度:', messages.length);

    // 智谱 API 调用
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      "method": "POST",
      "headers": {
        "Authorization": "Bearer 71417eea1e2e423e8da537452dfb7a21.kCF5Hgqhr40Rp9va", // 请替换为你的实际 API 密钥
        "Content-Type": "application/json"
      },
      "body": JSON.stringify(apiRequestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('智谱 API 错误响应:', errorText);
      throw new Error(`智谱 API 错误! status: ${response.status}, response: ${errorText}`);
    }

    const data = await response.json();
    console.log('智谱 API 调用成功');
    console.log('API 响应:', data);

    // 检查响应格式
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('智谱 API 响应格式异常');
    }

    const assistantMessage = data.choices[0].message.content;

    // 将助手回复添加到会话历史
    messages.push({
      "role": "assistant",
      "content": assistantMessage
    });

    // 限制会话历史长度，避免内存过大（保留最近20条消息）
    if (messages.length > 21) { // 保留系统消息 + 最近20条
      const systemMessage = messages[0]; // 保留系统消息
      const recentMessages = messages.slice(-20); // 保留最近20条
      conversationHistory.set(sessionId, [systemMessage, ...recentMessages]);
    }

    // 返回响应，包含会话ID
    res.json({
      content: assistantMessage,
      sessionId: sessionId,
      messageCount: messages.length - 1 // 不计算系统消息
    });

  } catch (error) {
    console.error('处理请求时出错:', error);
    res.status(500).json({
      error: '处理请求失败',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// 获取会话历史的端点
app.get('/conversation/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const messages = conversationHistory.get(sessionId);

  if (!messages) {
    return res.status(404).json({ error: '会话不存在' });
  }

  // 返回除系统消息外的所有消息
  res.json({
    sessionId: sessionId,
    messages: messages.slice(1), // 排除系统消息
    messageCount: messages.length - 1
  });
});

// 清除会话历史的端点
app.delete('/conversation/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  if (conversationHistory.has(sessionId)) {
    conversationHistory.delete(sessionId);
    res.json({ message: '会话已清除', sessionId: sessionId });
  } else {
    res.status(404).json({ error: '会话不存在' });
  }
});

// 获取所有活跃会话的端点
app.get('/conversations', (req, res) => {
  const sessions = Array.from(conversationHistory.keys()).map(sessionId => ({
    sessionId: sessionId,
    messageCount: conversationHistory.get(sessionId).length - 1, // 不计算系统消息
    lastActivity: new Date().toISOString() // 简化版本，实际应该记录真实的最后活动时间
  }));

  res.json({ sessions: sessions, total: sessions.length });
});

// 添加健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    activeSessions: conversationHistory.size
  });
});

// 添加通用错误处理中间件
app.use((err, req, res, next) => {
  console.error('Express 错误:', err);
  res.status(500).json({ error: '服务器内部错误', details: err.message });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`本地API服务器运行在 http://localhost:${PORT}`);
  console.log('健康检查: http://localhost:' + PORT + '/health');
  console.log('会话管理: http://localhost:' + PORT + '/conversations');
  console.log('等待前端请求...');
});



// app.get('/test-api', async (req, res) => {
//   console.log('开始测试智谱API...');
//
//   try {
//     const requestBody = {
//       model: "glm-4.5",
//       messages: [
//         {
//           role: "user",
//           content: "你好，请简单介绍一下自己"
//         }
//       ],
//       temperature: 0.6,
//       max_tokens: 100
//     };
//
//     console.log('请求体:', JSON.stringify(requestBody, null, 2));
//     console.log('API密钥前缀:', process.env.ZHIPU_API_KEY ? process.env.ZHIPU_API_KEY.substring(0, 10) + '...' : '未设置');
//
//     const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": "Bearer 71417eea1e2e423e8da537452dfb7a21.kCF5Hgqhr40Rp9va", // 请确保这里是你的真实API密钥
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(requestBody)
//     });
//
//     console.log('API响应状态:', response.status);
//     console.log('API响应头:', Object.fromEntries(response.headers.entries()));
//
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('API错误响应:', errorText);
//       throw new Error(`API错误: ${response.status}, ${errorText}`);
//     }
//
//     const data = await response.json();
//     console.log('API响应成功:', data);
//
//     res.json({
//       success: true,
//       message: '智谱API测试成功',
//       data: data,
//       apiResponse: data.choices[0]?.message?.content || '无响应内容'
//     });
//
//   } catch (error) {
//     console.error('测试API时出错:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       stack: error.stack
//     });
//   }
// });
