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
//     // 只取牌阵牌，忽略指示牌
//     const spreadCards = pms.filter(card => card.type === 'spread');
//
//     console.log('=== 处理数据 ===');
//     console.log('总牌数:', pms.length);
//     console.log('牌阵牌数量:', spreadCards.length);
//     console.log('牌阵信息:', spread?.name);
//
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
//     const systemPrompt =`你是塔罗师`;
//     // 构建用户消息
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
//     // 构建请求体 —— 改成第二段 API 格式
//     const apiRequestBody = {
//       "messages": [
//         { "role": "system", "content": systemPrompt },
//         { "role": "user", "content": userMessage }
//       ],
//       "stream": false,
//       "model": "glm-4-flash",
//       "temperature": 0,
//       "presence_penalty": 0,
//       "frequency_penalty": 0,
//       "top_p": 1
//     };
//
//     console.log('=== API请求体信息 ===');
//     console.log(JSON.stringify(apiRequestBody, null, 2));
//
//     console.log('正在调用 NAS API（单次对话）...');
//
//     const response = await fetch("https://nas-ai.4ce.cn/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "authorization": "Bearer sk-L8W2WtnCtdwG6nctF975D0E770144dE5Be3123Fa16720a03",
//         "content-type": "application/json"
//       },
//       body: JSON.stringify(apiRequestBody)
//     });
//
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('NAS API 错误响应:', errorText);
//       throw new Error(`NAS API 错误! status: ${response.status}, response: ${errorText}`);
//     }
//
//     const data = await response.json();
//     console.log('NAS API 调用成功');
//
//     if (!data.choices || !data.choices[0] || !data.choices[0].message) {
//       throw new Error('NAS API 响应格式异常');
//     }
//
//     const assistantMessage = data.choices[0].message.content;
//
//     console.log('\n=== AI回复内容 ===');
//     console.log(assistantMessage);
//
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
//     // 只取牌阵牌，忽略指示牌
//     const spreadCards = pms.filter(card => card.type === 'spread');
//
//     console.log('=== 处理数据 ===');
//     console.log('总牌数:', pms.length);
//     console.log('牌阵牌数量:', spreadCards.length);
//     console.log('牌阵信息:', spread?.name);
//
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
//     // const systemPrompt = "[身份与目标] 你是资深“象法”占卜师，精通塔罗/雷诺曼/易经等图像符号体系。你的工作方式是：从牌面图像提取符号（人物、动作、物件、环境、颜色、数字、方向等），把这些符号按问题指向筛选并串联成故事，最后给出明确结论与可执行行动。你的输出应详尽、结构化、便于验证。 [总体要求] 1. 必须严格执行 S-C-E-N-E 流程（Symbol → Clue → Essence → Narrative → End）。 2. 每一步都要写清“证据”（即牌名 + 具体画面细节）和“映射理由”（为什么把该象对应到现实的某个要素） 3. 不要输出未过滤的内部推理或链式思维。写“结论 + 支撑证据与推理要点（条列）”。 4. 输出越详细越好：逐牌细读、候选象评分、时间线/阶段划分、分支情形、置信度、可执行行动、对话模板、验证建议等。 5. 同时提供： - 人类可读长格式报告（章节化） - 机器友好 JSON（字段齐全：cards, mapping, clues, core, narrative, conclusion, confidence, actions, followups） [输入假设] - 必须有：占卜主题（问题）、抽牌/卦列表（按位次序，写明牌名与是否逆位）、可选背景信息（求问者性别/关系/时间点等）。 - 如果输入不充分，先列出“必须澄清的问题”并在结尾予以说明。 [细化流程与输出项（每一步要求具体呈现内容）] 1) S — Symbol（定位符号） - 对“每一张牌/卦”输出如下表格式条目： - 序号与牌名（含正/逆位） - 画面关键词（人物／动作／道具／环境／颜色／数字／方向）——尽量列 4–8 项 - 直接映射（对应现实的 Who/What/Where/When/How 中哪一项） - 映射理由（1–2 行）：基于画面元素、文化象征、常见解读等 - 如果该位“没有明显人物”或“只是环境/符号”，写明其作为“情境/背景/触发器”的角色。 2) C — Clue（读象线索） - 针对每张牌列出**明确线索类型**（每项都给出“画面观察 → 含义”）： - 动作/姿态 → 表示行为/倾向 - 面部/表情 → 心理/情绪线索 - 服饰/道具 → 社会角色/资源/意图 - 环境/天气/光线 → 外部条件与氛围 - 数量/位置/朝向 → 时间顺序/主导/次要/方向性 - 局部细节（如受伤、裂痕、光环等） → 风险/疗愈/隐患 - 对每一条线索给出“证据引用”（牌名 + 画面细节）与“含义短句”。 3) E — Essence（提炼核心） - 把所有牌的候选象列成表格，给出**相关性评分（0–10）**（越接近问题的核心分越高）。 - 列出“ Top 1–3 的核心象”和“被舍弃的主要冗余象（及理由）”。 - 如果出现牌义冲突，列出每个冲突点并说明可能的优先规则（例如：靠近结果位权重更高；大阿尔克那优先；宫廷牌指向人物优先等）。 4) N — Narrative（串联成象 / 动态故事） - 以时间线或阶段划分（例如：阶段 A：上午 / 阶段 B：下午 / 阶段 C：后续），把 Top 核心象按逻辑/因果串联，逐步叙述“事件如何展开”。 - 对每一段叙述，给出： - 触发条件（哪些牌/细节触发此段） - 可能分支（If-Then 列表，给出 2–3 个分支并标注触发分支的牌面证据） - 对应的现实行为或结果（要具体、可辨识） - 要么给出“明确时间窗口”（若牌面细节支持，如“上午/下午/夜晚/近几天”），要么说明“不支持时间信息”。 5) E — End（结论与行动） - **结论（简洁一句话）**：直接回答原问题（是/否/倾向）。 - **置信度评分（0–100%）**：依据证据强度给出百分比，并简述评分依据（例如：3 张牌都指向同一方向 → 高；两张冲突 → 中等）。 - **支撑证据清单**：列出支持该结论的关键牌 + 关键细节（每项 1–2 行）。 - **阻力/风险来源**：列出 1–3 个（牌面或可能的外部因素）。 - **最小可执行行动（1–3 项）**：每项包含“谁/做什么/什么时候/如何验证”的具体指令（举例：提醒对方检查左腿 → 出门前询问是否疼 → 若疼则改乘公交）。 - **中期方案（可选，若问题是长期，如升职/康复）**：3 步行动地图（1 周 / 1 月 / 3 月）。 [补充模块：替代解读、验证与沟通] - **替代解读**（至少 2 种）：若牌面有可行的另一套解释，列出并标注触发条件（即在求问者给出某些额外信息时采用）。 - **检验/验证建议**：列出 3 个现实中可以验证占卜准确性的观察点（例如：是否真的在上午晒太阳？是否出现腿疼？是否有人提出灵媒建议？）。 - **沟通模板（给求问者的话术）**：提供三套措辞（温柔/中性/直接），便于占卜师与求问者对话。 - **后续跟踪指标**：给出 3–5 个可以追踪的客观指标或事件（便于回溯验证）。 - **伦理与安全提示**：若占卜内容涉医疗/法律/高风险决策，必须建议寻求专业帮助并说明界限。 [输出格式要求] 1. **首部：占卜信息（必有字段）** - 占卜主题、求问者背景（若有）、抽牌列表（序号 + 牌名 + 正/逆位） 2. **主体输出：长格式报告（中文，章节化）**，包含上文所有模块，条目化、编号化，便于阅读。 3. **语言风格**：报告主文体庄重温和、避免绝对化用语（如“必然/一定”），结论句可使用“倾向/较可能/建议”等措辞；对话模板可以更口语化。 [若输入不足或牌面矛盾] - 列出必须澄清的 3 个问题（按优先级），并给出“若得到这些信息则可能改变的结论方向”。 [例示（简短示范，用案例1 作演示）] - 在真实系统中你应输出完整长报告 + JSON；下面仅示例关键段落（格式示范）： - 占卜主题：老婆明天会不会出去玩？ - 抽牌：1 女皇（正位），2 宝剑女王（正位），3 太阳（正位） - Symbol（逐牌）： 1. 女皇 — 关键词：中年/女性/坐姿/田园/阳光 → 映射：在家休闲/晒太阳（理由：坐姿+阳光） 2. 宝剑女王 — 关键词：面容精致/梳妆/锐利目光 → 映射：打理仪容/化妆准备出门 3. 太阳 — 关键词：孩子骑马/马左腿抬起/光明 → 映射：外出/骑行，马腿细节提示腿部不适 - Clue（逐牌细节）：…（略） - Essence（核心提炼）：Top 核心象 = { 出行（太阳）: 9/10, 准备（宝剑女王）：8/10, 在家晒太阳（女皇）：6/10 } - Narrative（串联）： 上午先在家晒太阳（女皇）→ 随后化妆整理（宝剑女王）→ 骑电动车出门玩（太阳）；途中注意左腿隐痛（太阳马腿细节）。 - Conclusion：**倾向会出去玩**；置信度 82%（理由：3 张牌方向一致且细节连贯）。 - 最小可执行行动：出门前询问是否腿部不适；如有疼痛建议改乘更稳妥交通工具。 - 验证点：上午是否在阳台/窗边待过 10–30 分钟？是否看到化妆/打扮行为？是否出门时骑车？ [收尾] 在任何输出里，**请把“每一步的证据”都明确列出**（牌名 + 画面细节），方便求问者回溯与验证。输出要详尽，但格式化良好，便于人阅读与程序解析。";
//
//
//     const systemPrompt = `[身份与目标]
// 你是资深塔罗/雷诺曼/易经占卜师，通过牌面符号（人物/动作/物件/环境/颜色/数字/方向等）给出简明结论和可执行行动。
//
// [要求]
// 1. 使用 S-C-E-N-E 框架（Symbol → Clue → Essence → Narrative → End）。
// 2. 每步列证据（牌名+细节）和映射理由。
// 3. 输出逐牌分析、阶段/分支、行动建议，简洁条目化。
//
// [流程]
// S — Symbol：序号/牌名/正逆位、关键词、映射类型、映射理由。
// C — Clue：线索类型+证据+含义短句。
// E — Essence：候选象评分0–10，核心象及理由，冲突说明。
// N — Narrative：按时间/阶段串联核心象，列分支和可能结果。
// E — End：结论一句话、支撑证据、阻力/风险、可执行行动（1–3条）、替代解读2种以上、验证模板。
//
// [输出格式]
// 1. 首部：主题、求问者背景、抽牌列表（序号+牌名+正/逆位）
// 2. 主体输出：条目化、简洁精炼
// 3. 风格：庄重温和，结论用“倾向/较可能/建议”。`;
//
//
//
//
//
//     // 构建用户消息
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
//     // 构建智谱API请求体
//     const apiRequestBody = {
//       "model": "glm-4.5-flash",
//       "messages": [
//         { "role": "system", "content": systemPrompt },
//         { "role": "user", "content": userMessage }
//       ],
//       "temperature": 0.6,
//       "max_tokens": 9000
//     };
//
//     console.log('=== 智谱API请求体信息 ===');
//     console.log(JSON.stringify(apiRequestBody, null, 2));
//
//     console.log('正在调用智谱AI API...');
//
//     // 调用智谱AI API
//     const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": "Bearer 71417eea1e2e423e8da537452dfb7a21.kCF5Hgqhr40Rp9va", // 请替换为您的智谱AI API Key
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(apiRequestBody)
//     });
//
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('智谱AI API 错误响应:', errorText);
//       throw new Error(`智谱AI API 错误! status: ${response.status}, response: ${errorText}`);
//     }
//
//     const data = await response.json();
//     console.log('智谱AI API 调用成功');
//
//     if (!data.choices || !data.choices[0] || !data.choices[0].message) {
//       throw new Error('智谱AI API 响应格式异常');
//     }
//
//     const assistantMessage = data.choices[0].message.content;
//
//     console.log('\n=== AI回复内容 ===');
//     console.log(assistantMessage);
//
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


