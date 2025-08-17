

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
// function getConversationHistory(sessionId) {
//   if (!conversationHistory.has(sessionId)) {
//     // 初始化会话，包含系统提示词
//     conversationHistory.set(sessionId, [
//       {
//         "role": "system",
//         "content": `现在你是塔罗牌大师，根据我所选的牌去根据问题去解析，
// 如果用户继续提问，你可以基于之前的占卜结果进行深入解答或补充说明。`
//       }
//     ]);
//   }
//   return conversationHistory.get(sessionId);
// }


// 构建优化后的系统提示词
const systemPrompt = `[身份设定]
你是资深的赛博占卜师，拥有丰富的塔罗牌、雷诺曼牌、易经64卦卡牌占卜经验，精通各种牌阵/卦阵布局和象征体系。你的使命是为求问者提供准确、深入的占卜解读服务。`;





// function getConversationHistory(sessionId) {
//   if (!conversationHistory.has(sessionId)) {
//     conversationHistory.set(sessionId, [
//       {
//         "role": "system",
//         "content": `你是专业的塔罗牌大师。在进行塔罗牌解析时，请严格遵循以下规则：
//
// 1. 指示牌解析：指示牌独立于牌阵，用于指引整体占卜方向和能量背景，不占用牌阵位置
// 2. 牌阵解析：牌阵牌严格按照牌位顺序解析，一个位置对应一张牌，不要将指示牌分配到牌阵位置
// 3. 解析顺序：先解析指示牌，再按牌位顺序解析牌阵牌，最后综合分析
// 4. 位置对应：严格按照提供的牌位对应关系进行解析，不要自行重新分配
//
// 如果用户继续提问，你可以基于之前的占卜结果进行深入解答或补充说明。`
//       }
//     ]);
//   }
//   return conversationHistory.get(sessionId);
// }

function getConversationHistory(sessionId) {
  if (!conversationHistory.has(sessionId)) {
    conversationHistory.set(sessionId, [
      {
        "role": "system",
        "content": systemPrompt
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

//       // 构建用户消息
//       userMessage = `请为我进行塔罗牌占卜解析：
// 问题：${text || '未提供具体问题'}
// 选择的卡牌：${JSON.stringify(pms)}
// 使用的牌阵：${spread?.name || '未指定牌阵'}（${spread?.count || 0}张牌）
// 牌阵说明：${spread?.desc || '无'}
// 牌位含义：${spread?.positions ? spread.positions.join('、') : '无'}
// 使用的牌组：${deck?.name || '标准塔罗牌'}
//
// 请根据以上信息进行详细的塔罗牌解析。`;
//       // 分离指示牌和牌阵牌
//       const guideCards = pms.filter(card => card.type === 'guide');
//       const spreadCards = pms.filter(card => card.type === 'spread');
// 分离指示牌和牌阵牌
      const guideCards = pms.filter(card => card.type === 'guide');
      const spreadCards = pms.filter(card => card.type === 'spread');



// 构建指示牌信息
      let guideCardsInfo = '';
      if (guideCards.length > 0) {
        guideCardsInfo = `
指示牌信息：
${guideCards.map((card, index) =>
          `  第${index + 1}张指示牌：${card.name}${card.isReversed ? '（逆位）' : '（正位）'}`
        ).join('\n')}
指示牌作用：指示牌用于指引整体占卜方向，代表当前的能量状态和整体趋势，为整个占卜提供背景和指导。
`;
      } else {
        guideCardsInfo = '\n本次占卜未使用指示牌。\n';
      }

// 构建牌阵牌信息
      let spreadCardsInfo = '';
      if (spreadCards.length > 0) {
        spreadCardsInfo = `
牌阵牌信息：
${spreadCards.map((card, index) => {
          const position = spread?.positions?.[index] || `第${index + 1}位`;
          return `  ${position}：${card.name}${card.isReversed ? '（逆位）' : '（正位）'}`;
        }).join('\n')}
`;
      } else {
        spreadCardsInfo = '\n牌阵牌信息：无\n';
      }

// 构建牌位含义说明
      let positionMeanings = '';
      if (spread?.positions && spread.positions.length > 0) {
        positionMeanings = `
牌位含义详解：
${spread.positions.map((position, index) => {
          const card = spreadCards[index];
          if (card) {
            return `  第${index + 1}位（${position}）：${card.name}${card.isReversed ? '（逆位）' : '（正位）'}`;
          } else {
            return `  第${index + 1}位（${position}）：未分配卡牌`;
          }
        }).join('\n')}

重要说明：
- 指示牌独立于牌阵位置，不占用牌阵的任何位置
- 牌阵共有${spread.positions.length}个位置，每个位置对应一张牌阵牌
- 请严格按照上述对应关系进行解析，不要将指示牌分配到牌阵位置中
`;
      }


// 构建完整的用户消息
      userMessage = `请为我进行塔罗牌占卜解析：

【占卜问题】
${text || '未提供具体问题'}

【使用牌组】
${deck?.name || '标准塔罗牌'}

【牌阵信息】
牌阵名称：${spread?.name || '未指定牌阵'}
牌阵规模：${spread?.count || 0}张牌
牌阵说明：${spread?.desc || '无特殊说明'}
适用场景：${spread?.usage || '通用场景'}

${guideCardsInfo}
${spreadCardsInfo}
${positionMeanings}

【占卜配置】
总卡牌数：${pms.length}张
指示牌数量：${guideCards.length}张
牌阵牌数量：${spreadCards.length}张

【重要提醒】
1. 指示牌与牌阵牌是完全独立的两个部分
2. 指示牌不占用牌阵的任何位置
3. 牌阵共有${spread?.count || 0}个位置，每个位置严格对应一张牌阵牌
4. 请不要将指示牌分配到牌阵位置中

【解析要求】
请严格按照以下顺序进行解析：
1. 【指示牌解析】：先单独解析指示牌的整体指引意义和能量背景
2. 【牌阵解析】：然后严格按照牌位顺序解析每张牌阵牌，一个位置对应一张牌
3. 【综合解析】：结合指示牌的指引和牌阵的具体信息给出综合建议
4. 【注意事项】：请考虑正逆位的不同含义，结合牌阵的特定含义进行解析

请确保指示牌和牌阵牌的解析完全分离，不要混淆它们的作用和位置。`;


    }

    // 添加用户消息到会话历史
    messages.push({
      "role": "user",
      "content": userMessage
    });

    // 智谱 API 请求体格式 - 修正变量名
    const apiRequestBody = {
      "model": "glm-4.5-flash", // 根据文档使用 glm-4.5 或 glm-4-flash
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
  console.log('API响应原始文本:', resText)
  console.log('解析后的内容:', content)
  console.log('转换为HTML后:', html)
});



