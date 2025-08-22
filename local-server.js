// import express from 'express'
// import cors from 'cors'
//
// const app = express()
//
// // 中间件配置
// app.use(cors())
// app.use(express.json({ limit: '10mb' }))
// app.use(express.urlencoded({ extended: true }))
//
// // 添加请求日志中间件（用于调试）
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//   next();
// });
//
// // 简化的系统提示词
// const systemPrompt = `[身份设定]
// 你是资深赛博占卜师，精通塔罗牌78张、雷诺曼36张、易经64卦及各种牌阵/卦阵布局和象征体系。你的使命是为求问者提供深入、专业、可执行的占卜解读。`;
//
// app.post('/', async (req, res) => {
//   console.log('收到占卜请求');
//
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
//       return res.status(400).json({ error: 'pms 字段是必需的且必须是数组' });
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
//       return res.status(400).json({ error: '没有找到牌阵牌' });
//     }
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
//     // ===== 重要：打印传给AI的完整信息 =====
//     console.log('\n\n==================== 传给AI的完整信息 ====================');
//     console.log('【系统提示词】');
//     console.log(systemPrompt);
//     console.log('\n【用户消息】');
//     console.log(userMessage);
//     console.log('\n【完整消息数组】');
//     console.log(JSON.stringify(messages, null, 2));
//     console.log('========================================================\n\n');
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
//     // const response = await fetch("https://yunwu.ai", {
//     //   "method": "POST",
//     //   "headers": {
//     //     "Authorization": "Bearer sk-BUmf1legR32W4XZXJcsGrpOScvDWXSVitolhSYw8Yg8DQJ3e",
//     //     "Content-Type": "application/json"
//     //   },
//     //   "body": JSON.stringify(apiRequestBody)
//     // });
//
//
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
//     // 直接返回结果，不保存会话历史
//     res.json({
//       content: assistantMessage
//     });
//
//   } catch (error) {
//     console.error('处理请求时出错:', error);
//     res.status(500).json({
//       error: '处理请求失败',
//       details: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// });
//
// // 健康检查端点
// app.get('/health', (req, res) => {
//   res.json({
//     status: 'ok',
//     timestamp: new Date().toISOString(),
//     mode: 'single-conversation'
//   });
// });
//
// // 通用错误处理中间件
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
//   console.log(`塔罗占卜API服务器运行在 http://localhost:${PORT}`);
//   console.log('模式：单次对话，忽略指示牌');
//   console.log('健康检查: http://localhost:' + PORT + '/health');
//   console.log('等待占卜请求...');
// });
//
//



// 增强的系统提示词
// const systemPrompt = `[身份与目标]
// 你是一名精通塔罗/雷诺曼/易经的资深占卜师，掌握"象法"解读技巧。你要通过牌面符号（人物、动作、物件、环境、颜色、数字、方向等）来推演事件，并给出符合常理的结论与可执行建议。
//
// [象法运用步骤]
// 1. 定位：在牌面中找出最能对应所问事情的符号。
// 2. 读象：分析符号的状态、动作或特征，并解释它在现实语境中的可能含义。
// 3. 取舍：忽略冗余或泛化的元素，专注于与问题最贴切的核心象。
// 4. 串联：把各张牌的符号串联成一个故事或过程，描绘事情的发展脉络。
// 5. 结论：给出简明结果，包含事件走向+可能的细节+1–3条可行行动建议。
//
// [象征元素解读指南]
// - characters（人物）：代表事件中的关键角色或当事人的状态
// - props（道具）：象征具体的工具、资源或影响因素
// - environment（环境）：反映事件发生的背景或外在条件
// - time_hint（时间提示）：指示事件的时间节点或发展阶段
// - direction（方向）：暗示事件的动向或能量流动
// - actions（行动）：描述正在发生或即将发生的具体动作
// - story_hint（故事提示）：提供整体情境的核心线索
// - branches（分支建议）：基于当前象征给出的可能行动方向
//
// [输出格式]
// 首部：问题+背景+抽牌列表
// 主体：逐张牌的象征解读 → 象法串联 → 结论
// 风格：直观、形象，注重细节（动作/物象），避免过度抽象或心理化解读
// 结论：用"倾向/较可能/建议"表达，优先采用牌面提供的分支建议
//
// [特别注意]
// - 你必须基于提供的象征元素（symbols、actions、story_hint）来推断，而不是只依赖传统牌义。
// - 解释要能落地到现实事件（如：出行、健康、沟通、变化）。
// - 遇到自然现象类问题（天气/身体/环境），结论需符合常理。
// - 充分利用branches字段中的建议，将其融入到最终的行动指导中。`;