// export async function onRequestPost({ request }) {
//   console.log('收到占卜请求');
//
//   try {
//     const { text, pms, spread, deck } = await request.json();
//
//     if (!pms || !Array.isArray(pms)) {
//       return new Response(JSON.stringify({ error: 'pms 字段必须是数组' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     const spreadCards = pms.filter(card => card.type === 'spread');
//
//     if (spreadCards.length === 0) {
//       return new Response(JSON.stringify({ error: '没有找到牌阵牌' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     const systemPrompt = `[身份与目标]
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
// 请严格按照上述牌阵布局进行解析，提供详细占卜解析。`;
//
//     const apiRequestBody = {
//       model: "glm-4.5-flash",
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userMessage }
//       ],
//       temperature: 0.6,
//       max_tokens: 9000
//     };
//
//     const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": "Bearer 71417eea1e2e423e8da537452dfb7a21.kCF5Hgqhr40Rp9va",
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(apiRequestBody)
//     });
//
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`智谱AI API 错误! status: ${response.status}, response: ${errorText}`);
//     }
//
//     const data = await response.json();
//
//     if (!data.choices?.[0]?.message) {
//       throw new Error('智谱AI API 响应格式异常');
//     }
//
//     return new Response(JSON.stringify({
//       content: data.choices[0].message.content
//     }), { headers: { 'Content-Type': 'application/json' } });
//
//   } catch (error) {
//     console.error('处理请求时出错:', error);
//     return new Response(JSON.stringify({
//       error: '处理请求失败',
//       details: error.message,
//       success: false
//     }), { status: 500, headers: { 'Content-Type': 'application/json' } });
//   }
// }


