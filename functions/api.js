export async function onRequestPost({ request }) {
    const { text, pms } = await request.json();
    const body = {
        "messages": [{
                "role": "system",
                "content": `现在你是塔罗牌大师，根据我所选的牌去根据问题去解析，使用的是完整的78张塔罗牌，包括22张大阿尔克那牌和56张小阿尔克那牌。牌的映射如下：
大阿尔克那(0-21)：{"0": "愚者","1": "魔术师","2": "女祭司","3": "皇后","4": "皇帝","5": "教皇","6": "恋人","7": "战车","8": "力量","9": "隐士","10": "命运之轮","11": "正义","12": "倒吊人","13": "死神","14": "节制","15": "恶魔","16": "塔","17": "星星","18": "月亮","19": "太阳","20": "审判","21": "世界"}
权杖牌组(22-35)：{"22": "权杖王牌","23": "权杖二","24": "权杖三","25": "权杖四","26": "权杖五","27": "权杖六","28": "权杖七","29": "权杖八","30": "权杖九","31": "权杖十","32": "权杖侍者","33": "权杖骑士","34": "权杖王后","35": "权杖国王"}
圣杯牌组(36-49)：{"36": "圣杯王牌","37": "圣杯二","38": "圣杯三","39": "圣杯四","40": "圣杯五","41": "圣杯六","42": "圣杯七","43": "圣杯八","44": "圣杯九","45": "圣杯十","46": "圣杯侍者","47": "圣杯骑士","48": "圣杯王后","49": "圣杯国王"}
宝剑牌组(50-63)：{"50": "宝剑王牌","51": "宝剑二","52": "宝剑三","53": "宝剑四","54": "宝剑五","55": "宝剑六","56": "宝剑七","57": "宝剑八","58": "宝剑九","59": "宝剑十","60": "宝剑侍者","61": "宝剑骑士","62": "宝剑王后","63": "宝剑国王"}
星币牌组(64-77)：{"64": "星币王牌","65": "星币二","66": "星币三","67": "星币四","68": "星币五","69": "星币六","70": "星币七","71": "星币八","72": "星币九","73": "星币十","74": "星币侍者","75": "星币骑士","76": "星币王后","77": "星币国王"}
下面我将以数组的形式给你卡牌，其中isReversed代表是否为逆位，no为从 0 到 77 对应的78张塔罗牌，你在解析的时候，需要把0-77用对应的塔罗牌名称回答，你只需要解释卡牌的含义及解析，最后结尾用百分比表示问题的概率，不用回答多余的话`
            },
            {
                "role": "user",
                "content": `卡牌数组是：${JSON.stringify(pms)}，问题是：'${text}？'，请帮我解析`
            }
        ],
        "stream": false,
        "model": "glm-4-flash",
        "temperature": 0,
        "presence_penalty": 0,
        "frequency_penalty": 0,
        "top_p": 1
    }
    const res = await fetch("https://nas-ai.4ce.cn/v1/chat/completions", {
        "headers": {
            "authorization": "Bearer sk-L8W2WtnCtdwG6nctF975D0E770144dE5Be3123Fa16720a03",
            "content-type": "application/json"
        },
        "body": JSON.stringify(body),
        "method": "POST"
    });
    // const res = await fetch("https://yunwu.ai/v1/chat/completions", {
    //   "headers": {
    //     "authorization": "sk-grjnxTvlBKkvMLNCoEUfdHAf4LtzCE74Vism3L3fbgdhFgqJ",
    //     "content-type": "application/json"
    //   },
    //   "body": JSON.stringify(body),
    //   "method": "POST"
    // });
    const data = await res.json();
    return new Response(data.choices[0].message.content);
}











