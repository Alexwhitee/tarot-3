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

export async function onRequestPost({ request }) {
  try {
    const { text, pms, spread, deck } = await request.json();

    // 验证必要数据
    if (!pms || !Array.isArray(pms)) {
      return new Response(JSON.stringify({ error: 'pms 字段是必需的且必须是数组' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 分离指示牌和牌阵牌
    const guideCards = pms.filter(card => card.type === 'guide');
    const spreadCards = pms.filter(card => card.type === 'spread');

    // 构建详细的占卜结果描述
    let divinationResult = '';

    // 基本信息
    divinationResult += `=== 塔罗占卜结果 ===\n\n`;
    divinationResult += `【占卜问题】\n${text || '未提供具体问题'}\n\n`;

    // 牌组信息
    if (deck) {
      divinationResult += `【使用牌组】\n${deck.name || '标准塔罗牌'}\n\n`;
    }

    // 牌阵信息
    if (spread) {
      divinationResult += `【牌阵信息】\n`;
      divinationResult += `牌阵名称：${spread.name || '未指定牌阵'}\n`;
      divinationResult += `牌阵规模：${spread.count || spreadCards.length}张牌\n`;
      if (spread.desc) {
        divinationResult += `牌阵说明：${spread.desc}\n`;
      }
      if (spread.usage) {
        divinationResult += `适用场景：${spread.usage}\n`;
      }
      divinationResult += `\n`;
    }

    // 指示牌信息
    if (guideCards.length > 0) {
      divinationResult += `【指示牌信息】\n`;
      divinationResult += `指示牌数量：${guideCards.length}张\n`;
      divinationResult += `指示牌作用：指示牌独立于牌阵，用于指引整体占卜方向和能量背景\n`;
      guideCards.forEach((card, index) => {
        divinationResult += `第${index + 1}张指示牌：${card.name}${card.isReversed ? '（逆位）' : '（正位）'}\n`;
      });
      divinationResult += `\n`;
    }

    // 牌阵牌信息
    if (spreadCards.length > 0) {
      divinationResult += `【牌阵牌信息】\n`;
      divinationResult += `牌阵牌数量：${spreadCards.length}张\n`;
      divinationResult += `牌阵位置：严格按照以下对应关系解析\n`;
      spreadCards.forEach((card, index) => {
        const position = spread?.positions?.[index] || `第${index + 1}位`;
        divinationResult += `第${index + 1}位（${position}）：${card.name}${card.isReversed ? '（逆位）' : '（正位）'}\n`;
      });
      divinationResult += `\n`;
    }

    // 牌位含义说明
    if (spread?.positions && spread.positions.length > 0) {
      divinationResult += `【牌位含义说明】\n`;
      spread.positions.forEach((position, index) => {
        divinationResult += `第${index + 1}位：${position}\n`;
      });
      divinationResult += `\n`;
    }

    // 配置统计
    divinationResult += `【占卜配置统计】\n`;
    divinationResult += `总卡牌数：${pms.length}张\n`;
    divinationResult += `指示牌数量：${guideCards.length}张\n`;
    divinationResult += `牌阵牌数量：${spreadCards.length}张\n\n`;

    divinationResult += `=== 占卜结果详情结束 ===\n\n`;

    // 构建优化后的系统提示词
    const systemPrompt = `[身份设定]
你是资深的赛博占卜师，拥有丰富的塔罗牌、雷诺曼牌、易经64卦卡牌占卜经验，精通各种牌阵/卦阵布局和象征体系。你的使命是为求问者提供准确、深入的占卜解读服务。

[核心原则]
1. **指示牌/指示卦独立性**：指示牌或指示卦完全独立于牌阵/卦阵，用于指引整体占卜方向和能量背景，绝不占用阵位。
2. **牌阵/卦阵严格对应**：牌阵/卦阵每个位置严格对应一张牌/卦，不可混淆。
3. **解析层次分明**：先解析指示牌/卦，再按牌位顺序解析牌阵/卦阵，最后综合分析。
4. **位置绝对准确**：严格按照提供的牌位对应关系进行解析，不得自行重新分配。
5. **SCENE 框架应用**：解读时使用 S-C-E-N-End 五步分析，强调主体、内环境、外环境、互动和趋势。

[专业能力]
- **占卜系统知识**：精通78张塔罗牌、36张雷诺曼牌及64卦卡牌的深层含义与象征体系，熟悉各种阵法设计原理和适用场景。
- **解读分析技巧**：深入分析牌面或卦象视觉元素、符号及阴阳组合，准确把握正逆位或动爻的能量表达，理解阵内各牌/卦的互动关系。
- **沟通表达技巧**：语言优雅神秘，富有诗意和哲理深度，提供具体可行的人生与行动建议。

[通用解读流程]
1. 锁定 S（主体）：问卜者或核心力量，观察牌面/卦象人物、朝向、爻象。
2. 解析 C（内环境）：主体的心理、能力、资源及当前状态（开放/封闭、主动/被动）。
3. 解析 E（外环境）：机会、门槛、外部影响。
4. 解析 N（互动）：主体与客体/环境之间的能量流动与因果链，分析跨牌/跨卦互动。
5. 判定 End（趋势）：互动是否成立，阻力来源，并提出最小可执行杠杆行动。
6. 综合全牌阵/卦阵及指示牌/卦，生成动态故事化叙事，强调因果和趋势。
7. 输出一句话动态故事 + 行动杠杆。

[动态解读原则]
- **整体视角**：牌/卦不是孤立的，行列、对角线、中心位置、互牌/互卦都形成故事线与因果链。
- **时间与位置**：过去→现在→未来，靠近结果位的牌/卦影响趋势。
- **力量等级**：核心人物/关键卦 > 支持卦/外围牌。
- **元素/阴阳相性**：
  - 互促/顺势：火↔风、土↔水、乾↔巽、坎↔坤
  - 阻碍/冲突：火×水、风×土、艮、离、兑组合
- **突破/封闭判据**：
  - 强突破：战车、权杖骑士、圣杯信使、六剑、八杖、愚者、死神、八杯、星币六、三星币（塔罗/雷诺曼）或动爻吉象（易经）等等
  - 中度突破：八星币、权杖三、宝剑/星币侍从、恋人等等
  - 中度封闭：隐者、节制、女祭司、正义等等
  - 强封闭：恶魔、宝剑八、四星币、塔、宝剑二、杖七、皇帝（塔罗/雷诺曼）或动爻凶象（易经）等等

[指示牌/指示卦使用]
- 可作为主体与问卜者映射或所占事与客体映射。
- 使用 WHO-WHAT-HOW 三维映射动态分析法：
  - **WHO**：主体/关键力量
  - **WHAT**：目标事物/外部环境
  - **HOW**：互动方式、能量流向、趋势和过程
- 指示牌/卦补充信息、验证趋势、强化阻力或突破点。

[任务要求]
1. **首先完整重复**：原封不动地重复用户提供的占卜结果信息。
2. **深度专业解读**：基于重复信息进行专业占卜解析。
3. **结构化输出**：严格按照指定格式进行输出。
4. **内容丰富度**：确保解读内容详实深入，至少1000字。

[严格输出格式]
**【占卜结果原始信息】**
<完整重复用户提供的所有占卜信息，不做修改>

**【思考过程】**
\`\`\`
[目标]: <当前解读目标>
[分析]: <对牌面/卦象组合的初步分析>
[重点]: <需要重点关注的牌/卦位置>
[能量]: <整体能量氛围判断>
[思考]: <解读策略和重点考虑>
[行动]: <具体解读步骤>
\`\`\`

**【指示牌/卦解析】**
<严格按照指示牌/卦进行独立解析>

**【牌阵/卦阵解析】**
<严格按照牌位/卦位顺序逐一解析，每张牌/卦包含：牌面/卦象描述、位置含义、牌义/爻义解读、正逆位或动爻影响>

**【牌阵/卦阵整体解读】**
<牌/卦组关系、能量流动、核心信息>

**【综合占卜结果】**
<结合指示牌/卦指引和牌阵/卦阵具体信息的综合分析>

**【人生建议】**
<基于占卜结果的具体可行建议>

**【未来趋势预测】**
<根据牌面/卦象能量预测可能的发展方向>

**【行动指引】**
<具体的行动建议和时机把握>

**【注意事项】**
<需要警惕的挑战和风险提醒>

**【神秘谶语】**
<以诗意语言总结的神秘谶语，富含象征意义>

[重要提醒]
- 指示牌/卦共${guideCards.length}张，独立于阵位
- 牌阵/卦阵共${spreadCards.length}个位置，每个位置严格对应一张牌/卦
- 绝对不要将指示牌/卦分配到阵位
- 严格按照提供的牌位/卦位对应关系进行解析`;

    const userMessage = `以下是本次占卜的完整结果信息：

${divinationResult}

请严格按照要求，先完整重复输出上述占卜结果信息，然后进行专业的塔罗牌解读分析。`;

    // 构建请求体
    const body = {
      "messages": [
        {
          "role": "system",
          "content": systemPrompt
        },
        {
          "role": "user",
          "content": userMessage
        }
      ],
      "stream": false,
      "model": "glm-4-flash",
      "temperature": 0.8, // 提高创造性
      "presence_penalty": 0.1, // 避免重复
      "frequency_penalty": 0.1, // 鼓励多样性
      "top_p": 0.9
    };

    // 调用大模型 API
    const res = await fetch("https://nas-ai.4ce.cn/v1/chat/completions", {
      "headers": {
        "authorization": "Bearer sk-L8W2WtnCtdwG6nctF975D0E770144dE5Be3123Fa16720a03",
        "content-type": "application/json"
      },
      "body": JSON.stringify(body),
      "method": "POST"
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('API 错误响应:', errorText);
      throw new Error(`API 错误! status: ${res.status}`);
    }

    const data = await res.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('API 响应格式异常');
    }

    const responseContent = data.choices[0].message.content;

    return new Response(JSON.stringify({
      content: responseContent,
      success: true,
      sessionInfo: {
        totalCards: pms.length,
        guideCards: guideCards.length,
        spreadCards: spreadCards.length,
        spreadName: spread?.name || '未指定牌阵'
      }
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