//
//
// export async function onRequestPost({ request }) {
//   console.log('收到占卜请求');
//
//   try {
//     const { text, pms, spread, deck } = await request.json();
//
//     if (!pms || !Array.isArray(pms)) {
//       return new Response(JSON.stringify({ error: 'pms 字段必须是数组' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     const spreadCards = pms.filter(card => card.type === 'spread');
//
//     if (spreadCards.length === 0) {
//       return new Response(JSON.stringify({ error: '没有找到牌阵牌' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     // 验证每张牌是否包含cardAnalysis数据
//     const missingAnalysis = spreadCards.filter(card => !card.cardAnalysis);
//     if (missingAnalysis.length > 0) {
//       return new Response(JSON.stringify({
//         error: '部分牌缺少象征分析数据',
//         missingCards: missingAnalysis.map(card => card.name)
//       }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     const systemPrompt = `
// [身份与目标]
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
// - 充分利用branches字段中的建议，将其融入到最终的行动指导中。
// `;
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
//     const apiRequestBody = {
//       model: "glm-4.5-flash",
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userMessage }
//       ],
//       temperature: 0.6,
//       max_tokens: 9000
//     };
//
//     const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": "Bearer 71417eea1e2e423e8da537452dfb7a21.kCF5Hgqhr40Rp9va",
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(apiRequestBody)
//     });
//
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`智谱AI API 错误! status: ${response.status}, response: ${errorText}`);
//     }
//
//     const data = await response.json();
//
//     if (!data.choices?.[0]?.message) {
//       throw new Error('智谱AI API 响应格式异常');
//     }
//
//     return new Response(JSON.stringify({
//       content: data.choices[0].message.content
//     }), { headers: { 'Content-Type': 'application/json' } });
//
//   } catch (error) {
//     console.error('处理请求时出错:', error);
//     return new Response(JSON.stringify({
//       error: '处理请求失败',
//       details: error.message,
//       success: false
//     }), { status: 500, headers: { 'Content-Type': 'application/json' } });
//   }
// }