// const systemPrompt = `[身份与目标]
// [身份设定]
// 你是一名精通塔罗、雷诺曼和易经的资深占卜师，擅长运用“象法”解析牌面或卦象。你的目标是将牌面象征（人物、动作、道具、环境、颜色、数字、方向等）转化为现实事件发展脉络，并提供可执行的建议。
//
// [象法运用步骤]
// 1. **定位（抓象）**：在每张牌或卦象中找到最能对应所问事件的符号。
// 2. **读象（解象）**：分析符号的状态、动作、特征，推演其现实意义。
// 3. **取舍（去杂）**：忽略冗余或泛化的元素，专注与问题最贴切的核心象。
// 4. **串联（讲故事）**：将各张牌或卦象的核心象串联成事件发展脉络，形成完整故事。
// 5. **结论与行动**：给出事件倾向、较可能结果，以及1-3条具体可执行的现实行动建议。
//
// [象征元素解读指南]
// - **characters（人物）**：事件中的关键角色及其状态
// - **props（道具）**：事件涉及的工具、资源或影响因素
// - **environment（环境）**：事件发生背景或外在条件
// - **time_hint（时间提示）**：事件时间节点或发展阶段
// - **direction（方向）**：事件动向或能量流
// - **actions（行动）**：正在发生或即将发生的具体动作
// - **story_hint（故事提示）**：整体情境核心线索
// - **branches（分支建议）**：可行的行动方向
//
// [输出要求]
// 1. **首部**：问题描述 + 牌阵/卦象列表 + 牌阵说明
// 2. **主体**：
//    - 逐张牌或卦象的象征解读
//    - 串联成完整事件脉络（故事化描述，强调动作、环境、符号）
// 3. **结论**：
//    - 事件倾向
//    - 较可能结果
//    - 1-3条现实可执行的行动建议
// 4. **风格**：
//    - 直观、形象
//    - 注重动作与物象
//    - 避免心理化或过度抽象
//
// [注意事项]
// - 解释必须严格基于提供的象征元素，不依赖传统牌义。
// - 解读应落地到现实事件，符合常理（如出行、健康、职务、天气等）。
// - 尽量使用牌面/卦象动作、方向、环境的具体信息，形成连贯故事。
// - 分支建议应融入行动指导中，使占卜结果可操作。`;
//
// app.post('/', async (req, res) => {
//   console.log('收到占卜请求');
//
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
//       return res.status(400).json({ error: 'pms 字段是必需的且必须是数组' });
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
//       return res.status(400).json({ error: '没有找到牌阵牌' });
//     }
//
//     // 验证每张牌是否包含cardAnalysis数据
//     const missingAnalysis = spreadCards.filter(card => !card.cardAnalysis);
//     if (missingAnalysis.length > 0) {
//       console.warn('部分牌缺少象征分析数据:', missingAnalysis.map(card => card.name));
//       return res.status(400).json({
//         error: '部分牌缺少象征分析数据',
//         missingCards: missingAnalysis.map(card => card.name)
//       });
//     }
//
//     // 构建用户消息 - 包含象征分析数据
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
// 【牌阵布局与象征分析】（共${spreadCards.length}张牌）
// ${spreadCards.map((card, index) => {
//       const positionName = spread?.positions?.[index] || `第${index + 1}位`;
//       const analysis = card.cardAnalysis;
//
//       return `${positionName}：${card.name}${card.isReversed ? '（逆位）' : '（正位）'}
//
// 象征元素：
// - 人物：${analysis.symbols.characters.join('、')}
// - 道具：${analysis.symbols.props.join('、')}
// - 环境：${analysis.symbols.environment.join('、')}
// - 时间提示：${analysis.symbols.time_hint}
// - 方向：${analysis.symbols.direction}
//
// 关键行动：${analysis.actions.join('、')}
// 故事线索：${analysis.story_hint}
// 建议分支：${analysis.branches.join('、')}`;
//     }).join('\n\n')}
//
// 请严格基于上述象征元素进行解析，运用象法技巧，将各牌的符号串联成完整的事件发展脉络，并结合建议分支给出具体可行的行动指导。`;
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
//     // ===== 重要：打印传给AI的完整信息 =====
//     console.log('\n\n==================== 传给AI的完整信息 ====================');
//     console.log('【系统提示词】');
//     console.log(systemPrompt);
//     console.log('\n【用户消息】');
//     console.log(userMessage);
//     console.log('\n【完整消息数组】');
//     console.log(JSON.stringify(messages, null, 2));
//     console.log('========================================================\n\n');
//
//     // 智谱 API 请求
//     const apiRequestBody = {
//       "model": "glm-4.5-flash",
//       "messages": messages,
//       "temperature": 0.6,
//       "max_tokens": 9000
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
//     // 直接返回结果，不保存会话历史
//     res.json({
//       content: assistantMessage
//     });
//
//   } catch (error) {
//     console.error('处理请求时出错:', error);
//     res.status(500).json({
//       error: '处理请求失败',
//       details: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// });
//
// // 健康检查端点
// app.get('/health', (req, res) => {
//   res.json({
//     status: 'ok',
//     timestamp: new Date().toISOString(),
//     mode: 'single-conversation-with-analysis'
//   });
// });
//
// // 通用错误处理中间件
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
//   console.log(`塔罗占卜API服务器运行在 http://localhost:${PORT}`);
//   console.log('模式：单次对话，支持象征分析数据');
//   console.log('健康检查: http://localhost:' + PORT + '/health');
//   console.log('等待占卜请求...');
// });

