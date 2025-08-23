// 获取支持的模型列表的端点
export async function onRequestGet({ request, env }) {
  return new Response(JSON.stringify({
    models: [
      {
        key: 'glm-4-flash',
        name: 'GLM-4 Flash',
        description: '智谱超快响应模型'
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
        key: 'glm-4.5-flash',
        name: 'GLM-4.5-Flash',
        description: '智谱最新响应模型'
      },
      {
        key: 'doubao-seed-1-6-250615',
        name: 'Doubao Seed',
        description: '字节豆包种子模型'
      },
      {
        key: 'deepseek-v3-1-250821',
        name: 'DeepSeek-V3.1',
        description: 'DeepSeek第三代增强模型'
      }
    ]
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
