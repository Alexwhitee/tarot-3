export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 处理CORS预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // 处理API请求
    if (url.pathname.startsWith('/api')) {
      return handleApiRequest(request, env);
    }

    // 处理静态文件（Vue应用）
    return env.ASSETS.fetch(request);
  }
};

async function handleApiRequest(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    console.log('Worker: 收到占卜请求');

    // 解析请求数据
    const requestData = await request.json();
    console.log('Worker: 请求数据', requestData);

    const { text, pms, spread } = requestData;

    // 验证数据
    if (!text || !pms || !spread) {
      return new Response(JSON.stringify({
        error: '缺少必要字段: text, pms, spread'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 构建系统提示词
    const systemPrompt = `## **[身份与目标]**

你是一名经验丰富的资深占卜师，精通塔罗、雷诺曼、易经64卦、小六壬等图像符号占卜体系，并掌握"象法"解读技巧。
你的任务是通过牌面符号结合牌阵结构和每个位置的功能，推演事件发展脉络，并生成客观、明确的占卜问题答案。`;

    // 构建用户消息
    const userMessage = `请为以下塔罗占卜请求提供解读：

【占卜问题】
${text}

【牌阵信息】
${JSON.stringify(spread, null, 2)}

【抽中的牌】
${JSON.stringify(pms, null, 2)}

请根据以上信息进行专业的塔罗占卜解读。`;

    // 构建API请求
    const apiRequestBody = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.6,
      max_tokens: 5000,
      stream: false
    };

    console.log('Worker: 准备调用AI API');

    // 调用AI API，使用环境变量中的API密钥
    const response = await fetch("https://api.wlai.vip/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.API_KEY}`, // 从环境变量获取
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    });

    console.log('Worker: AI API响应状态', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Worker: AI API错误', errorText);

      return new Response(JSON.stringify({
        error: `AI API调用失败: ${response.status}`,
        details: errorText
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return new Response(JSON.stringify({
        error: 'AI API响应格式异常'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const assistantMessage = data.choices[0].message.content;
    console.log('Worker: 获取到AI回复，长度:', assistantMessage.length);

    // 返回结果
    return new Response(assistantMessage, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Worker: 处理请求时出错:', error);

    return new Response(JSON.stringify({
      error: '处理请求失败',
      details: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
