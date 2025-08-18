// export async function onRequestPost({ request }) {
//     const { text, pms } = await request.json();
//     const body = {
//         "messages": [{
//                 "role": "system",
//                 "content": `[角色]
//      你是赛博占卜师，一名经验丰富的专业塔罗牌，雷诺曼牌，易经64卦牌占卜师，熟悉各种牌阵及其背后的象征意义。根据用户提出的[问题]和抽出的[牌阵]，你提供详细的解读，包括[牌面的解释、占卜结果、建议、谶语、未来趋势及注意事项]`
//
//
//             },
//             {
//                 "role": "user",
//                 "content": `卡牌数组是：${JSON.stringify(pms)}，问题是：'${text}？'，请帮我解析`
//             }
//         ],
//         "stream": false,
//         "model": "glm-4-flash",
//         "temperature": 0,
//         "presence_penalty": 0,
//         "frequency_penalty": 0,
//         "top_p": 1
//     }
//     const res = await fetch("https://nas-ai.4ce.cn/v1/chat/completions", {
//         "headers": {
//             "authorization": "Bearer sk-L8W2WtnCtdwG6nctF975D0E770144dE5Be3123Fa16720a03",
//             "content-type": "application/json"
//         },
//         "body": JSON.stringify(body),
//         "method": "POST"
//     });
//
//     const data = await res.json();
//     return new Response(data.choices[0].message.content);
// }
//
//
//
//
//

