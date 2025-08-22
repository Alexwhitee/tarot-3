// 获取支持的模型列表的端点
export async function onRequestGet({ request, env }) {
  return new Response(JSON.stringify({
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
        key: 'claude-sonnet-4-20250514-thinking',
        name: 'claude-sonnet-4-thinking',
        description: 'Anthropic思维链模型，深度推理'
      },
      {
        key: 'gpt-4.1-nano-2025-04-14',
        name: 'GPT-4.1 Nano',
        description: 'OpenAI轻量级模型，快速响应 (价格: 0.4)'
      },
      {
        key: 'claude-3-haiku-20240307',
        name: 'Claude-3 Haiku',
        description: 'Anthropic快速模型，简洁高效 (价格: 1.25)'
      },
      {
        key: 'gemini-2.0-flash',
        name: 'Gemini-2.0 Flash',
        description: 'Google新一代快速模型 (价格: 0.4)'
      },
      {
        key: 'qwen-turbo-1101',
        name: 'Qwen Turbo',
        description: '阿里通义千问加速版 (价格: 0.6)'
      }
    ]
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