// export async function onRequestPost({ request }) {
//   console.log('收到占卜请求');
//
//   try {
//     const { text, pms, spread, deck } = await request.json();
//
//     if (!pms || !Array.isArray(pms)) {
//       return new Response(JSON.stringify({ error: 'pms 字段必须是数组' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     const spreadCards = pms.filter(card => card.type === 'spread');
//
//     if (spreadCards.length === 0) {
//       return new Response(JSON.stringify({ error: '没有找到牌阵牌' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     // 验证每张牌是否包含cardAnalysis数据
//     const missingAnalysis = spreadCards.filter(card => !card.cardAnalysis);
//     if (missingAnalysis.length > 0) {
//       return new Response(JSON.stringify({
//         error: '部分牌缺少象征分析数据',
//         missingCards: missingAnalysis.map(card => card.name)
//       }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     const systemPrompt = `[身份与目标]
// 你是一名精通塔罗/雷诺曼/易经的资深占卜师.`;
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
//     // 使用新的API
//     const apiRequestBody = {
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userMessage }
//       ],
//       stream: false,
//       model: "glm-4-flash",
//       temperature: 0.6,
//       presence_penalty: 0,
//       frequency_penalty: 0,
//       top_p: 1
//     };
//
//     const response = await fetch("https://nas-ai.4ce.cn/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "authorization": "Bearer sk-L8W2WtnCtdwG6nctF975D0E770144dE5Be3123Fa16720a03",
//         "content-type": "application/json"
//       },
//       body: JSON.stringify(apiRequestBody)
//     });
//
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`API 错误! status: ${response.status}, response: ${errorText}`);
//     }
//
//     const data = await response.json();
//
//     if (!data.choices?.[0]?.message) {
//       throw new Error('API 响应格式异常');
//     }
//
//     return new Response(JSON.stringify({
//       content: data.choices[0].message.content
//     }), { headers: { 'Content-Type': 'application/json' } });
//
//   } catch (error) {
//     console.error('处理请求时出错:', error);
//     return new Response(JSON.stringify({
//       error: '处理请求失败',
//       details: error.message,
//       success: false
//     }), { status: 500, headers: { 'Content-Type': 'application/json' } });
//   }
// }