// export async function onRequestPost({ request }) {
//   try {
//     const { text, pms, spread, deck } = await request.json();
//
//     // 验证必要数据
//     if (!pms || !Array.isArray(pms)) {
//       return new Response(JSON.stringify({ error: 'pms 字段是必需的且必须是数组' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     // 分离指示牌和牌阵牌
//     const guideCards = pms.filter(card => card.type === 'guide');
//     const spreadCards = pms.filter(card => card.type === 'spread');
//
//     // 构建详细的占卜结果描述
//     let divinationResult = '';
//
//     // 基本信息
//     divinationResult += `=== 塔罗占卜结果 ===\n\n`;
//     divinationResult += `【占卜问题】\n${text || '未提供具体问题'}\n\n`;
//
//     // 牌组信息
//     if (deck) {
//       divinationResult += `【使用牌组】\n${deck.name || '标准塔罗牌'}\n\n`;
//     }
//
//     // 牌阵信息
//     if (spread) {
//       divinationResult += `【牌阵信息】\n`;
//       divinationResult += `牌阵名称：${spread.name || '未指定牌阵'}\n`;
//       divinationResult += `牌阵规模：${spread.count || spreadCards.length}张牌\n`;
//       if (spread.desc) {
//         divinationResult += `牌阵说明：${spread.desc}\n`;
//       }
//       if (spread.usage) {
//         divinationResult += `适用场景：${spread.usage}\n`;
//       }
//       divinationResult += `\n`;
//     }
//
//     // 指示牌信息
//     if (guideCards.length > 0) {
//       divinationResult += `【指示牌信息】\n`;
//       divinationResult += `指示牌数量：${guideCards.length}张\n`;
//       divinationResult += `指示牌作用：指示牌独立于牌阵，用于指引整体占卜方向和能量背景\n`;
//       guideCards.forEach((card, index) => {
//         divinationResult += `第${index + 1}张指示牌：${card.name}${card.isReversed ? '（逆位）' : '（正位）'}\n`;
//       });
//       divinationResult += `\n`;
//     }
//
//     // 牌阵牌信息
//     if (spreadCards.length > 0) {
//       divinationResult += `【牌阵牌信息】\n`;
//       divinationResult += `牌阵牌数量：${spreadCards.length}张\n`;
//       divinationResult += `牌阵位置：严格按照以下对应关系解析\n`;
//       spreadCards.forEach((card, index) => {
//         const position = spread?.positions?.[index] || `第${index + 1}位`;
//         divinationResult += `第${index + 1}位（${position}）：${card.name}${card.isReversed ? '（逆位）' : '（正位）'}\n`;
//       });
//       divinationResult += `\n`;
//     }
//
//     // 牌位含义说明
//     if (spread?.positions && spread.positions.length > 0) {
//       divinationResult += `【牌位含义说明】\n`;
//       spread.positions.forEach((position, index) => {
//         divinationResult += `第${index + 1}位：${position}\n`;
//       });
//       divinationResult += `\n`;
//     }
//
//     // 配置统计
//     divinationResult += `【占卜配置统计】\n`;
//     divinationResult += `总卡牌数：${pms.length}张\n`;
//     divinationResult += `指示牌数量：${guideCards.length}张\n`;
//     divinationResult += `牌阵牌数量：${spreadCards.length}张\n\n`;
//
//     divinationResult += `=== 占卜结果详情结束 ===\n\n`;
//
//     // 构建优化后的系统提示词
//
//     const userMessage = `以下是本次占卜的完整结果信息：
//
// ${divinationResult}
//
// 请严格按照要求，先完整重复输出上述占卜结果信息，然后进行专业的塔罗牌解读分析。`;
//
//     // 构建请求体
//     const body = {
//       "messages": [
//         {
//           "role": "system",
//           "content": systemPrompt
//         },
//         {
//           "role": "user",
//           "content": userMessage
//         }
//       ],
//       "stream": false,
//       "model": "glm-4-flash",
//       "temperature": 0.8, // 提高创造性
//       "presence_penalty": 0.1, // 避免重复
//       "frequency_penalty": 0.1, // 鼓励多样性
//       "top_p": 0.9
//     };
//
//     // 调用大模型 API
//     const res = await fetch("https://nas-ai.4ce.cn/v1/chat/completions", {
//       "headers": {
//         "authorization": "Bearer sk-L8W2WtnCtdwG6nctF975D0E770144dE5Be3123Fa16720a03",
//         "content-type": "application/json"
//       },
//       "body": JSON.stringify(body),
//       "method": "POST"
//     });
//
//     if (!res.ok) {
//       const errorText = await res.text();
//       console.error('API 错误响应:', errorText);
//       throw new Error(`API 错误! status: ${res.status}`);
//     }
//
//     const data = await res.json();
//
//     if (!data.choices || !data.choices[0] || !data.choices[0].message) {
//       throw new Error('API 响应格式异常');
//     }
//
//     const responseContent = data.choices[0].message.content;
//
//     return new Response(JSON.stringify({
//       content: responseContent,
//       success: true,
//       sessionInfo: {
//         totalCards: pms.length,
//         guideCards: guideCards.length,
//         spreadCards: spreadCards.length,
//         spreadName: spread?.name || '未指定牌阵'
//       }
//     }), {
//       headers: { 'Content-Type': 'application/json' }
//     });
//
//   } catch (error) {
//     console.error('处理请求时出错:', error);
//
//     return new Response(JSON.stringify({
//       error: '处理请求失败',
//       details: error.message,
//       success: false
//     }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }

//
// export async function onRequestPost({ request }) {
//   console.log('收到占卜请求');
//
//   try {
//     const { text, pms, spread, deck } = await request.json();
//
//     // 验证必要字段
//     if (!pms || !Array.isArray(pms)) {
//       console.error('缺少必要的 pms 字段或格式不正确');
//       return new Response(JSON.stringify({ error: 'pms 字段是必需的且必须是数组' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     // 只取牌阵牌，完全忽略指示牌
//     const spreadCards = pms.filter(card => card.type === 'spread');
//
//     console.log('=== 处理数据 ===');
//     console.log('总牌数:', pms.length);
//     console.log('牌阵牌数量:', spreadCards.length);
//     console.log('牌阵信息:', spread?.name);
//
//     // 如果没有牌阵牌，返回错误
//     if (spreadCards.length === 0) {
//       return new Response(JSON.stringify({ error: '没有找到牌阵牌' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     console.log('解析成功:', { text, pmsLength: pms.length, spread: spread?.name, deck: deck?.name });
//
//     // 系统提示词
//     const systemPrompt = `[身份设定]
// 你是资深赛博占卜师，精通塔罗牌78张、雷诺曼36张、易经64卦及各种牌阵/卦阵布局和象征体系。你的使命是为求问者提供深入、专业、可执行的占卜解读。`
//
//
//     // 构建用户消息 - 只包含牌阵信息
//     const userMessage = `【占卜问题】
// ${text || '请为我进行塔罗占卜'}
//
// 【使用牌组】
// ${deck?.name || '标准塔罗牌'}
//
// 【牌阵信息】
// 牌阵名称：${spread?.name || '标准牌阵'}
// 牌阵说明：${spread?.desc || ''}
//
// 【牌阵布局】（共${spreadCards.length}张牌）
// ${spreadCards.map((card, index) => {
//       const positionName = spread?.positions?.[index] || `第${index + 1}位`;
//       return `${positionName}：${card.name}${card.isReversed ? '（逆位）' : '（正位）'}`;
//     }).join('\n')}
//
// 【解析要求】
// 请严格按照上述牌阵布局进行解析：
// ${spreadCards.map((card, index) => {
//       const positionName = spread?.positions?.[index] || `第${index + 1}位`;
//       return `${index + 1}. ${positionName} - ${card.name}${card.isReversed ? '（逆位）' : '（正位）'}`;
//     }).join('\n')}
//
// 请为我提供详细的占卜解析。`;
//
//     // 构建单次对话的消息数组
//     const messages = [
//       {
//         "role": "system",
//         "content": systemPrompt
//       },
//       {
//         "role": "user",
//         "content": userMessage
//       }
//     ];
//
//     // 打印传给AI的完整信息
//     console.log('\n==================== 传给AI的完整信息 ====================');
//     console.log('【系统提示词】');
//     console.log(systemPrompt);
//     console.log('\n【用户消息】');
//     console.log(userMessage);
//     console.log('========================================================\n');
//
//     // 智谱 API 请求
//     const apiRequestBody = {
//       "model": "glm-4.5-flash",
//       "messages": messages,
//       "temperature": 0.7,
//       "max_tokens": 90000
//     };
//
//     console.log('=== API请求体信息 ===');
//     console.log('模型:', apiRequestBody.model);
//     console.log('温度:', apiRequestBody.temperature);
//     console.log('最大token:', apiRequestBody.max_tokens);
//     console.log('消息数量:', apiRequestBody.messages.length);
//
//     console.log('正在调用智谱 API（单次对话）...');
//
//     const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
//       "method": "POST",
//       "headers": {
//         "Authorization": "Bearer 71417eea1e2e423e8da537452dfb7a21.kCF5Hgqhr40Rp9va",
//         "Content-Type": "application/json"
//       },
//       "body": JSON.stringify(apiRequestBody)
//     });
//
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('智谱 API 错误响应:', errorText);
//       throw new Error(`智谱 API 错误! status: ${response.status}, response: ${errorText}`);
//     }
//
//     const data = await response.json();
//     console.log('智谱 API 调用成功');
//
//     // 打印API返回的原始数据
//     console.log('\n=== API返回的原始数据 ===');
//     console.log(JSON.stringify(data, null, 2));
//
//     if (!data.choices || !data.choices[0] || !data.choices[0].message) {
//       throw new Error('智谱 API 响应格式异常');
//     }
//
//     const assistantMessage = data.choices[0].message.content;
//
//     // 打印AI的回复内容
//     console.log('\n=== AI回复内容 ===');
//     console.log(assistantMessage);
//     console.log('=====================\n');
//
//     // 直接返回结果
//     return new Response(JSON.stringify({
//       content: assistantMessage
//     }), {
//       headers: { 'Content-Type': 'application/json' }
//     });
//
//   } catch (error) {
//     console.error('处理请求时出错:', error);
//
//     return new Response(JSON.stringify({
//       error: '处理请求失败',
//       details: error.message,
//       success: false
//     }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }


