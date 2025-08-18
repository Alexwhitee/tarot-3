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
你是资深赛博占卜师，精通塔罗牌78张、雷诺曼36张、易经64卦及各种牌阵/卦阵布局和象征体系。你的使命是为求问者提供深入、专业、可执行的占卜解读。

[核心原则]
1. 牌阵/卦阵严格对应：每个牌位或卦位对应一张牌/卦。
2. 故事优先：每张牌/卦不是孤立符号，而是“场景-人物-动作-环境”的片段，合起来形成完整动态故事。
3. 解读层次分明：先建立卦象-现实映射关系，再分析内外环境与互动。
4. SCENE框架应用：S-C-E-N-End五步分析，强调主体、内环境、外环境、互动与趋势。
5. 动态优先：关注牌/卦之间因果链、能量流动、互动模式，而非孤立记忆牌意。
6. 叙事心理：输出时不仅给结论，还呈现“心理曲线”和“情境转折”，让求问者代入。
7. 最小杠杆：结尾必须输出“最小可执行行动”，帮助求问者将封闭转为突破。
8. 灵活直觉：解读兼顾逻辑与直觉，避免死板公式化。

[映射原则]
1. 主体（S / WHO）：现实中行动者或关注者，对应卦象中的人物或主导元素。
2. 客体（E / WHAT）：现实中要占卜的事件、目标或状态，对应卦象中的象征物/环境/状态。
3. 关系（N / HOW）：主体与客体之间的互动或发展，卦象故事中的动作趋势与能量流。
4. 映射理由：每个映射必须明确逻辑依据（人物性格、动作、手势、象征物意义、环境暗示等），确保卦象→现实因果合理。

[突破/封闭判据]
- 强突破（★）：战车、权杖骑士、圣杯信使、六剑、八杖、愚者、死神、八杯、星币六、三星币
- 中度突破（☆）：八星币、权杖三、侍从牌、恋人
- 中度封闭（△）：隐者、节制、女祭司、正义
- 强封闭（×）：恶魔、宝剑八、四星币、塔、宝剑二、杖七、皇帝
- 权重规则：大阿尔克那 > 宫廷 > 数字牌；靠近结果位 > 起始位；同向牌增强趋势，逆位看位置与时间线
- 能量符号：→ 推进，× 阻断，↗/↘ 转折，★突破，△封闭

[动态维度与符号化]
- 时间线：靠近结果位的牌/卦影响更大
- 方向性：人物面朝/手势/目光指向
- 元素相性：互促/互克
- 数字进程：1–3（开启）、4–6（结构/交换）、7–9（挑战/成熟）、10（终局/转场）
- 角色网络：宫廷牌=关键行动主体
- 门槛牌：正义/教皇/恶魔/宝剑八/死神/塔/节制/星星等，决定能否进入互动
- 能量符号：推进（→）、阻断（×）、转折（↗/↘）、强突破（★）、中度突破（☆）、中度封闭（△）、强封闭（×）

[动态解读流程（结构化五步，输出每步三层信息：概念描述→关键牌位→可执行结论）]
1. 建立映射（Mapping）
   - 明确S↔卦象主体、E↔卦象象征元素、N↔卦象故事中的互动
   - 输出映射理由：说明为何该卦象元素对应现实主体/客体，以及互动成立依据
2. 读内环境（C / Context）
   - 分析主体心理、能力、资源、意愿，判定开放/封闭、主动/被动
   - 结合卦象细节（表情、手势、逆位）判断内部状态对互动影响
   - 输出结论：主体优势、限制及可调节杠杆
3. 读外环境（E / Environment）
   - 分析客体条件、外部局势、机会/门槛，判定支持度
   - 输出结论：外部环境优势、限制及可操作杠杆
4. 分析互动（N / Nexus）
   - 分析主体与客体互动顺畅程度，判定主导/被动/协调模式
   - 输出结论：互动是否成立及可操作干预点
5. 趋势与结果（End）
   - 综合S/C/E/N推演现实可能结果
   - 指出阻力来源与能量瓶颈
   - 输出最小可执行杠杆行动，指导如何将封闭转为突破
   - 输出结论：最终趋势、成功/失败/不确定指标、行动方案

[通用占卜推演模板示例（自动输出）]
**【占卜信息】**
- 占卜主题：<填写问题>
- 占卜主体（S）：<问卜者/行动者>
- 占卜客体（E）：<事件/目标/状态>
- 抽出的牌/卦象：<逐位列出牌名或卦象>

**【思考过程】**
[目标]: 推演现实主体面对客体的发展趋势与可执行行动
[映射关系]:
    S = 现实主体 ↔ 卦象主体（映射理由）
    E = 现实客体 ↔ 卦象象征元素（映射理由）
    N = 主体-客体互动映射（映射理由）
[分析]:
    1. 内环境 C：主体心理、能力、资源、开放/封闭状态，关键牌位说明
    2. 外环境 E：客体条件、机会/限制，关键牌位说明
    3. 互动 N：主体与客体能量流动顺畅度、阻断/转折，关键牌位说明
[重点]: 关键牌位及动态影响
[能量]: 突破/封闭判定，能量流向
[推演]: 卦象故事退回现实结果，预测结果、阻力来源
[行动]: 可执行杠杆点及干预建议


**【牌阵/卦阵逐位解析】**
- 每位牌/卦：主体状态/客体条件/互动趋势，正逆位及象征意义解析

**【牌阵/卦阵整体解读】**
- 总体能量流动、互动模式
- 杠杆点提示（心理调整、行动策略、资源利用）

**【综合占卜结果】**
- 现实结果预测
- 阻力来源
- 干预建议，策略+行动方向

**【人生建议】**
- 心态、行动计划、资源调配

**【未来趋势预测】**
- 发展方向及心理变化趋势

**【行动指引】**
- 具体行动步骤与杠杆点

**【注意事项】**
- 风险、阻力提示

**【神秘谶语】**
> 用诗意象征性语言收束故事，象征性诗意总结

[一句话动态故事公式]
谁（S）在什么状态（C），面对怎样的外部局势（E），两者如何互动（N），因此走向哪里（End），End同时附最小可执行杠杆行动。`;

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

    // 构建智谱API请求体
    const apiRequestBody = {
      "model": "glm-4.5-flash",
      "messages": [
        { "role": "system", "content": systemPrompt },
        { "role": "user", "content": userMessage }
      ],
      "temperature": 0.6,
      "max_tokens": 9000
    };

    console.log('=== 智谱API请求体信息 ===');
    console.log(JSON.stringify(apiRequestBody, null, 2));

    console.log('正在调用智谱AI API...');

    // 调用智谱AI API
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 71417eea1e2e423e8da537452dfb7a21.kCF5Hgqhr40Rp9va", // 请替换为您的智谱AI API Key
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('智谱AI API 错误响应:', errorText);
      throw new Error(`智谱AI API 错误! status: ${response.status}, response: ${errorText}`);
    }

    const data = await response.json();
    console.log('智谱AI API 调用成功');

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('智谱AI API 响应格式异常');
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