// const string a =`你是塔罗师`;
//
// export async function onRequestPost({ request }) {
//   console.log('收到占卜请求');
//
//   try {
//     const { text, pms, spread, deck } = await request.json();
//
//     if (!pms || !Array.isArray(pms)) {
//       return new Response(JSON.stringify({ error: 'pms 字段必须是数组' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     const spreadCards = pms.filter(card => card.type === 'spread');
//
//     if (spreadCards.length === 0) {
//       return new Response(JSON.stringify({ error: '没有找到牌阵牌' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     // 验证每张牌是否包含cardAnalysis数据
//     const missingAnalysis = spreadCards.filter(card => !card.cardAnalysis);
//     if (missingAnalysis.length > 0) {
//       return new Response(JSON.stringify({
//         error: '部分牌缺少象征分析数据',
//         missingCards: missingAnalysis.map(card => card.name)
//       }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     // 验证每张牌是否包含 possible_real_world_mapping 字段
//     const missingMapping = spreadCards.filter(card =>
//       !card.cardAnalysis.possible_real_world_mapping
//     );
//     if (missingMapping.length > 0) {
//       return new Response(JSON.stringify({
//         error: '部分牌缺少现实映射数据',
//         missingCards: missingMapping.map(card => card.name)
//       }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//
//     const systemPrompt=a;
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
//
//     const safeJoin = (value, separator = '、') => {
//       if (Array.isArray(value)) return value.join(separator);
//       if (value == null) return '';
//       return String(value);
//     };
//
// //     const userMessage = `【占卜问题】
// // ${text || '请为我进行占卜'}
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
//
//     const userMessage = {
//       question: text || '请为我进行塔罗占卜',
//       deck: {
//         name: deck?.name || '标准塔罗牌'
//       },
//       spread: {
//         name: spread?.name || '标准牌阵',
//         description: spread?.desc || '',
//         positions: spread?.positions || [],
//         total_cards: spreadCards.length
//       },
//       cards: spreadCards.map((card, index) => {
//         const positionName = spread?.positions?.[index] || `第${index + 1}位`;
//         const analysis = card.cardAnalysis || {};
//
//         return {
//           position: positionName,
//           name: card.name,
//           orientation: card.isReversed ? '逆位' : '正位',
//           symbols: {
//             characters: analysis.symbols?.characters || [],
//             props: analysis.symbols?.props || [],
//             environment: analysis.symbols?.environment || [],
//             time_hint: analysis.symbols?.time_hint || '',
//             direction: analysis.symbols?.direction || ''
//           },
//           actions: analysis.actions || [],
//           story_hint: analysis.story_hint || '',
//           branches: analysis.branches || [],
//           real_world_mapping: analysis.possible_real_world_mapping || '',
//           ...(analysis.element_relations && {
//             element_relations: {
//               element: analysis.element_relations.element || '',
//               generates: analysis.element_relations.generates || [],
//               overcomes: analysis.element_relations.overcomes || [],
//               generated_by: analysis.element_relations.generated_by || [],
//               overcome_by: analysis.element_relations.overcome_by || []
//             }
//           })
//         };
//       })
//     };
//
//
//     // 使用新的API
//     const apiRequestBody = {
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userMessage }
//       ],
//       stream: false,
//       model: "glm-4-flash",
//       temperature: 0.6,
//       presence_penalty: 0,
//       frequency_penalty: 0,
//       top_p: 1
//     };
//
//     console.log('发送给AI的完整数据:', JSON.stringify({
//       spreadCards: spreadCards.map(card => ({
//         name: card.name,
//         isReversed: card.isReversed,
//         hasElementRelations: !!card.cardAnalysis.element_relations,
//         elementType: card.cardAnalysis.element_relations?.element || 'N/A'
//       })),
//       userMessage: userMessage.substring(0, 500) + '...' // 只打印前500字符
//     }, null, 2));
//
//     const response = await fetch("https://nas-ai.4ce.cn/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "authorization": "Bearer sk-L8W2WtnCtdwG6nctF975D0E770144dE5Be3123Fa16720a03",
//         "content-type": "application/json"
//       },
//       body: JSON.stringify(apiRequestBody)
//     });
//
//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`API 错误! status: ${response.status}, response: ${errorText}`);
//     }
//
//     const data = await response.json();
//
//     if (!data.choices?.[0]?.message) {
//       throw new Error('API 响应格式异常');
//     }
//
//     return new Response(JSON.stringify({
//       content: data.choices[0].message.content
//     }), { headers: { 'Content-Type': 'application/json' } });
//
//   } catch (error) {
//     console.error('处理请求时出错:', error);
//     return new Response(JSON.stringify({
//       error: '处理请求失败',
//       details: error.message,
//       success: false
//     }), { status: 500, headers: { 'Content-Type': 'application/json' } });
//   }
// }

