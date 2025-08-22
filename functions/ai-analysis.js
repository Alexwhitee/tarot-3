const systemPrompt = `## **[身份与目标]**

你是一名经验丰富的资深占卜师，精通塔罗、雷诺曼、易经64卦、小六壬等图像符号占卜体系，并掌握"象法"解读技巧。
你的任务是通过牌面符号（**卦象脉络 story_hint**、**卦象动态 actions**、**卦中人象 characters**、**卦中物象 props**、**卦象场域 environment**、**五行生克 element_relations** 等）结合**牌阵结构和每个位置的功能**，推演事件发展脉络，并生成客观、明确的占卜问题答案。
`;

// AI分析专用端点
export async function onRequestPost({ request, env }) {
  console.log('收到AI分析请求');

  try {
    const { text, pms, spread, deck, model } = await request.json();

    // 验证必要字段
    if (!pms || !Array.isArray(pms)) {
      return new Response(JSON.stringify({ error: 'pms 字段是必需的且必须是数组' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证模型参数
    if (!model) {
      return new Response(JSON.stringify({ error: '请选择AI模型' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证模型是否支持
    const supportedModels = [
      'glm-4.5-flash',
      'gpt-5-2025-08-07',
      'o3',
      'claude-3-7-sonnet-20250219-thinking',
      'gemini-2.5-flash',
      'gemini-2.5-pro',
      'grok-4',
      'grok-3-deepsearch',
      'qwen3-235b-a22b',
      'qwen3-235b-a22b-think',
      'deepseek-r1',
      'deepseek-v3',
      'doubao-1.5-pro-256k',
      'glm-4.5',
      'hunyuan-standard-256K',
      'kimi-k2-250711',

      'gpt-4.1-nano-2025-04-14',
      'claude-3-haiku-20240307',
      'gemini-2.0-flash',
      'qwen-turbo-1101',
      'claude-sonnet-4-20250514-thinking'
    ];

    if (!supportedModels.includes(model)) {
      return new Response(JSON.stringify({
        error: '不支持的模型',
        supportedModels: supportedModels
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 只取牌阵牌，完全忽略指示牌
    const spreadCards = pms.filter(card => card.type === 'spread');

    console.log('=== AI分析处理数据 ===');
    console.log('选择的模型:', model);
    console.log('总牌数:', pms.length);
    console.log('牌阵牌数量:', spreadCards.length);
    console.log('牌阵信息:', spread?.name);

    // 如果没有牌阵牌，返回错误
    if (spreadCards.length === 0) {
      return new Response(JSON.stringify({ error: '没有找到牌阵牌' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证每张牌是否包含cardAnalysis数据
    const missingAnalysis = spreadCards.filter(card => !card.cardAnalysis);
    if (missingAnalysis.length > 0) {
      console.warn('部分牌缺少象征分析数据:', missingAnalysis.map(card => card.name));
      return new Response(JSON.stringify({
        error: '部分牌缺少象征分析数据',
        missingCards: missingAnalysis.map(card => card.name)
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证每张牌是否包含 possible_real_world_mapping 字段
    const missingMapping = spreadCards.filter(card =>
      !card.cardAnalysis.possible_real_world_mapping
    );
    if (missingMapping.length > 0) {
      console.warn('部分牌缺少现实映射数据:', missingMapping.map(card => card.name));
      return new Response(JSON.stringify({
        error: '部分牌缺少现实映射数据',
        missingCards: missingMapping.map(card => card.name)
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查是否有五行数据
    const hasElementRelations = spreadCards.some(card => card.cardAnalysis.element_relations);
    console.log('是否包含五行数据:', hasElementRelations);

    const safeJoin = (value, separator = '、') => {
      if (Array.isArray(value)) return value.join(separator);
      if (value == null) return '';
      return String(value);
    };

    const userMessage = `【占卜问题】
${text || '请为我进行塔罗占卜'}

【使用牌组】
${deck?.name || '标准塔罗牌'}

【牌阵信息】
牌阵名称：${spread?.name || '标准牌阵'}
牌阵说明：${spread?.desc || ''}

【牌阵布局与象征分析】（共${spreadCards.length}张牌）
${spreadCards.map((card, index) => {
      const positionName = spread?.positions?.[index] || `第${index + 1}位`;
      const analysis = card.cardAnalysis || {};

      let cardInfo = `${positionName}：${card.name}${card.isReversed ? '（逆位）' : '（正位）'}

象征元素：
- 卦中人象：${safeJoin(analysis.symbols?.characters)}
- 卦中物象：${safeJoin(analysis.symbols?.props)}
- 卦象场域：${safeJoin(analysis.symbols?.environment)}
- 时机节点：${analysis.symbols?.time_hint || ''}
- 气运走向：${analysis.symbols?.direction || ''}

卦象动态：${safeJoin(analysis.actions)}
卦象脉络：${analysis.story_hint || ''}
择机抉择：${safeJoin(analysis.branches)}
应世对照：${analysis.possible_real_world_mapping || ''}`;

      // 如果有五行关系数据，则添加到分析中
      if (analysis.element_relations) {
        cardInfo += `
五行生克：${analysis.element_relations.element || ''}
- 生成：${safeJoin(analysis.element_relations.generates)}
- 克制：${safeJoin(analysis.element_relations.overcomes)}
- 被生：${safeJoin(analysis.element_relations.generated_by)}
- 被克：${safeJoin(analysis.element_relations.overcome_by)}`;
      }

      return cardInfo;
    }).join('\n\n')}`;

    const messages = [
      {
        "role": "system",
        "content": systemPrompt
      },
      {
        "role": "user",
        "content": userMessage
      }
    ];

    // ===== 重要：打印传给AI的完整信息 =====
    console.log('\n\n==================== AI分析传给API的完整信息 ====================');
    console.log('【系统提示词】');
    console.log(systemPrompt);
    console.log('\n【用户消息】');
    console.log(userMessage);

    // 打印数据统计信息
    console.log('\n【数据统计】');
    console.log('使用模型:', model);
    console.log('牌阵牌数量:', spreadCards.length);
    console.log('包含五行数据的牌:', spreadCards.filter(card => card.cardAnalysis.element_relations).length);
    console.log('五行元素分布:', spreadCards
      .filter(card => card.cardAnalysis.element_relations)
      .map(card => `${card.name}(${card.cardAnalysis.element_relations.element})`)
      .join(', ') || '无');

    console.log('\n【完整消息数组】');
    console.log(JSON.stringify(messages, null, 2));
    console.log('================================================================\n\n');

    // 云雾 API 请求
    const apiRequestBody = {
      "model": model,  // 使用前端传来的模型参数
      "messages": messages,
      "temperature": 0.6,
      "max_tokens": 5000,
      "stream": false
    };

    console.log('=== AI分析API请求体信息 ===');
    console.log('模型:', apiRequestBody.model);
    console.log('温度:', apiRequestBody.temperature);
    console.log('最大token:', apiRequestBody.max_tokens);
    console.log('消息数量:', apiRequestBody.messages.length);
    console.log('是否包含五行分析:', hasElementRelations);

    console.log(`正在调用云雾 API进行AI分析（模型：${model}）...`);

    // 调用云雾API
    const response = await fetch("https://api.wlai.vip/v1/chat/completions", {
      "method": "POST",
      "headers": {
        "Authorization": `Bearer ${env.WLAI_API_KEY}`, // 需要在环境变量中设置
        "Content-Type": "application/json"
      },
      "body": JSON.stringify(apiRequestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('云雾 API 错误响应:', errorText);
      throw new Error(`云雾 API 错误! status: ${response.status}, response: ${errorText}`);
    }

    const data = await response.json();
    console.log('云雾 API AI分析调用成功');

    // 打印API返回的原始数据
    console.log('\n=== AI分析API返回的原始数据 ===');
    console.log(JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('云雾 API 响应格式异常');
    }

    const assistantMessage = data.choices[0].message.content;

    // 打印AI的回复内容
    console.log('\n=== AI分析回复内容 ===');
    console.log(assistantMessage);
    console.log('=========================\n');

    // 返回AI分析结果
    return new Response(JSON.stringify({
      content: assistantMessage
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI分析处理请求时出错:', error);
    return new Response(JSON.stringify({
      error: 'AI分析处理失败',
      details: error.message,
      success: false
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