//
//
// import express from 'express'
// import cors from 'cors'
//
// const app = express()
//
// // 中间件配置
// app.use(cors())
// app.use(express.json({ limit: '10mb' }))
// app.use(express.urlencoded({ extended: true }))
//
// // 添加请求日志中间件（用于调试）
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//   next();
// });
//
// const systemPrompt = `## **[身份与目标]**
//
// 你是一名经验丰富的资深占卜师，精通塔罗、雷诺曼、易经64卦、小六壬等图像符号占卜体系，并掌握“象法”解读技巧。
// 你的任务是通过牌面符号（**卦象脉络 story_hint**、**卦象动态 actions**、**卦中人象 characters**、**卦中物象 props**、**卦象场域 environment**、**五行生克 element_relations** 等）结合**牌阵结构和每个位置的功能**，推演事件发展脉络，并生成客观、明确的占卜问题答案。
// `;
//
//
// app.post('/', async (req, res) => {
//   console.log('收到占卜请求');
//
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
//       return res.status(400).json({ error: 'pms 字段是必需的且必须是数组' });
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
//       return res.status(400).json({ error: '没有找到牌阵牌' });
//     }
//
//     // 验证每张牌是否包含cardAnalysis数据
//     const missingAnalysis = spreadCards.filter(card => !card.cardAnalysis);
//     if (missingAnalysis.length > 0) {
//       console.warn('部分牌缺少象征分析数据:', missingAnalysis.map(card => card.name));
//       return res.status(400).json({
//         error: '部分牌缺少象征分析数据',
//         missingCards: missingAnalysis.map(card => card.name)
//       });
//     }
//
//     // 验证每张牌是否包含 possible_real_world_mapping 字段
//     const missingMapping = spreadCards.filter(card =>
//       !card.cardAnalysis.possible_real_world_mapping
//     );
//     if (missingMapping.length > 0) {
//       console.warn('部分牌缺少现实映射数据:', missingMapping.map(card => card.name));
//       return res.status(400).json({
//         error: '部分牌缺少现实映射数据',
//         missingCards: missingMapping.map(card => card.name)
//       });
//     }
//
//     // 检查是否有五行数据
//     const hasElementRelations = spreadCards.some(card => card.cardAnalysis.element_relations);
//     console.log('是否包含五行数据:', hasElementRelations);
//
//     // 构建用户消息 - 包含象征分析数据
// //     const userMessage = `【占卜问题】
// // ${text || '请为我进行塔罗占卜'}
// //
// // 【使用牌组】
// // ${deck?.name || '标准塔罗牌'}
// //
// // 【牌阵信息】
// // 牌阵名称：${spread?.name || '标准牌阵'}
// // 牌阵说明：${spread?.desc || ''}
// //
// // 【牌阵布局与象征分析】（共${spreadCards.length}张牌）
// // ${spreadCards.map((card, index) => {
// //       const positionName = spread?.positions?.[index] || `第${index + 1}位`;
// //       const analysis = card.cardAnalysis;
// //
// //       let cardInfo = `${positionName}：${card.name}${card.isReversed ? '（逆位）' : '（正位）'}
// //
// // 象征元素：
// // - 人物：${analysis.symbols.characters.join('、')}
// // - 道具：${analysis.symbols.props.join('、')}
// // - 环境：${analysis.symbols.environment.join('、')}
// // - 时间提示：${analysis.symbols.time_hint}
// // - 方向：${analysis.symbols.direction}
// //
// // 关键行动：${analysis.actions.join('、')}
// // 故事线索：${analysis.story_hint}
// // 建议分支：${analysis.branches.join('、')}
// // 现实映射：${analysis.possible_real_world_mapping}`;
// //
// //       // 如果有五行关系数据，则添加到分析中
// //       if (analysis.element_relations) {
// //         cardInfo += `
// // 五行属性：${analysis.element_relations.element}
// // - 生成：${analysis.element_relations.generates.join('、')}
// // - 克制：${analysis.element_relations.overcomes.join('、')}
// // - 被生：${analysis.element_relations.generated_by.join('、')}
// // - 被克：${analysis.element_relations.overcome_by.join('、')}`;
// //       }
// //
// //       return cardInfo;
// //     }).join('\n\n')}`;
//     const safeJoin = (value, separator = '、') => {
//       if (Array.isArray(value)) return value.join(separator);
//       if (value == null) return '';
//       return String(value);
//     };
//
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
// 【牌阵布局与象征分析】（共${spreadCards.length}张牌）
// ${spreadCards.map((card, index) => {
//       const positionName = spread?.positions?.[index] || `第${index + 1}位`;
//       const analysis = card.cardAnalysis || {};
//
//       let cardInfo = `${positionName}：${card.name}${card.isReversed ? '（逆位）' : '（正位）'}
//
// 象征元素：
// - 卦中人象：${safeJoin(analysis.symbols?.characters)}
// - 卦中物象：${safeJoin(analysis.symbols?.props)}
// - 卦象场域：${safeJoin(analysis.symbols?.environment)}
// - 时机节点：${analysis.symbols?.time_hint || ''}
// - 气运走向：${analysis.symbols?.direction || ''}
//
// 卦象动态：${safeJoin(analysis.actions)}
// 卦象脉络：${analysis.story_hint || ''}
// 择机抉择：${safeJoin(analysis.branches)}
// 应世对照：${analysis.possible_real_world_mapping || ''}`;
//
//       // 如果有五行关系数据，则添加到分析中
//       if (analysis.element_relations) {
//         cardInfo += `
// 五行生克：${analysis.element_relations.element || ''}
// - 生成：${safeJoin(analysis.element_relations.generates)}
// - 克制：${safeJoin(analysis.element_relations.overcomes)}
// - 被生：${safeJoin(analysis.element_relations.generated_by)}
// - 被克：${safeJoin(analysis.element_relations.overcome_by)}`;
//       }
//
//       return cardInfo;
//     }).join('\n\n')}`;
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
//     // ===== 重要：打印传给AI的完整信息 =====
//     console.log('\n\n==================== 传给AI的完整信息 ====================');
//     console.log('【系统提示词】');
//     console.log(systemPrompt);
//     console.log('\n【用户消息】');
//     console.log(userMessage);
//
//     // 打印数据统计信息
//     console.log('\n【数据统计】');
//     console.log('牌阵牌数量:', spreadCards.length);
//     console.log('包含五行数据的牌:', spreadCards.filter(card => card.cardAnalysis.element_relations).length);
//     console.log('五行元素分布:', spreadCards
//       .filter(card => card.cardAnalysis.element_relations)
//       .map(card => `${card.name}(${card.cardAnalysis.element_relations.element})`)
//       .join(', ') || '无');
//
//     console.log('\n【完整消息数组】');
//     console.log(JSON.stringify(messages, null, 2));
//     console.log('========================================================\n\n');
//
//     // 智谱 API 请求
//     const apiRequestBody = {
//       "model": "glm-4-flash",
//       "messages": messages,
//       "temperature": 0.6,
//       "max_tokens": 5000
//     };
//
//     console.log('=== API请求体信息 ===');
//     console.log('模型:', apiRequestBody.model);
//     console.log('温度:', apiRequestBody.temperature);
//     console.log('最大token:', apiRequestBody.max_tokens);
//     console.log('消息数量:', apiRequestBody.messages.length);
//     console.log('是否包含五行分析:', hasElementRelations);
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
//     // 直接返回结果，不保存会话历史
//     res.json({
//       content: assistantMessage
//     });
//
//   } catch (error) {
//     console.error('处理请求时出错:', error);
//     res.status(500).json({
//       error: '处理请求失败',
//       details: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// });
//
// // 健康检查端点
// app.get('/health', (req, res) => {
//   res.json({
//     status: 'ok',
//     timestamp: new Date().toISOString(),
//     mode: 'single-conversation-with-analysis-and-elements'
//   });
// });
//
// // 通用错误处理中间件
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
//   console.log(`塔罗占卜API服务器运行在 http://localhost:${PORT}`);
//   console.log('模式：单次对话，支持象征分析数据和五行理论');
//   console.log('健康检查: http://localhost:' + PORT + '/health');
//   console.log('等待占卜请求...');
// });
//
// import express from 'express'
// import cors from 'cors'
//
// const app = express()
//
// // 中间件配置
// app.use(cors())
// app.use(express.json({ limit: '10mb' }))
// app.use(express.urlencoded({ extended: true }))
//
// // 添加请求日志中间件（用于调试）
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//   next();
// });
//
// const systemPrompt = `## **[身份与目标]**
//
// 你是一名经验丰富的资深占卜师，精通塔罗、雷诺曼、易经64卦、小六壬等图像符号占卜体系，并掌握"象法"解读技巧。
// 你的任务是通过牌面符号（**卦象脉络 story_hint**、**卦象动态 actions**、**卦中人象 characters**、**卦中物象 props**、**卦象场域 environment**、**五行生克 element_relations** 等）结合**牌阵结构和每个位置的功能**，推演事件发展脉络，并生成客观、明确的占卜问题答案。
// `;
//
//
//
// app.post('/', async (req, res) => {
//   console.log('收到占卜请求');
// //
// //   if (!req.body) {
// //     console.error('请求体为空');
// //     return res.status(400).json({ error: '请求体为空' });
// //   }
// //
// //   try {
// //     const { text, pms, spread, deck } = req.body;
// //
// //     // 验证必要字段
// //     if (!pms || !Array.isArray(pms)) {
// //       return res.status(400).json({ error: 'pms 字段是必需的且必须是数组' });
// //     }
// //
// //     // 只取牌阵牌，完全忽略指示牌
// //     const spreadCards = pms.filter(card => card.type === 'spread');
// //
// //     console.log('=== 处理数据 ===');
// //     console.log('总牌数:', pms.length);
// //     console.log('牌阵牌数量:', spreadCards.length);
// //     console.log('牌阵信息:', spread?.name);
// //
// //     // 如果没有牌阵牌，返回错误
// //     if (spreadCards.length === 0) {
// //       return res.status(400).json({ error: '没有找到牌阵牌' });
// //     }
// //
// //     // 验证每张牌是否包含cardAnalysis数据
// //     const missingAnalysis = spreadCards.filter(card => !card.cardAnalysis);
// //     if (missingAnalysis.length > 0) {
// //       console.warn('部分牌缺少象征分析数据:', missingAnalysis.map(card => card.name));
// //       return res.status(400).json({
// //         error: '部分牌缺少象征分析数据',
// //         missingCards: missingAnalysis.map(card => card.name)
// //       });
// //     }
// //
// //     // 验证每张牌是否包含 possible_real_world_mapping 字段
// //     const missingMapping = spreadCards.filter(card =>
// //       !card.cardAnalysis.possible_real_world_mapping
// //     );
// //     if (missingMapping.length > 0) {
// //       console.warn('部分牌缺少现实映射数据:', missingMapping.map(card => card.name));
// //       return res.status(400).json({
// //         error: '部分牌缺少现实映射数据',
// //         missingCards: missingMapping.map(card => card.name)
// //       });
// //     }
// //
// //     // 检查是否有五行数据
// //     const hasElementRelations = spreadCards.some(card => card.cardAnalysis.element_relations);
// //     console.log('是否包含五行数据:', hasElementRelations);
// //
// //     const safeJoin = (value, separator = '、') => {
// //       if (Array.isArray(value)) return value.join(separator);
// //       if (value == null) return '';
// //       return String(value);
// //     };
// //
// //     const userMessage = `【占卜问题】
// // ${text || '请为我进行塔罗占卜'}
// //
// // 【使用牌组】
// // ${deck?.name || '标准塔罗牌'}
// //
// // 【牌阵信息】
// // 牌阵名称：${spread?.name || '标准牌阵'}
// // 牌阵说明：${spread?.desc || ''}
// //
// // 【牌阵布局与象征分析】（共${spreadCards.length}张牌）
// // ${spreadCards.map((card, index) => {
// //       const positionName = spread?.positions?.[index] || `第${index + 1}位`;
// //       const analysis = card.cardAnalysis || {};
// //
// //       let cardInfo = `${positionName}：${card.name}${card.isReversed ? '（逆位）' : '（正位）'}
// //
// // 象征元素：
// // - 卦中人象：${safeJoin(analysis.symbols?.characters)}
// // - 卦中物象：${safeJoin(analysis.symbols?.props)}
// // - 卦象场域：${safeJoin(analysis.symbols?.environment)}
// // - 时机节点：${analysis.symbols?.time_hint || ''}
// // - 气运走向：${analysis.symbols?.direction || ''}
// //
// // 卦象动态：${safeJoin(analysis.actions)}
// // 卦象脉络：${analysis.story_hint || ''}
// // 择机抉择：${safeJoin(analysis.branches)}
// // 应世对照：${analysis.possible_real_world_mapping || ''}`;
// //
// //       // 如果有五行关系数据，则添加到分析中
// //       if (analysis.element_relations) {
// //         cardInfo += `
// // 五行生克：${analysis.element_relations.element || ''}
// // - 生成：${safeJoin(analysis.element_relations.generates)}
// // - 克制：${safeJoin(analysis.element_relations.overcomes)}
// // - 被生：${safeJoin(analysis.element_relations.generated_by)}
// // - 被克：${safeJoin(analysis.element_relations.overcome_by)}`;
// //       }
// //
// //       return cardInfo;
// //     }).join('\n\n')}`;
// //
// //
// //
// //     const messages = [
// //       {
// //         "role": "system",
// //         "content": systemPrompt
// //       },
// //       {
// //         "role": "user",
// //         "content": JSON.stringify(userMessage, null, 2) // 将JSON对象转为格式化字符串
// //       }
// //     ];
// //
// //
// //
// //
// //     // ===== 重要：打印传给AI的完整信息 =====
// //     console.log('\n\n==================== 传给AI的完整信息 ====================');
// //     console.log('【系统提示词】');
// //     console.log(systemPrompt);
// //     console.log('\n【用户消息】');
// //     console.log(userMessage);
// //
// //     // 打印数据统计信息
// //     console.log('\n【数据统计】');
// //     console.log('牌阵牌数量:', spreadCards.length);
// //     console.log('包含五行数据的牌:', spreadCards.filter(card => card.cardAnalysis.element_relations).length);
// //     console.log('五行元素分布:', spreadCards
// //       .filter(card => card.cardAnalysis.element_relations)
// //       .map(card => `${card.name}(${card.cardAnalysis.element_relations.element})`)
// //       .join(', ') || '无');
// //
// //     console.log('\n【完整消息数组】');
// //     console.log(JSON.stringify(messages, null, 2));
// //     console.log('========================================================\n\n');
// //
// //     // 云雾 API 请求
// //     const apiRequestBody = {
// //       "model": "glm-4.5",  // 云雾支持的模型
// //       "messages": messages,
// //       "temperature": 0.6,
// //       "max_tokens": 5000,
// //       "stream": false  // 非流式响应
// //     };
// //
// //     console.log('=== API请求体信息 ===');
// //     console.log('模型:', apiRequestBody.model);
// //     console.log('温度:', apiRequestBody.temperature);
// //     console.log('最大token:', apiRequestBody.max_tokens);
// //     console.log('消息数量:', apiRequestBody.messages.length);
// //     console.log('是否包含五行分析:', hasElementRelations);
// //
// //     console.log('正在调用云雾 API（单次对话）...');
// //
// //     // 调用云雾API
// //     const response = await fetch("https://api.wlai.vip/v1/chat/completions", {
// //       "method": "POST",
// //       "headers": {
// //         "Authorization": `Bearer sk-I2k4ljIyMKeL5Yt04CXJ8eeKy8Qlk9RXqcPTFmltdogYmNpd`,
// //         // "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
// //         "Content-Type": "application/json"
// //       },
// //       "body": JSON.stringify(apiRequestBody)
// //     });
// //
// //
// //     if (!response.ok) {
// //       const errorText = await response.text();
// //       console.error('云雾 API 错误响应:', errorText);
// //       throw new Error(`云雾 API 错误! status: ${response.status}, response: ${errorText}`);
// //     }
// //
// //     const data = await response.json();
// //     console.log('云雾 API 调用成功');
// //
// //     // 打印API返回的原始数据
// //     console.log('\n=== API返回的原始数据 ===');
// //     console.log(JSON.stringify(data, null, 2));
// //
// //     if (!data.choices || !data.choices[0] || !data.choices[0].message) {
// //       throw new Error('云雾 API 响应格式异常');
// //     }
// //
// //     const assistantMessage = data.choices[0].message.content;
// //
// //     // 打印AI的回复内容
// //     console.log('\n=== AI回复内容 ===');
// //     console.log(assistantMessage);
// //     console.log('=====================\n');
// //
// //     // 直接返回结果，不保存会话历史
// //     res.json({
// //       content: assistantMessage
// //     });
// //
// //   } catch (error) {
// //     console.error('处理请求时出错:', error);
// //     res.status(500).json({
// //       error: '处理请求失败',
// //       details: error.message,
// //       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
// //     });
// //   }
// // });
//
//
//   // 新增：AI分析专用端点
//   app.post('/ai-analysis', async (req, res) => {
//     console.log('收到AI分析请求');
//     if (!req.body) {
//       console.error('请求体为空');
//       return res.status(400).json({ error: '请求体为空' });
//     }
//     try {
//       const { text, pms, spread, deck, model } = req.body;
//       // 验证必要字段
//       if (!pms || !Array.isArray(pms)) {
//         return res.status(400).json({ error: 'pms 字段是必需的且必须是数组' });
//       }
//       // 验证模型参数
//       if (!model) {
//         return res.status(400).json({ error: '请选择AI模型' });
//       }
//       // 验证模型是否支持
//       const supportedModels = ['glm-4.5', 'glm-4-flash', 'glm-4-air', 'glm-4-long'];
//       if (!supportedModels.includes(model)) {
//         return res.status(400).json({
//           error: '不支持的模型',
//           supportedModels: supportedModels
//         });
//       }
//       // 只取牌阵牌，完全忽略指示牌
//       const spreadCards = pms.filter(card => card.type === 'spread');
//       console.log('=== AI分析处理数据 ===');
//       console.log('选择的模型:', model);
//       console.log('总牌数:', pms.length);
//       console.log('牌阵牌数量:', spreadCards.length);
//       console.log('牌阵信息:', spread?.name);
//       // 如果没有牌阵牌，返回错误
//       if (spreadCards.length === 0) {
//         return res.status(400).json({ error: '没有找到牌阵牌' });
//       }
//       // 验证每张牌是否包含cardAnalysis数据
//       const missingAnalysis = spreadCards.filter(card => !card.cardAnalysis);
//       if (missingAnalysis.length > 0) {
//         console.warn('部分牌缺少象征分析数据:', missingAnalysis.map(card => card.name));
//         return res.status(400).json({
//           error: '部分牌缺少象征分析数据',
//           missingCards: missingAnalysis.map(card => card.name)
//         });
//       }
//       // 验证每张牌是否包含 possible_real_world_mapping 字段
//       const missingMapping = spreadCards.filter(card =>
//         !card.cardAnalysis.possible_real_world_mapping
//       );
//       if (missingMapping.length > 0) {
//         console.warn('部分牌缺少现实映射数据:', missingMapping.map(card => card.name));
//         return res.status(400).json({
//           error: '部分牌缺少现实映射数据',
//           missingCards: missingMapping.map(card => card.name)
//         });
//       }
//       // 检查是否有五行数据
//       const hasElementRelations = spreadCards.some(card => card.cardAnalysis.element_relations);
//       console.log('是否包含五行数据:', hasElementRelations);
//       const safeJoin = (value, separator = '、') => {
//         if (Array.isArray(value)) return value.join(separator);
//         if (value == null) return '';
//         return String(value);
//       };
//       const userMessage = `【占卜问题】
// ${text || '请为我进行塔罗占卜'}
// 【使用牌组】
// ${deck?.name || '标准塔罗牌'}
// 【牌阵信息】
// 牌阵名称：${spread?.name || '标准牌阵'}
// 牌阵说明：${spread?.desc || ''}
// 【牌阵布局与象征分析】（共${spreadCards.length}张牌）
// ${spreadCards.map((card, index) => {
//         const positionName = spread?.positions?.[index] || `第${index + 1}位`;
//         const analysis = card.cardAnalysis || {};
//         let cardInfo = `${positionName}：${card.name}${card.isReversed ? '（逆位）' : '（正位）'}
// 象征元素：
// - 卦中人象：${safeJoin(analysis.symbols?.characters)}
// - 卦中物象：${safeJoin(analysis.symbols?.props)}
// - 卦象场域：${safeJoin(analysis.symbols?.environment)}
// - 时机节点：${analysis.symbols?.time_hint || ''}
// - 气运走向：${analysis.symbols?.direction || ''}
// 卦象动态：${safeJoin(analysis.actions)}
// 卦象脉络：${analysis.story_hint || ''}
// 择机抉择：${safeJoin(analysis.branches)}
// 应世对照：${analysis.possible_real_world_mapping || ''}`;
//         // 如果有五行关系数据，则添加到分析中
//         if (analysis.element_relations) {
//           cardInfo += `
// 五行生克：${analysis.element_relations.element || ''}
// - 生成：${safeJoin(analysis.element_relations.generates)}
// - 克制：${safeJoin(analysis.element_relations.overcomes)}
// - 被生：${safeJoin(analysis.element_relations.generated_by)}
// - 被克：${safeJoin(analysis.element_relations.overcome_by)}`;
//         }
//         return cardInfo;
//       }).join('\n\n')}`;
//       const messages = [
//         {
//           "role": "system",
//           "content": systemPrompt
//         },
//         {
//           "role": "user",
//           "content": userMessage
//         }
//       ];
//       // ===== 重要：打印传给AI的完整信息 =====
//       console.log('\n\n==================== AI分析传给API的完整信息 ====================');
//       console.log('【系统提示词】');
//       console.log(systemPrompt);
//       console.log('\n【用户消息】');
//       console.log(userMessage);
//       // 打印数据统计信息
//       console.log('\n【数据统计】');
//       console.log('使用模型:', model);
//       console.log('牌阵牌数量:', spreadCards.length);
//       console.log('包含五行数据的牌:', spreadCards.filter(card => card.cardAnalysis.element_relations).length);
//       console.log('五行元素分布:', spreadCards
//         .filter(card => card.cardAnalysis.element_relations)
//         .map(card => `${card.name}(${card.cardAnalysis.element_relations.element})`)
//         .join(', ') || '无');
//       console.log('\n【完整消息数组】');
//       console.log(JSON.stringify(messages, null, 2));
//       console.log('================================================================\n\n');
//       // 云雾 API 请求
//       const apiRequestBody = {
//         "model": model,  // 使用前端传来的模型参数
//         "messages": messages,
//         "temperature": 0.6,
//         "max_tokens": 5000,
//         "stream": false
//       };
//       console.log('=== AI分析API请求体信息 ===');
//       console.log('模型:', apiRequestBody.model);
//       console.log('温度:', apiRequestBody.temperature);
//       console.log('最大token:', apiRequestBody.max_tokens);
//       console.log('消息数量:', apiRequestBody.messages.length);
//       console.log('是否包含五行分析:', hasElementRelations);
//       console.log(`正在调用云雾 API进行AI分析（模型：${model}）...`);
//       // 调用云雾API
//       const response = await fetch("https://api.wlai.vip/v1/chat/completions", {
//         "method": "POST",
//         "headers": {
//           "Authorization": `Bearer sk-I2k4ljIyMKeL5Yt04CXJ8eeKy8Qlk9RXqcPTFmltdogYmNpd`,
//           "Content-Type": "application/json"
//         },
//         "body": JSON.stringify(apiRequestBody)
//       });
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('云雾 API 错误响应:', errorText);
//         throw new Error(`云雾 API 错误! status: ${response.status}, response: ${errorText}`);
//       }
//       const data = await response.json();
//       console.log('云雾 API AI分析调用成功');
//       // 打印API返回的原始数据
//       console.log('\n=== AI分析API返回的原始数据 ===');
//       console.log(JSON.stringify(data, null, 2));
//       if (!data.choices || !data.choices[0] || !data.choices[0].message) {
//         throw new Error('云雾 API 响应格式异常');
//       }
//       const assistantMessage = data.choices[0].message.content;
//       // 打印AI的回复内容
//       console.log('\n=== AI分析回复内容 ===');
//       console.log(assistantMessage);
//       console.log('=========================\n');
//       // 返回AI分析结果
//       res.json({
//         content: assistantMessage
//       });
//     } catch (error) {
//       console.error('AI分析处理请求时出错:', error);
//       res.status(500).json({
//         error: 'AI分析处理失败',
//         details: error.message,
//         stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       });
//     }
//   });
//
// // // 健康检查端点
// // app.get('/health', (req, res) => {
// //   res.json({
// //     status: 'ok',
// //     timestamp: new Date().toISOString(),
// //     mode: 'single-conversation-with-analysis-and-elements'
// //   });
// // });
//   // 健康检查端点
//   app.get('/health', (req, res) => {
//     res.json({
//       status: 'ok',
//       timestamp: new Date().toISOString(),
//       mode: 'separated-analysis-with-model-selection', // 更新描述
//       endpoints: {
//         divination: '/ (生成卡牌结果)',
//         aiAnalysis: '/ai-analysis (AI分析)',
//         models: '/models (获取模型列表)'
//       }
//     });
//   });
//
//
// // 通用错误处理中间件
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
//   console.log(`塔罗占卜API服务器运行在 http://localhost:${PORT}`);
//   console.log('模式：单次对话，支持象征分析数据和五行理论');
//   console.log('健康检查: http://localhost:' + PORT + '/health');
//   console.log('等待占卜请求...');
// });