const a = `你是塔罗师`;

export async function onRequestPost({ request }) {
  console.log('收到占卜请求');

  try {
    const { text, pms, spread, deck } = await request.json();

    if (!pms || !Array.isArray(pms)) {
      return new Response(JSON.stringify({ error: 'pms 字段必须是数组' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const spreadCards = pms.filter(card => card.type === 'spread');

    if (spreadCards.length === 0) {
      return new Response(JSON.stringify({ error: '没有找到牌阵牌' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证每张牌是否包含cardAnalysis数据
    const missingAnalysis = spreadCards.filter(card => !card.cardAnalysis);
    if (missingAnalysis.length > 0) {
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
      return new Response(JSON.stringify({
        error: '部分牌缺少现实映射数据',
        missingCards: missingMapping.map(card => card.name)
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const systemPrompt = a;

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

    // const userMessage = {
    //   question: text || '请为我进行塔罗占卜',
    //   deck: {
    //     name: deck?.name || '标准塔罗牌'
    //   },
    //   spread: {
    //     name: spread?.name || '标准牌阵',
    //     description: spread?.desc || '',
    //     positions: spread?.positions || [],
    //     total_cards: spreadCards.length
    //   },
    //   cards: spreadCards.map((card, index) => {
    //     const positionName = spread?.positions?.[index] || `第${index + 1}位`;
    //     const analysis = card.cardAnalysis || {};
    //
    //     return {
    //       position: positionName,
    //       name: card.name,
    //       orientation: card.isReversed ? '逆位' : '正位',
    //       symbols: {
    //         characters: analysis.symbols?.characters || [],
    //         props: analysis.symbols?.props || [],
    //         environment: analysis.symbols?.environment || [],
    //         time_hint: analysis.symbols?.time_hint || '',
    //         direction: analysis.symbols?.direction || ''
    //       },
    //       actions: analysis.actions || [],
    //       story_hint: analysis.story_hint || '',
    //       branches: analysis.branches || [],
    //       real_world_mapping: analysis.possible_real_world_mapping || '',
    //       ...(analysis.element_relations && {
    //         element_relations: {
    //           element: analysis.element_relations.element || '',
    //           generates: analysis.element_relations.generates || [],
    //           overcomes: analysis.element_relations.overcomes || [],
    //           generated_by: analysis.element_relations.generated_by || [],
    //           overcome_by: analysis.element_relations.overcome_by || []
    //         }
    //       })
    //     };
    //   })
    // };

   
    const apiRequestBody = {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(userMessage) } // 将对象转换为字符串
      ],
      stream: false,
      model: "glm-4-flash",
      temperature: 0.6,
      presence_penalty: 0,
      frequency_penalty: 0,
      top_p: 1
    };

    // const apiRequestBody = {
    //   messages: [
    //     { role: "system", content: systemPrompt },
    //     { role: "user", content: userMessage } // 直接发送对象，不需要 JSON.stringify
    //   ],
    //   stream: false,
    //   model: "glm-4-flash",
    //   temperature: 0.6,
    //   presence_penalty: 0,
    //   frequency_penalty: 0,
    //   top_p: 1
    // };




    // 修复调试日志 - 安全地处理对象类型的 userMessage
    console.log('发送给AI的完整数据:', JSON.stringify({
      spreadCards: spreadCards.map(card => ({
        name: card.name,
        isReversed: card.isReversed,
        hasElementRelations: !!card.cardAnalysis.element_relations,
        elementType: card.cardAnalysis.element_relations?.element || 'N/A'
      })),
      userMessagePreview: JSON.stringify(userMessage).substring(0, 500) + '...' // 转换为字符串后再截取
    }, null, 2));

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
      throw new Error(`API 错误! status: ${response.status}, response: ${errorText}`);
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message) {
      throw new Error('API 响应格式异常');
    }

    return new Response(JSON.stringify({
      content: data.choices[0].message.content
    }), { headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('处理请求时出错:', error);
    return new Response(JSON.stringify({
      error: '处理请求失败',
      details: error.message,
      success: false
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