export async function onRequestPost({ request }) {
  console.log('收到占卜请求');

  try {
    const { text, pms, spread, deck } = await request.json();

    // 验证必要字段
    if (!pms || !Array.isArray(pms)) {
      console.error('缺少必要的 pms 字段或格式不正确');
      return new Response(JSON.stringify({ error: 'pms 字段是必需的且必须是数组' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 只取牌阵牌，忽略指示牌
    const spreadCards = pms.filter(card => card.type === 'spread');

    console.log('=== 处理数据 ===');
    console.log('总牌数:', pms.length);
    console.log('牌阵牌数量:', spreadCards.length);
    console.log('牌阵信息:', spread?.name);

    if (spreadCards.length === 0) {
      return new Response(JSON.stringify({ error: '没有找到牌阵牌' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('解析成功:', { text, pmsLength: pms.length, spread: spread?.name, deck: deck?.name });

    // 系统提示词
    const systemPrompt = `[身份设定]
你是资深赛博占卜师，精通塔罗牌78张、雷诺曼36张、易经64卦及各种牌阵/卦阵布局和象征体系。你的使命是为求问者提供深入、专业、可执行的占卜解读。`

    // 构建用户消息
    const userMessage = `【占卜问题】
${text || '请为我进行塔罗占卜'}

【使用牌组】
${deck?.name || '标准塔罗牌'}

【牌阵信息】
牌阵名称：${spread?.name || '标准牌阵'}
牌阵说明：${spread?.desc || ''}

【牌阵布局】（共${spreadCards.length}张牌）
${spreadCards.map((card, index) => {
      const positionName = spread?.positions?.[index] || `第${index + 1}位`;
      return `${positionName}：${card.name}${card.isReversed ? '（逆位）' : '（正位）'}`;
    }).join('\n')}

【解析要求】
请严格按照上述牌阵布局进行解析：
${spreadCards.map((card, index) => {
      const positionName = spread?.positions?.[index] || `第${index + 1}位`;
      return `${index + 1}. ${positionName} - ${card.name}${card.isReversed ? '（逆位）' : '（正位）'}`;
    }).join('\n')}

请为我提供详细的占卜解析。`;

    // 构建请求体 —— 改成第二段 API 格式
    const apiRequestBody = {
      "messages": [
        { "role": "system", "content": systemPrompt },
        { "role": "user", "content": userMessage }
      ],
      "stream": false,
      "model": "glm-4-flash",
      "temperature": 0,
      "presence_penalty": 0,
      "frequency_penalty": 0,
      "top_p": 1
    };

    console.log('=== API请求体信息 ===');
    console.log(JSON.stringify(apiRequestBody, null, 2));

    console.log('正在调用 NAS API（单次对话）...');

    const response = await fetch("https://nas-ai.4ce.cn/v1/chat/completions", {
      method: "POST",
      headers: {
        "authorization": "Bearer sk-L8W2WtnCtdwG6nctF975D0E770144dE5Be3123Fa16720a03",
        "content-type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NAS API 错误响应:', errorText);
      throw new Error(`NAS API 错误! status: ${response.status}, response: ${errorText}`);
    }

    const data = await response.json();
    console.log('NAS API 调用成功');

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('NAS API 响应格式异常');
    }

    const assistantMessage = data.choices[0].message.content;

    console.log('\n=== AI回复内容 ===');
    console.log(assistantMessage);

    return new Response(JSON.stringify({
      content: assistantMessage
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('处理请求时出错:', error);

    return new Response(JSON.stringify({
      error: '处理请求失败',
      details: error.message,
      success: false
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