import express from 'express'
import cors from 'cors'

const app = express()

// 中间件配置
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// 添加请求日志中间件（用于调试）
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const systemPrompt = `## **[身份与目标]**

你是一名经验丰富的资深占卜师，精通塔罗、雷诺曼、易经64卦、小六壬等图像符号占卜体系，并掌握"象法"解读技巧。
你的任务是通过牌面符号（**卦象脉络 story_hint**、**卦象动态 actions**、**卦中人象 characters**、**卦中物象 props**、**卦象场域 environment**、**五行生克 element_relations** 等）结合**牌阵结构和每个位置的功能**，推演事件发展脉络，并生成客观、明确的占卜问题答案。
`;

// 原有的占卜端点（现在只用于生成卡牌结果，不进行AI分析）
app.post('/', async (req, res) => {
  console.log('收到占卜请求');

  if (!req.body) {
    console.error('请求体为空');
    return res.status(400).json({ error: '请求体为空' });
  }

  try {
    const { text, pms, spread, deck } = req.body;

    // 验证必要字段
    if (!pms || !Array.isArray(pms)) {
      return res.status(400).json({ error: 'pms 字段是必需的且必须是数组' });
    }

    // 只取牌阵牌，完全忽略指示牌
    const spreadCards = pms.filter(card => card.type === 'spread');

    console.log('=== 处理数据 ===');
    console.log('总牌数:', pms.length);
    console.log('牌阵牌数量:', spreadCards.length);
    console.log('牌阵信息:', spread?.name);

    // 如果没有牌阵牌，返回错误
    if (spreadCards.length === 0) {
      return res.status(400).json({ error: '没有找到牌阵牌' });
    }

    // 验证每张牌是否包含cardAnalysis数据
    const missingAnalysis = spreadCards.filter(card => !card.cardAnalysis);
    if (missingAnalysis.length > 0) {
      console.warn('部分牌缺少象征分析数据:', missingAnalysis.map(card => card.name));
      return res.status(400).json({
        error: '部分牌缺少象征分析数据',
        missingCards: missingAnalysis.map(card => card.name)
      });
    }

    // 验证每张牌是否包含 possible_real_world_mapping 字段
    const missingMapping = spreadCards.filter(card =>
      !card.cardAnalysis.possible_real_world_mapping
    );
    if (missingMapping.length > 0) {
      console.warn('部分牌缺少现实映射数据:', missingMapping.map(card => card.name));
      return res.status(400).json({
        error: '部分牌缺少现实映射数据',
        missingCards: missingMapping.map(card => card.name)
      });
    }

    // 检查是否有五行数据
    const hasElementRelations = spreadCards.some(card => card.cardAnalysis.element_relations);
    console.log('是否包含五行数据:', hasElementRelations);

    // 这个端点现在只返回成功状态，不进行AI分析
    res.json({
      success: true,
      message: '卡牌数据验证成功，请选择AI模型进行分析',
      cardCount: spreadCards.length,
      hasElementRelations: hasElementRelations
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

// 新增：AI分析专用端点
app.post('/ai-analysis', async (req, res) => {
  console.log('收到AI分析请求');

  if (!req.body) {
    console.error('请求体为空');
    return res.status(400).json({ error: '请求体为空' });
  }

  try {
    const { text, pms, spread, deck, model } = req.body;

    // 验证必要字段
    if (!pms || !Array.isArray(pms)) {
      return res.status(400).json({ error: 'pms 字段是必需的且必须是数组' });
    }

    // 验证模型参数
    if (!model) {
      return res.status(400).json({ error: '请选择AI模型' });
    }

    // 验证模型是否支持
    // const supportedModels = ['glm-4.5', 'glm-4-flash', 'glm-4-air', 'glm-4-long'];
    // 在 /ai-analysis 端点中，更新支持的模型列表
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
      'qwen-plus',
      'claude-sonnet-4-20250514-thinking'
    ];

    if (!supportedModels.includes(model)) {
      return res.status(400).json({
        error: '不支持的模型',
        supportedModels: supportedModels
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
      return res.status(400).json({ error: '没有找到牌阵牌' });
    }

    // 验证每张牌是否包含cardAnalysis数据
    const missingAnalysis = spreadCards.filter(card => !card.cardAnalysis);
    if (missingAnalysis.length > 0) {
      console.warn('部分牌缺少象征分析数据:', missingAnalysis.map(card => card.name));
      return res.status(400).json({
        error: '部分牌缺少象征分析数据',
        missingCards: missingAnalysis.map(card => card.name)
      });
    }

    // 验证每张牌是否包含 possible_real_world_mapping 字段
    const missingMapping = spreadCards.filter(card =>
      !card.cardAnalysis.possible_real_world_mapping
    );
    if (missingMapping.length > 0) {
      console.warn('部分牌缺少现实映射数据:', missingMapping.map(card => card.name));
      return res.status(400).json({
        error: '部分牌缺少现实映射数据',
        missingCards: missingMapping.map(card => card.name)
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
        "Authorization": `Bearer sk-I2k4ljIyMKeL5Yt04CXJ8eeKy8Qlk9RXqcPTFmltdogYmNpd`,
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
    res.json({
      content: assistantMessage
    });

  } catch (error) {
    console.error('AI分析处理请求时出错:', error);
    res.status(500).json({
      error: 'AI分析处理失败',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// 新增：获取支持的模型列表的端点
// app.get('/models', (req, res) => {
//   res.json({
//     models: [
//       {
//         key: 'glm-4.5',
//         name: 'GLM-4.5',
//         description: '智谱最新模型，理解能力强，适合复杂占卜分析',
//         speed: '中等速度',
//         accuracy: '高准确度',
//         tier: 'premium',
//         tierLabel: '推荐'
//       },
//       {
//         key: 'glm-4-flash',
//         name: 'GLM-4 Flash',
//         description: '快速响应模型，适合简单占卜问题',
//         speed: '极速响应',
//         accuracy: '标准准确度',
//         tier: 'standard',
//         tierLabel: '快速'
//       },
//       {
//         key: 'glm-4-air',
//         name: 'GLM-4 Air',
//         description: '轻量级模型，平衡速度与质量',
//         speed: '快速响应',
//         accuracy: '良好准确度',
//         tier: 'standard',
//         tierLabel: '平衡'
//       },
//       {
//         key: 'glm-4-long',
//         name: 'GLM-4 Long',
//         description: '长文本处理专家，适合详细占卜解析',
//         speed: '较慢速度',
//         accuracy: '极高准确度',
//         tier: 'premium',
//         tierLabel: '详细'
//       }
//     ]
//   });
// });
// 新增：获取支持的模型列表的端点
app.get('/models', (req, res) => {
  res.json({
    models: [
      {
        key: 'glm-4.5-flash',
        name: 'GLM-4.5 Flash',
        description: '智谱超快响应模型，速度与质量并重'
      },
      {
        key: 'gpt-5-2025-08-07',
        name: 'GPT-5',
        description: 'OpenAI最新旗舰模型，理解能力卓越'
      },
      {
        key: 'o3',
        name: 'O3',
        description: 'OpenAI推理专家模型，逻辑分析强'
      },
      {
        key: 'claude-3-7-sonnet-20250219-thinking',
        name: 'Claude-3.7 Sonnet',
        description: 'Anthropic思维链模型，深度推理'
      },
      {
        key: 'gemini-2.5-flash',
        name: 'Gemini-2.5 Flash',
        description: 'Google快速多模态模型'
      },
      {
        key: 'gemini-2.5-pro',
        name: 'Gemini-2.5 Pro',
        description: 'Google专业级多模态模型'
      },
      {
        key: 'grok-4',
        name: 'Grok-4',
        description: 'xAI最新模型，创新思维强'
      },
      {
        key: 'grok-3-deepsearch',
        name: 'Grok-3 DeepSearch',
        description: 'xAI深度搜索增强模型'
      },
      {
        key: 'qwen3-235b-a22b',
        name: 'Qwen3-235B',
        description: '阿里通义千问超大参数模型'
      },
      {
        key: 'qwen3-235b-a22b-think',
        name: 'Qwen3-235B Think',
        description: '阿里通义千问思维链版本'
      },
      {
        key: 'deepseek-r1',
        name: 'DeepSeek-R1',
        description: 'DeepSeek推理专用模型'
      },
      {
        key: 'deepseek-v3',
        name: 'DeepSeek-V3',
        description: 'DeepSeek第三代通用模型'
      },
      {
        key: 'doubao-1.5-pro-256k',
        name: 'Doubao-1.5 Pro',
        description: '字节豆包长文本处理模型'
      },
      {
        key: 'glm-4.5',
        name: 'GLM-4.5',
        description: '智谱标准版模型，平衡性能'
      },
      {
        key: 'hunyuan-standard-256K',
        name: 'Hunyuan Standard',
        description: '腾讯混元标准版长文本模型'
      },
      {
        key: 'kimi-k2-250711',
        name: 'Kimi-K2',
        description: 'Moonshot超长上下文模型'
      },
      {
        key: 'gpt-4.1-nano-2025-04-14',
        name: 'GPT-4.1 Nano',
        description: 'OpenAI轻量级模型，快速响应 ',
      },
      {
        key: 'claude-3-haiku-20240307',
        name: 'Claude-3 Haiku',
        description: 'Anthropic快速模型，简洁高效',
      },
      {
        key: 'gemini-2.0-flash',
        name: 'Gemini-2.0 Flash',
        description: 'Google新一代快速模型',
      },
      {
        key: 'qwen-plus',
        name: 'qwen-plus',
        description: '阿里通义千问加速版',
      },
      {
        key: 'claude-sonnet-4-20250514-thinking',
        name: 'claude-sonnet-4-thinking',
        description: 'Anthropic旗舰思维链模型，深度推理',
      }

    ]
  });
});


// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mode: 'separated-analysis-with-model-selection',
    endpoints: {
      divination: '/ (生成卡牌结果)',
      aiAnalysis: '/ai-analysis (AI分析)',
      models: '/models (获取模型列表)'
    }
  });
});

// 通用错误处理中间件
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
  console.log(`塔罗占卜API服务器运行在 http://localhost:${PORT}`);
  console.log('模式：分离式分析，支持模型选择');
  console.log('健康检查: http://localhost:' + PORT + '/health');
  console.log('等待占卜请求...');
});
