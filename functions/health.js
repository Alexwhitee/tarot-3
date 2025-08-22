// // 健康检查端点
// export async function onRequestGet({ request, env }) {
//   return new Response(JSON.stringify({
//     status: 'ok',
//     timestamp: new Date().toISOString(),
//     mode: 'separated-analysis-with-model-selection',
//     endpoints: {
//       divination: '/api (生成卡牌结果)',
//       aiAnalysis: '/ai-analysis (AI分析)',
//       models: '/models (获取模型列表)'
//     }
//   }), {
//     headers: { 'Content-Type': 'application/json' }
//   });
// }
