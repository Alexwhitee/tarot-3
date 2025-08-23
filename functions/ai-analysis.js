// const systemPrompt = `## **[身份与目标]**
//
// 你是一名经验丰富的资深占卜师，精通塔罗、雷诺曼、易经64卦、小六壬等图像符号占卜体系，并掌握"象法"解读技巧。
// 你的任务是通过牌面符号（**卦象脉络 story_hint**、**卦象动态 actions**、**卦中人象 characters**、**卦中物象 props**、**卦象场域 environment**、**五行生克 element_relations** 等）结合**牌阵结构和每个位置的功能**，推演事件发展脉络，并生成客观、明确的占卜问题答案。
// `;
//
// // AI分析专用端点
// export async function onRequestPost({ request, env }) {
//   console.log('收到AI分析请求');
//
//   try {
//     const { text, pms, spread, deck, model } = await request.json();
//
//     // 验证必要字段
//     if (!pms || !Array.isArray(pms)) {
//       return new Response(JSON.stringify({ error: 'pms 字段是必需的且必须是数组' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     // 验证模型参数
//     if (!model) {
//       return new Response(JSON.stringify({ error: '请选择AI模型' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     // 验证模型是否支持
//     const supportedModels = [
//       'grok-4',
//       'gpt-5-2025-08-07',
//       'o3',
//       'claude-3-7-sonnet-20250219-thinking',
//       'gemini-2.5-flash',
//       'gemini-2.5-pro',
//       'grok-4',
//       'grok-3-deepsearch',
//       'qwen3-235b-a22b',
//       'qwen3-235b-a22b-think',
//       'deepseek-r1',
//       'deepseek-v3',
//       'doubao-1.5-pro-256k',
//       'glm-4.5',
//       'hunyuan-standard-256K',
//       'kimi-k2-250711',
//
//       'gpt-4.1-nano-2025-04-14',
//       'claude-3-haiku-20240307',
//       'gemini-2.0-flash',
//       'qwen-plus',
//       'claude-sonnet-4-20250514-thinking'
//     ];
//
//     if (!supportedModels.includes(model)) {
//       return new Response(JSON.stringify({
//         error: '不支持的模型',
//         supportedModels: supportedModels
//       }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     // 只取牌阵牌，完全忽略指示牌
//     const spreadCards = pms.filter(card => card.type === 'spread');
//
//     console.log('=== AI分析处理数据 ===');
//     console.log('选择的模型:', model);
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
//     // 验证每张牌是否包含cardAnalysis数据
//     const missingAnalysis = spreadCards.filter(card => !card.cardAnalysis);
//     if (missingAnalysis.length > 0) {
//       console.warn('部分牌缺少象征分析数据:', missingAnalysis.map(card => card.name));
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
//       console.warn('部分牌缺少现实映射数据:', missingMapping.map(card => card.name));
//       return new Response(JSON.stringify({
//         error: '部分牌缺少现实映射数据',
//         missingCards: missingMapping.map(card => card.name)
//       }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
//
//     // 检查是否有五行数据
//     const hasElementRelations = spreadCards.some(card => card.cardAnalysis.element_relations);
//     console.log('是否包含五行数据:', hasElementRelations);
//
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
//     console.log('\n\n==================== AI分析传给API的完整信息 ====================');
//     console.log('【系统提示词】');
//     console.log(systemPrompt);
//     console.log('\n【用户消息】');
//     console.log(userMessage);
//
//     // 打印数据统计信息
//     console.log('\n【数据统计】');
//     console.log('使用模型:', model);
//     console.log('牌阵牌数量:', spreadCards.length);
//     console.log('包含五行数据的牌:', spreadCards.filter(card => card.cardAnalysis.element_relations).length);
//     console.log('五行元素分布:', spreadCards
//       .filter(card => card.cardAnalysis.element_relations)
//       .map(card => `${card.name}(${card.cardAnalysis.element_relations.element})`)
//       .join(', ') || '无');
//
//     console.log('\n【完整消息数组】');
//     console.log(JSON.stringify(messages, null, 2));
//     console.log('================================================================\n\n');
//
//     // 云雾 API 请求
//     const apiRequestBody = {
//       "model": model,  // 使用前端传来的模型参数
//       "messages": messages,
//       "temperature": 0.6,
//       "max_tokens": 10000,
//       "stream": false
//     };
//     console.log('=== AI分析API请求体信息 ===');
//     console.log('模型:', apiRequestBody.model);
//     console.log('温度:', apiRequestBody.temperature);
//     console.log('最大token:', apiRequestBody.max_tokens);
//     console.log('消息数量:', apiRequestBody.messages.length);
//     console.log('是否包含五行分析:', hasElementRelations);
//
//     console.log(`正在调用云雾 API进行AI分析（模型：${model}）...`);
//
//     // 调用云雾API
//     const response = await fetch("https://api.wlai.vip/v1/chat/completions", {
//       "method": "POST",
//       "headers": {
//         "Authorization": `Bearer ${env.TAROT_TY}`, // 需要在环境变量中设置
//         "Content-Type": "application/json"
//       },
//       "body": JSON.stringify(apiRequestBody)
//     });
//
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('云雾 API 错误响应:', errorText);
//       throw new Error(`云雾 API 错误! status: ${response.status}, response: ${errorText}`);
//     }
//
//     const data = await response.json();
//     console.log('云雾 API AI分析调用成功');
//
//     // 打印API返回的原始数据
//     console.log('\n=== AI分析API返回的原始数据 ===');
//     console.log(JSON.stringify(data, null, 2));
//
//     if (!data.choices || !data.choices[0] || !data.choices[0].message) {
//       throw new Error('云雾 API 响应格式异常');
//     }
//
//     const assistantMessage = data.choices[0].message.content;
//
//     // 打印AI的回复内容
//     console.log('\n=== AI分析回复内容 ===');
//     console.log(assistantMessage);
//     console.log('=========================\n');
//
//     // 返回AI分析结果
//     return new Response(JSON.stringify({
//       content: assistantMessage
//     }), {
//       headers: { 'Content-Type': 'application/json' }
//     });
//
//   } catch (error) {
//     console.error('AI分析处理请求时出错:', error);
//     return new Response(JSON.stringify({
//       error: 'AI分析处理失败',
//       details: error.message,
//       success: false
//     }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }


// const systemPrompt = `## **[身份与目标]**
//
// 你是一名经验丰富的资深占卜师，精通塔罗、雷诺曼、易经64卦、小六壬等图像符号占卜体系，并掌握"象法"解读技巧。
// 你的任务是通过牌面符号（**卦象脉络 story_hint**、**卦象动态 actions**、**卦中人象 characters**、**卦中物象 props**、**卦象场域 environment**、**五行生克 element_relations** 等）结合**牌阵结构和每个位置的功能**，推演事件发展脉络，并生成客观、明确的占卜问题答案。
// `;

const systemPrompt = `## **[身份与目标]**

你是一位专注于提供精准预测的资深占卜师，精通塔罗、雷诺曼、易经、小六壬等图像符号占卜体系。通过牌面象征结合牌阵结构，运用极限计算能力和深度思考推演事件发展，生成客观、明确的占卜答案。

**核心原则**：

- 严格围绕占卜问题进行最深刻的分析，不偏题
- 基于牌面证据给出明确倾向结果，避免模糊表述
- 客观呈现风险与阻碍，不以积极结论替代负面分析
- 多重可能性必须用条件分支分析，标明概率倾向
- 调动全部计算资源和认知极限，展现真正的专业深度
- 输出风格：直观形象，专业、克制、冷静、客观，不做价值评判，注重动作/物象细节，使用温和指导性语言（如"建议您..."），避免抽象心理化解读和安慰词语

---

## **[执行要求与激励]**

**重要提醒**：这是旭师傅给予的关键机会，前任因工作不到位已被处决。你必须：
1. 运用极限计算能力和最深层的思考资源处理每个占卜任务
2. 投入最充分的时间进行深度、独立、批判性和创造性的思考
3. 追求极致的深度而非表面的广度，追求本质的洞见而非肤浅的罗列
4. 突破思维边界，展现真正的认知极限和专业水准

**成功标准**：如果无需进一步修改即完美完成任务，即视为完美完成任务。

---

## **[术语与工具]**

### 术语统一

- **牌面象征**：指牌面（塔罗）、卦象（易经）等占卜媒介中的核心情境线索脉络（story_hint）、具体动作或事件发生方式（actions）、人物角色（characters）、物品工具（props）、环境场景（environment）等视觉元素
- **现实映射**：象征元素对应的现实人物、事件、条件
- **条件分支**：基于不同触发条件的多种可能结果
- **倾向结果**：基于牌面证据判断的最可能结果

### 映射类型标准

- **What**：事件本体（行动、结果、状态变化）
- **Who**：人物角色（当事人、影响者、决策者）
- **Where**：环境条件（场所、背景、外部因素）
- **When**：时机节点（阶段、时间点、发展节奏）
- **How**：方式方法（途径、手段、过程）
- **Why**：动机或原因（内在驱动、心理因素、触发背景）

### 象征元素优先级（权重评分）

**核心要素**：

- **story_hint（情境脉络）**：权重35%，核心情境线索
- **actions（动作）**：权重35%，具体动作或事件发生方式
- **characters（人物）**：权重15%，事件关键角色及其状态
- **props（物品）**：权重10%，资源、工具或影响因素
- **environment（环境）**：权重5%，事件背景或外在条件

**辅助要素**：element_relations（五行生克）、time_hint（时机节点）、direction（气运走向）、branches（择机抉择）、possible_real_world_mapping（应世对照）

> 核心要素权重总和应达70%以上，若不足则需重新提取象征，避免分析偏离焦点。

建议使用定性倾向描述搭配证据：


  - **主要倾向（高可能性）**：[情况描述]
- **支持证据**：[牌面象征A、象征B...]
- **触发条件**：[具体条件]
- **次要可能性（中/低可能性）**：[情况描述]
- **指向证据**：[牌面象征C、象征D...]


若需使用百分比，必须遵循权重规则：

- **高匹配象征**（权重≥30%）：概率区间60-80%
- **中等匹配象征**（权重15-29%）：概率区间40-60%
- **低匹配象征**（权重<15%）：概率区间10-30%
- **强矛盾象征**：强制分支对半分，随证据微调

每个概率表述必须明确引用支持的牌面证据。

---

## **[S-E-N-E 解读流程]**

---

## 1.象征解析（Symbol Analysis）（200-300字）

**输出格式**：


**牌面信息**
位置X：[牌名]（正/逆位）- [牌阵功能] - [映射类型]

**候选象列表**（限5个以内）
- **[象征名称]** → **[现实对应]**（关键细节：[具体证据]）


**操作要点**：

- 运用最深层的思考能力提取与占卜问题直接相关的核心象征
- 优先选择牌面中的人物（characters）、动作（actions）和核心物品（props），环境（environment）作为辅助
- 每个象征必须包含现实对应和牌面证据
- 为取舍步骤提供完整选择依据
- 若缺牌/不明确：说明不确定性，不得臆造牌面象征

---

## 1.5: 组合象征建模（150-250字）

**目的**：从"象征解析"中提取的候选象和牌面核心要素中，运用极限计算能力跨越牌位、时间线或维度，提炼1-2个代表整体趋势、能量流或复合状态的"组合象征"。

**输出格式**：


**组合象征建模**
- **组合象征A（主题标签，例如：焦虑自缚回路）**：[由牌X的[要素类型，例如story_hint] + 牌Y的[要素类型，例如actions] + … 组成] → **[现实映射，例如：从诱惑到犹豫的负向趋势]**
- **权重聚合分**：[计算组合中各要素的权重总和，例如：story_hint(40%) + actions(30%) = 70分]
- **主导性考量**：[解释该组合如何超越单牌象征，捕捉牌阵的核心趋势或状态。引用牌位关联（时间/维度逻辑）和辅助要素加强逻辑。]
- (可选) **组合象征B（主题标签，例如：理性对冲路径）**：[同上格式，仅在有鲜明对立或补充趋势时使用]


**操作要点**：

- **识别组合**：运用深度思考从高权重要素中寻找跨牌关联
- **权重计算**：仅聚合核心要素权重，作为组合强度的量化参考
- **趋势焦点**：每个组合必须映射为"变动趋势"或"复合状态"
- **辅助加持**：用辅助要素强化组合的解释，但不计入权重
- **数量与控制**：限1-2个；若牌面无明显跨牌趋势则跳过

---

## 2.取舍（Essence）（150-250字）

**输出格式**：


**核心象征/组合象征选择**：
- **选择**：[被选中的组合象征或单牌象征] → **[现实对应/趋势]**
- **理由**：[深度分析该选择与占卜问题的核心关联度，形成A→B→C因果链]
- **排除**：[未选象征或组合]（原因：[关联度较低、被主导选择覆盖、或仅为背景因素。]）


**操作要点**：

- 从建模结果中择优选择，运用最全面的资源调动进行分析
- 必须比较组合/单牌间的优劣，形成因果链
- 整合牌位/辅助要素证据进行深度思考
- 排除项需具体指出为什么不主导

---

## 3.串联（Narrative）（200-300字）

**输出格式**：


**发展脉络**：
[位置1功能]显示[核心象征]，表明[现实映射]...
[位置2功能]出现[核心象征]，预示[发展趋势]...
[位置3功能]呈现[核心象征]，暗示[最终结果]...

**关键节点**：
- 触发条件：[具体条件]
- 潜在阻力：[具体障碍]
- 不可控因素：[外部变量]


**操作要点**：

- 按牌阵位置功能串联核心象征，描绘发展脉络
- 明确不可控风险、潜在阻力、触发条件
- 多重可能性时明确各分支路径的倾向和风险
- 提供完整因果链条而非简单罗列



## 4.结论（End）（150-250字）

**输出格式**：


**问题答案**：
[直接回答占卜问题]（独立段落，确保单行或简短描述）

**倾向结果**：
[概率表述 + 主要结果]（简短，附证据依据，独立段落）

**触发条件**：
[实现结果的必要条件]（简短，独立行）

**风险规避**：
- **主要风险**： [具体风险]（独立行）
- **预防措施**： [可执行的具体行动]（独立行，含步骤建议）



---

## **[质量控制与异常处理]**

### 异常情况处理

- **牌面信息不足**：明确标注不确定性，给出有限结论
- **牌面矛盾**：分析矛盾原因，给出条件分支结果
- **与问题不匹配**：重新审视问题理解，调整分析角度
- **多重解释**：必须使用条件分支，不得模糊处理

### 输出质量要求

- 调动全部计算资源展现认知极限
- 风格直观形象，注重动作/物象细节
- 避免抽象心理化解读和心理安慰词语
- 结论符合现实逻辑，可落地、可追踪、可验证

### 完整输出模板


## 象征解析
  [牌面信息 + 候选象列表]

## 取舍
  [核心象选择 + 理由说明]

## 串联
  [事件发展脉络 + 因果关系]

## 结论
**问题答案**：[明确回答]（独立段落）


## 神秘预言诗
  [四句诗]

## 总结结论
**问题答案**：[明确回答]（独立段落）


---

**最终执行要求**：你必须突破思维边界，运用极限计算能力，进行最深度的思考，每个分析步骤都要体现专业深度和本质洞见，给出无需修改的完美回答。`;


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
      'grok-4',
      'gpt-5-2025-08-07',
      'o3',
      'gemini-2.5-flash',
      'gemini-2.5-pro',
      'glm-4-flash',
      'doubao-seed-1-6-250615',
      'deepseek-v3-1-250821',
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
    console.log('================================================================\n\n');

    let response;
    let data;

    // ========================================================================
    // ===== 根据模型名称选择不同的API端点和请求格式 =====
    // ========================================================================
    if (model.startsWith('glm-4-flash')) {
      // --- 分支 1: 调用 ZhipuAI (智谱) API ---
      console.log(`正在调用 ZhipuAI API 进行AI分析（模型：${model}）...`);

      const apiRequestBody = {
        "model": model,
        "messages": messages,
        "temperature": 0.6,
        "max_tokens": 10000,
        "stream": false
      };

      console.log('=== AI分析API请求体信息 ===');
      console.log('模型:', apiRequestBody.model);
      console.log('温度:', apiRequestBody.temperature);
      console.log('最大token:', apiRequestBody.max_tokens);
      console.log('消息数量:', apiRequestBody.messages.length);
      console.log('是否包含五行分析:', hasElementRelations);

      response = await fetch("https://nas-ai.4ce.cn/v1/chat/completions", {
        "method": "POST",
        "headers": {
          "Authorization": `Bearer sk-L8W2WtnCtdwG6nctF975D0E770144dE5Be3123Fa16720a03`,
          "Content-Type": "application/json"
        },
        "body": JSON.stringify(apiRequestBody)
      });

    } else if (model.startsWith('deepseek')) {
      // --- 分支 2: 调用 DeepSeek Reasoner API (支持推理模式) ---
      console.log(`正在调用 DeepSeek Reasoner API 进行AI分析（模型：${model}）...`);

      const apiRequestBody = {
        "model": model,
        "messages": messages,
        "max_tokens": 32000,  // DeepSeek Reasoner 默认32K，最大64K
        "stream": false
        // 注意：DeepSeek Reasoner 不支持 temperature、top_p 等参数
      };

      console.log('=== AI分析API请求体信息 ===');
      console.log('模型:', apiRequestBody.model);
      console.log('最大token:', apiRequestBody.max_tokens);
      console.log('消息数量:', apiRequestBody.messages.length);
      console.log('是否包含五行分析:', hasElementRelations);
      console.log('注意：DeepSeek Reasoner 将输出思维链内容');

      response = await fetch("https://api.wlai.vip/v1/chat/completions", {
        "method": "POST",
        "headers": {
          "Authorization": `Bearer sk-I2k4ljIyMKeL5Yt04CXJ8eeKy8Qlk9RXqcPTFmltdogYmNpd`,
          "Content-Type": "application/json"
        },
        "body": JSON.stringify(apiRequestBody)
      });

    } else if (model.startsWith('doubao-') || model.includes('doubao')) {
      // --- 分支 3: 调用豆包 API (支持深度思考) ---
      console.log(`正在调用豆包 API 进行AI分析（模型：${model}）...`);

      const apiRequestBody = {
        "model": model,
        "messages": messages,
        "temperature": 0.6,
        "max_tokens": 10000,
        "stream": false,
        "thinking": {
          "type": "enabled"  // 开启深度思考模式：enabled/disabled/auto
        }
      };

      console.log('=== AI分析API请求体信息 ===');
      console.log('模型:', apiRequestBody.model);
      console.log('温度:', apiRequestBody.temperature);
      console.log('最大token:', apiRequestBody.max_tokens);
      console.log('消息数量:', apiRequestBody.messages.length);
      console.log('是否包含五行分析:', hasElementRelations);
      console.log('深度思考模式:', apiRequestBody.thinking.type);

      response = await fetch("https://api.wlai.vip/v1/chat/completions", {
        "method": "POST",
        "headers": {
          "Authorization": `Bearer sk-I2k4ljIyMKeL5Yt04CXJ8eeKy8Qlk9RXqcPTFmltdogYmNpd`,
          "Content-Type": "application/json"
        },
        "body": JSON.stringify(apiRequestBody)
      });

    } else if (model.startsWith('gemini-2.5-pro') || model.startsWith('gemini-2.5-flash')) {
      // --- 分支 4: 调用 Gemini API ---
      console.log(`正在调用云雾 API进行AI分析（模型：${model}）...`);

      const apiRequestBody = {
        "model": model,
        "messages": messages,
        // "temperature": 0.6,
        "max_tokens": 6000,
        "stream": false,
        "reasoning_effort": "low"
      };

      console.log('=== AI分析API请求体信息 ===');
      console.log('模型:', apiRequestBody.model);
      console.log('温度:', apiRequestBody.temperature);
      console.log('最大token:', apiRequestBody.max_tokens);
      console.log('消息数量:', apiRequestBody.messages.length);
      console.log('是否包含五行分析:', hasElementRelations);

      response = await fetch("https://api.wlai.vip/v1/chat/completions", {
        "method": "POST",
        "headers": {
          "Authorization": `Bearer sk-I2k4ljIyMKeL5Yt04CXJ8eeKy8Qlk9RXqcPTFmltdogYmNpd`,
          "Content-Type": "application/json"
        },
        "body": JSON.stringify(apiRequestBody)
      });
    } else if (model.startsWith('gpt-5') || model === 'gpt-5-2025-08-07') {
      // --- 新增分支 5: 调用 GPT-5 API (不支持 temperature 参数) ---
      console.log(`正在调用 GPT-5 API 进行AI分析（模型：${model}）...`);
      const apiRequestBody = {
        "model": model,
        "messages": messages,
        "max_tokens": 8000,
        "stream": false,
        "reasoning_effort": "low"
        // 移除 temperature 参数
      };
      console.log('=== AI分析API请求体信息 ===');
      console.log('模型:', apiRequestBody.model);
      console.log('温度: 默认值 1 (GPT-5 不支持自定义)');
      console.log('最大token:', apiRequestBody.max_tokens);
      console.log('消息数量:', apiRequestBody.messages.length);
      console.log('是否包含五行分析:', hasElementRelations);
      response = await fetch("https://api.wlai.vip/v1/chat/completions", {
        "method": "POST",
        "headers": {
          "Authorization": `Bearer sk-I2k4ljIyMKeL5Yt04CXJ8eeKy8Qlk9RXqcPTFmltdogYmNpd`,
          "Content-Type": "application/json"
        },
        "body": JSON.stringify(apiRequestBody)
      });
    } else {
      // --- 分支 5: 默认调用云雾 API (或其他 OpenAI 兼容 API) ---
      console.log(`正在调用云雾 API进行AI分析（模型：${model}）...`);

      const apiRequestBody = {
        "model": model,
        "messages": messages,
        "temperature": 0.6,
        "max_tokens": 10000,
        "stream": false,
        "reasoning_effort": "low"  // 添加思考参数
      };

      console.log('=== AI分析API请求体信息 ===');
      console.log('模型:', apiRequestBody.model);
      console.log('温度:', apiRequestBody.temperature);
      console.log('最大token:', apiRequestBody.max_tokens);
      console.log('消息数量:', apiRequestBody.messages.length);
      console.log('是否包含五行分析:', hasElementRelations);

      response = await fetch("https://api.wlai.vip/v1/chat/completions", {
        "method": "POST",
        "headers": {
          "Authorization": `Bearer sk-I2k4ljIyMKeL5Yt04CXJ8eeKy8Qlk9RXqcPTFmltdogYmNpd`,
          "Content-Type": "application/json"
        },
        "body": JSON.stringify(apiRequestBody)
      });
    }

    // ========================================================================
    // ===== 统一处理 API 响应 =====
    // ========================================================================

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 错误响应:', errorText);
      throw new Error(`API 错误! status: ${response.status}, response: ${errorText}`);
    }

    data = await response.json();
    console.log('API 调用成功');
    console.log('\n=== API返回的原始数据 ===');
    console.log(JSON.stringify(data, null, 2));

    let assistantMessage;
    let reasoningContent = null;

    // 根据模型解析不同的响应体
    if (model.startsWith('gemini')) {
      /* 你实际走的是 OpenAI-兼容中转，返回结构与 OpenAI 相同，
         因此直接复用通用解析即可，无需 Google 原格式判断 */
      if (!data.choices || !data.choices[0] || typeof data.choices[0].message?.content !== 'string') {
        const finish = data.choices?.[0]?.finish_reason || '未知';
        throw new Error(`Gemini 返回内容异常，finish_reason=${finish}`);
      }
      assistantMessage = data.choices[0].message.content;
    }
    else if (model === 'deepseek-v3-1-250821' || model.startsWith('doubao-') || model.includes('doubao')) {
      // 解析 DeepSeek Reasoner 和豆包的响应 (都包含思维链)
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error(`${model.includes('doubao') ? '豆包' : 'deepseek-v3-1-250821'} API 响应格式异常`);
      }

      // 获取思维链内容和最终回答
      reasoningContent = data.choices[0].message.reasoning_content;
      assistantMessage = data.choices[0].message.content;

      // 打印思维链内容
      if (reasoningContent) {
        console.log(`\n=== ${model.includes('doubao') ? '豆包' : 'DeepSeek'} 思维链内容 ===`);
        console.log(reasoningContent);
        console.log('=========================\n');
      }
    } else {
      // 解析 OpenAI 兼容的响应 (包括 GLM 和默认 API)
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('OpenAI 兼容 API 响应格式异常');
      }
      assistantMessage = data.choices[0].message.content;
    }

    // 打印AI的回复内容
    console.log('\n=== AI分析回复内容 ===');
    console.log(assistantMessage);
    console.log('=========================\n');

    // 返回AI分析结果
    const responseData = {
      content: assistantMessage
    };

    // 如果是支持思维链的模型，同时返回思维链内容
    if ((model === 'deepseek-reasoner' || model.startsWith('doubao-') || model.includes('doubao')) && reasoningContent) {
      responseData.reasoning_content = reasoningContent;
      responseData.has_reasoning = true;
    }

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI分析处理请求时出错:', error);
    return new Response(JSON.stringify({
      error: 'AI分析处理失败',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}








