<!--<template>-->
<!--  <section class="Home">-->
<!--    &lt;!&ndash; 输入问题 &ndash;&gt;-->
<!--    <div class="text">-->
<!--      <h3>深呼吸，屏除杂念，集中注意力，默念你的问题，开始塔罗占卜之旅</h3>-->
<!--      <Textarea-->
<!--        v-model.trim="textValue"-->
<!--        placeholder="你要占卜的问题（必须）"-->
<!--        :disabled="loadingStatus"-->
<!--      />-->
<!--    </div>-->

<!--    &lt;!&ndash; 牌阵选择区 &ndash;&gt;-->
<!--    <template v-if="!loadingStatus && !isSpreadConfirmed">-->
<!--      <p class="tips">当前选中：{{ selectedSpread.name }}（需 {{ selectedCardCount }} 张）</p>-->

<!--      <div class="spread-selection">-->
<!--        <h3 class="text nb">选择牌阵（必须）</h3>-->

<!--        <div class="spread-list">-->
<!--          <div-->
<!--            v-for="s in spreads"-->
<!--            :key="s.key"-->
<!--            class="spread-card"-->
<!--            :class="{ active: selectedSpreadKey === s.key }"-->
<!--            @click="selectedSpreadKey = s.key"-->
<!--          >-->
<!--            <div class="spread-header">-->
<!--              <span class="spread-name">{{ s.name }}</span>-->
<!--              <span class="spread-count">（{{ s.count }}张）</span>-->
<!--            </div>-->
<!--            <p class="spread-desc">{{ s.desc }}</p>-->

<!--            &lt;!&ndash; 鼠标悬停 / 点击显示详情 &ndash;&gt;-->
<!--            <div class="spread-details" @click.stop>-->
<!--              <p><strong>适用场景：</strong>{{ s.usage }}</p>-->
<!--              <p><strong>牌位含义：</strong></p>-->
<!--              <ul>-->
<!--                <li v-for="(pos, idx) in s.positions || []" :key="idx">{{ pos }}</li>-->
<!--              </ul>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; 确认牌阵按钮 &ndash;&gt;-->
<!--        <Button class="mt-4 w-full" :disabled="!selectedSpreadKey" @click="confirmSpread">-->
<!--          确定牌阵-->
<!--        </Button>-->
<!--      </div>-->
<!--    </template>-->

<!--    &lt;!&ndash; 抽牌区 &ndash;&gt;-->
<!--    <div class="card-list" v-if="isSpreadConfirmed">-->
<!--      <div-->
<!--        class="card"-->
<!--        :class="{ active: selectCardArr.includes(i) }"-->
<!--        v-for="i in randomCard"-->
<!--        :key="i"-->
<!--        @click="selectCard(i)"-->
<!--      ></div>-->

<!--      <div class="btn">-->
<!--        <Button-->
<!--          class="mt-4 w-full"-->
<!--          :disabled="selectCardArr.length !== selectedCardCount || !textValue"-->
<!--          @click="getRes"-->
<!--        >-->
<!--          开始占卜-->
<!--        </Button>-->
<!--      </div>-->
<!--    </div>-->

<!--    &lt;!&ndash; 占卜结果 &ndash;&gt;-->
<!--    <div class="card-jx" v-if="resStatus">-->
<!--      <div class="show-card">-->
<!--        <div class="card-item" v-for="(i, index) in selectCardArr" :key="i.no">-->
<!--          <img :class="{ rever: i.isReversed }" :src="renderIMG(`${i.no}.jpg`)" />-->
<!--          <div class="card-label">-->
<!--            {{ selectedSpread.positions?.[index] ?? `第${index + 1}张` }}-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      <Alert class="mt-4">-->
<!--        <AlertTitle>塔罗牌解析：</AlertTitle>-->
<!--        <AlertDescription>-->
<!--          <p class="[&>p]:indent-8 [&>p]:pt-2" ref="typedText"></p>-->
<!--        </AlertDescription>-->
<!--      </Alert>-->
<!--      <Button class="mt-4 ml-auto block w-max" @click="resetFn">重新开始</Button>-->
<!--    </div>-->

<!--  </section>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { ref, computed, watch } from 'vue'-->
<!--import { Button } from '@/components/ui/button'-->
<!--import { Textarea } from '@/components/ui/textarea'-->
<!--import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'-->
<!--import { marked } from 'marked'-->
<!--import Typed from 'typed.js'-->
<!--import vh from 'vh-plugin'-->

<!--// 牌阵定义-->
<!--type Spread = {-->
<!--  key: string-->
<!--  name: string-->
<!--  count: number-->
<!--  positions?: string[]-->
<!--  desc?: string-->
<!--  usage?: string-->
<!--}-->
<!--const spreads = ref<Spread[]>([-->
<!--  { key: 'one',           name: '单张指引',      count: 1,  positions: ['指引'], desc: '快速指引，适合简单问题', usage: '适合日常小问题或需要直接指引时使用' },-->
<!--  { key: 'two',           name: '双牌对比',      count: 2,  positions: ['现状','对策'], desc: '简洁对比，快速决策', usage: '在两难选择或需立即行动前使用' },-->
<!--  { key: 'three',         name: '三张牌阵',      count: 3,  positions: ['过去','现在','未来'], desc: '经典三牌占卜', usage: '用于了解事件发展脉络及未来趋势' },-->
<!--  { key: 'mind-body',     name: '身心灵',        count: 3,  positions: ['身体','心理','精神'], desc: '检视身心灵平衡', usage: '关注健康或内在状态时' },-->
<!--  { key: 'situation',     name: '局势透视',      count: 3,  positions: ['问题','原因','建议'], desc: '聚焦问题核心与解决路径', usage: '遇到瓶颈或需要理清思路时' },-->
<!--  { key: 'cross',         name: '十字牌阵',      count: 5,  positions: ['现状','阻碍','潜意识','显意识','建议'], desc: '适合分析复杂问题', usage: '分析问题的现状、障碍和潜在机会' },-->
<!--  { key: 'star',          name: '五星运势',      count: 5,  positions: ['自我','环境','希望','恐惧','结果'], desc: '透视个人与环境的互动', usage: '评估长期计划或人际关系走向' },-->
<!--  { key: 'path',          name: '抉择之路',      count: 5,  positions: ['现状','选择A','选择B','影响因素','结果'], desc: '帮助重大选择', usage: '面临两条或多条道路时权衡利弊' },-->
<!--  { key: 'horseshoe',     name: '马蹄铁',        count: 7,  positions: ['过去','现在','未来','自我','他人','障碍','结果'], desc: '逐层推进的七步解读', usage: '想了解一件事从头到尾的完整走向' },-->
<!--  { key: 'chakra',        name: '七脉轮',        count: 7,  positions: ['顶轮','眉心轮','喉轮','心轮','太阳轮','脐轮','海底轮'], desc: '能量中心诊断', usage: '检查能量失衡或身心不适根源' },-->
<!--  { key: 'week',          name: '一周运势',      count: 7,  positions: ['周一','周二','周三','周四','周五','周六','周日'], desc: '每日指引', usage: '为新的一周设定节奏与重点' },-->
<!--  { key: 'celtic',        name: '凯尔特十字',    count: 10, positions: ['现状','挑战','显意识','潜意识','过去','未来','自我','环境','希望/恐惧','结果'], desc: '全面深入分析', usage: '适合重大决策或复杂情感问题' },-->
<!--  { key: 'year',          name: '年度展望',      count: 12, positions: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'], desc: '全年月度指引', usage: '规划年度目标或提前洞察关键节点' },-->
<!--  { key: 'tree-of-life',  name: '生命之树',      count: 10, positions: ['王冠','智慧','理解','慈悲','严厉','美丽','胜利','荣耀','基础','王国'], desc: '卡巴拉精神路径', usage: '灵性成长或人生使命探索' },-->
<!--  { key: 'astrology',     name: '占星十二宫',    count: 12, positions: ['自我','财富','沟通','家庭','恋爱','健康','伴侣','转化','远行','事业','社群','潜意识'], desc: '对应黄道十二宫', usage: '检视生活各领域平衡与发展' },-->
<!--  { key: 'relationship',  name: '关系动态',      count: 6,  positions: ['你','对方','关系基础','当前状况','潜在问题','未来发展'], desc: '双人关系全景', usage: '恋爱、合作或家庭关系的深度解读' },-->
<!--  { key: 'career',        name: '职业导航',      count: 6,  positions: ['现状','优势','挑战','机遇','行动','前景'], desc: '职业发展专用', usage: '求职、转行或职场瓶颈时使用' },-->
<!--  { key: 'shadow',        name: '内在阴影',      count: 4,  positions: ['意识自我','阴影自我','整合方式','成长礼物'], desc: '探索潜意识阴影', usage: '想克服恐惧、疗愈创伤或深度自我成长' },-->
<!--  { key: 'moon-cycle',    name: '月相周期',      count: 8,  positions: ['新月','眉月','上弦','盈凸','满月','亏凸','下弦','残月'], desc: '跟随月相节奏', usage: '设定月度计划或进行月亮仪式前后' },-->
<!--  { key: 'gypsy',         name: '吉普赛之扇',    count: 5,  positions: ['远过去','近过去','现在','近未来','远未来'], desc: '时间线式解读', usage: '追踪事件或情感的长周期变化' }-->
<!--])-->

<!--// 当前选中牌阵-->
<!--const selectedSpreadKey = ref<Spread['key']>('three')-->
<!--const selectedSpread = computed(() => spreads.value.find(s => s.key === selectedSpreadKey.value)!)-->
<!--const selectedCardCount = computed(() => selectedSpread.value.count)-->

<!--// 控制牌阵确认状态-->
<!--const isSpreadConfirmed = ref(false)-->
<!--const confirmSpread = () => { isSpreadConfirmed.value = true }-->

<!--// 抽牌数据-->
<!--const randomCard = ref<number[]>(Array.from({ length: 78 }, (_, i) => i))-->
<!--for (let i = randomCard.value.length - 1; i > 0; i&#45;&#45;) {-->
<!--  const j = Math.floor(Math.random() * (i + 1))-->
<!--  ;[randomCard.value[i], randomCard.value[j]] = [randomCard.value[j], randomCard.value[i]]-->
<!--}-->

<!--// 用户选择卡牌-->
<!--const selectCardArr = ref<Array<any>>([])-->
<!--const selectCard = (id: number) => {-->
<!--  if (selectCardArr.value.includes(id)) {-->
<!--    selectCardArr.value = selectCardArr.value.filter(i => i !== id)-->
<!--    return-->
<!--  }-->
<!--  if (selectCardArr.value.length >= selectedCardCount.value) return-->
<!--  selectCardArr.value.push(id)-->
<!--}-->

<!--// 占卜-->
<!--const textValue = ref<string>('')-->
<!--const loadingStatus = ref<boolean>(false)-->
<!--const resStatus = ref<boolean>(false)-->
<!--const typedText = ref<HTMLParagraphElement>()-->
<!--let typedInstance: Typed | null = null-->

<!--const getRes = async () => {-->
<!--  loadingStatus.value = true-->
<!--  selectCardArr.value = selectCardArr.value.map(i => ({ no: i, isReversed: Math.random() > 0.5 }))-->
<!--  vh.showLoading()-->
<!--  const res = await fetch('/api', {-->
<!--    method: 'POST',-->
<!--    body: JSON.stringify({-->
<!--      text: textValue.value,-->
<!--      pms: selectCardArr.value,-->
<!--      spread: {-->
<!--        key: selectedSpread.value.key,-->
<!--        name: selectedSpread.value.name,-->
<!--        count: selectedCardCount.value,-->
<!--        positions: selectedSpread.value.positions-->
<!--      }-->
<!--    })-->
<!--  })-->
<!--  vh.hideLoading()-->
<!--  resStatus.value = true-->
<!--  const resText = await res.text()-->
<!--  renderRES(resText)-->
<!--}-->

<!--const renderRES = async (md: string) => {-->
<!--  const renderedMarkdown = await marked.parse(md)-->
<!--  if (typedInstance) typedInstance.destroy()-->
<!--  typedInstance = new Typed(typedText.value!, {-->
<!--    strings: [renderedMarkdown as string],-->
<!--    typeSpeed: 16,-->
<!--    showCursor: false,-->
<!--    contentType: 'html'-->
<!--  })-->
<!--}-->

<!--// 重置-->
<!--const resetFn = async () => {-->
<!--  selectCardArr.value = []-->
<!--  textValue.value = ''-->
<!--  resStatus.value = false-->
<!--  loadingStatus.value = false-->
<!--  isSpreadConfirmed.value = false-->
<!--  for (let i = randomCard.value.length - 1; i > 0; i&#45;&#45;) {-->
<!--    const j = Math.floor(Math.random() * (i + 1))-->
<!--    ;[randomCard.value[i], randomCard.value[j]] = [randomCard.value[j], randomCard.value[i]]-->
<!--  }-->
<!--  if (typedInstance) typedInstance.destroy()-->
<!--  typedInstance = null-->
<!--}-->

<!--// 渲染卡牌图片-->
<!--const renderIMG = (url: string) =>-->
<!--  new URL(`../../assets/images/card/${url}`, import.meta.url).href-->
<!--</script>-->

<!--<style scoped lang="less">-->
<!--@import 'Home.less';-->

<!--/* 牌阵卡片选择 */-->
<!--.spread-selection {-->
<!--  margin-bottom: 24px;-->
<!--  .spread-list {-->
<!--    display: flex;-->
<!--    flex-wrap: wrap;-->
<!--    gap: 12px;-->
<!--  }-->
<!--  .spread-card {-->
<!--    width: 200px;-->
<!--    background: #fdf6f0;-->
<!--    border: 1px solid #ccc;-->
<!--    border-radius: 8px;-->
<!--    padding: 12px;-->
<!--    cursor: pointer;-->
<!--    position: relative;-->
<!--    transition: all 0.2s;-->

<!--    &:hover {-->
<!--      transform: translateY(-4px);-->
<!--      box-shadow: 0 4px 12px rgba(0,0,0,0.15);-->
<!--    }-->
<!--    &.active {-->
<!--      border-color: #f39c12;-->
<!--      box-shadow: 0 0 0 3px rgba(243,156,18,0.2);-->
<!--    }-->

<!--    .spread-header { font-weight: bold; margin-bottom: 6px; }-->
<!--    .spread-name { font-size: 16px; }-->
<!--    .spread-count { font-size: 14px; color: #666; margin-left: 4px; }-->
<!--    .spread-desc { font-size: 13px; color: #555; margin-bottom: 6px; }-->

<!--    /* 浮层 */-->
<!--    .spread-details {-->
<!--      display: none;-->
<!--      position: absolute;-->
<!--      top: -100%;-->
<!--      left: 0;-->
<!--      z-index: 1000;-->
<!--      width: 100%;-->
<!--      background: #fff8f0;-->
<!--      padding: 6px;-->
<!--      border-radius: 4px;-->
<!--      font-size: 12px;-->
<!--      box-shadow: 0 4px 8px rgba(0,0,0,0.1);-->
<!--    }-->
<!--    &:hover .spread-details { display: block; }-->
<!--  }-->
<!--}-->

<!--/* 卡牌列表 */-->
<!--.card-list { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }-->
<!--.card { width: 80px; height: 120px; background: #eee; cursor: pointer; border-radius: 4px; }-->
<!--.card.active { border: 2px solid #f39c12; }-->

<!--/* 抽牌结果 */-->
<!--.show-card { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }-->
<!--.card-item { display: flex; flex-direction: column; align-items: center; }-->
<!--.card-item img { width: 100px; height: auto; }-->
<!--.card-label { margin-top: 4px; font-size: 14px; color: #666; }-->

<!--/* 手机端适配 */-->
<!--@media (max-width: 768px) {-->
<!--  .spread-list { flex-direction: column; }-->
<!--  .spread-card { width: 100%; }-->
<!--  .card-item img { width: min(22vw, 90px); }-->
<!--  .card-label { font-size: 12px; }-->
<!--}-->
<!--@media (max-width: 480px) {-->
<!--  .card-item img { width: min(28vw, 80px); }-->
<!--  .card-label { font-size: 11px; }-->
<!--}-->
<!--</style>-->
<template>
  <section class="Home">
    <div class="text">
      <h3>深呼吸，屏除杂念，集中注意力，默念你的问题，开始你的塔罗占卜之旅</h3>
      <Textarea
        v-model.trim="textValue"
        placeholder="你要占卜的问题（可选）"
        :disabled="loadingStatus"
      />
    </div>

    <template v-if="!loadingStatus">
      <!-- 固定牌阵信息条 -->
      <div class="hover-info-wrapper">
        <div class="spread-info-bar" v-if="clickedSpread">
<!--          <p><strong>{{ clickedSpread.name }}（{{ clickedSpread.count }}张）</strong></p>-->
<!--          <p>{{ clickedSpread.desc }}</p>-->
<!--          <p>适用场景：{{ clickedSpread.usage }}</p>-->
<!--          <p>-->
<!--            <strong>牌位含义：</strong>-->
<!--            <span v-for="(pos, index) in clickedSpread.positions" :key="pos">-->
<!--              （{{ index + 1 }}）{{ pos }}-->
<!--              <span v-if="index < clickedSpread.positions.length - 1"> </span>-->
<!--            </span>-->
<!--          </p>-->

          <p v-if="clickedSpread"><strong>{{ clickedSpread?.name }}（{{ clickedSpread?.count }}张）</strong></p>
          <p v-if="clickedSpread">{{ clickedSpread?.desc }}</p>
          <p v-if="clickedSpread">适用场景：{{ clickedSpread?.usage }}</p>
          <p v-if="clickedSpread">
            <strong>牌位含义：</strong>
            <span v-for="(pos, index) in clickedSpread?.positions || []" :key="index">
    （{{ index + 1 }}）{{ pos }}
    <span v-if="index < (clickedSpread?.positions?.length || 0) - 1"> </span>
  </span>
          </p>

        </div>
      </div>

      <!-- 牌阵选择区 -->
      <div class="spread-selection">
        <h3 class="text nb">选择牌阵（必须）</h3>
        <div class="spread-list">
          <div
            v-for="s in spreads"
            :key="s.key"
            class="spread-card"
            :class="{ active: selectedSpreadKey === s.key }"
            @click="() => {
              selectedSpreadKey = s.key;
              clickedSpread = s;
            }"
          >
            <div class="spread-header">
              <span class="spread-name">{{ s.name }}</span>
              <span class="spread-count">（{{ s.count }}张）</span>
            </div>
            <p class="spread-desc">{{ s.desc }}</p>
          </div>
        </div>

        <Button
          class="mt-4 w-full"
          :disabled="!selectedSpreadKey || isSpreadConfirmed"
          @click="confirmSpread"
        >
          确认牌阵
        </Button>
      </div>



      <!-- 已选牌阵信息 -->
      <div class="selected-spread-info" v-if="isSpreadConfirmed">
        当前牌阵：{{ selectedSpread.name }}（需 {{ selectedCardCount }} 张） |
        已选：{{ selectCardArr.length }} 张
      </div>

      <!-- 抽牌区 -->
      <div class="card-list" v-if="isSpreadConfirmed && !resStatus">
        <div
          class="card"
          v-for="i in randomCard"
          :key="i"
          :style="{ marginRight: cardMargin + 'px' }"
          @click="selectCard(i)"
          :class="{ active: selectCardArr.includes(i) }"
        ></div>
      </div>

      <!-- 开始占卜按钮 -->
      <div class="btn">
        <Button
          class="mt-4 w-full"
          :disabled="selectCardArr.length !== selectedCardCount"
          @click="getRes"
        >
          开始占卜
        </Button>
      </div>
    </template>

    <!-- 占卜结果 -->
    <div class="card-jx" v-else>
      <div class="show-card">
        <div class="card-item" v-for="(i, index) in selectCardArr" :key="i.no">
          <img :class="{ rever: i.isReversed }" :src="renderIMG(`${i.no}.jpg`)"/>
          <div class="card-label">
            （{{ index + 1 }}）{{ selectedSpread.positions?.[index] ?? `第${index + 1}张` }}
          </div>
        </div>
      </div>

      <Alert class="mt-4" v-if="resStatus">
        <AlertTitle>塔罗牌解析：</AlertTitle>
        <AlertDescription>
          <p class="[&>p]:indent-8 [&>p]:pt-2" ref="typedText"></p>
        </AlertDescription>
      </Alert>
      <Button class="mt-4 ml-auto block w-max" @click="resetFn">重新开始</Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import vh from 'vh-plugin'
import { marked } from 'marked'
import Typed from 'typed.js'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type Spread = {
  key: string
  name: string
  count: number
  positions?: string[]
  desc?: string
  usage?: string
}

const spreads = ref<Spread[]>([
  { key: 'one', name: '单张指引', count: 1, positions: ['指引'], desc: '快速指引，适合简单问题', usage: '适合日常小问题或需要直接指引时使用' },
  { key: 'two', name: '双牌对比', count: 2, positions: ['现状','对策'], desc: '简洁对比，快速决策', usage: '在两难选择或需立即行动前使用' },
  { key: 'three', name: '三张牌阵', count: 3, positions: ['过去','现在','未来'], desc: '经典三牌占卜', usage: '用于了解事件发展脉络及未来趋势' },
  // 可继续添加其他牌阵...
])

const selectedSpreadKey = ref<Spread['key']>('')
const isSpreadConfirmed = ref(false)
const clickedSpread = ref<Spread | null>(null)

// 当前选中牌阵
const selectedSpread = computed(() =>
  spreads.value.find(s => s.key === selectedSpreadKey.value)!
)
const selectedCardCount = computed(() =>
  isSpreadConfirmed.value ? (selectedSpread.value?.count ?? 0) : 0
)

// 切换牌阵时清空已选卡牌
const selectCardArr = ref<number[]>([])
watch(selectedSpreadKey, () => { selectCardArr.value = [] })

// 随机卡牌
const randomCard = ref<number[]>(Array.from({ length: 78 }, (_, i) => i))
for (let i = randomCard.value.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1))
  ;[randomCard.value[i], randomCard.value[j]] = [randomCard.value[j], randomCard.value[i]]
}

// 每张牌间距
const cardMargin = 20

const selectCard = (id: number) => {
  if (selectCardArr.value.includes(id)) {
    selectCardArr.value = selectCardArr.value.filter(i => i !== id)
    return
  }
  if (selectCardArr.value.length >= selectedCardCount.value) return
  selectCardArr.value.push(id)
}

const textValue = ref<string>('')
const loadingStatus = ref<boolean>(false)
const resStatus = ref<boolean>(false)

const confirmSpread = () => {
  if (!selectedSpreadKey.value) return
  isSpreadConfirmed.value = true
  selectCardArr.value = []
}

const getRes = async () => {
  loadingStatus.value = true
  selectCardArr.value = selectCardArr.value.map((i) => ({
    no: i,
    isReversed: Math.random() > 0.5
  }))
  vh.showLoading()
  const res = await fetch('/api', {
    method: 'POST',
    body: JSON.stringify({
      text: textValue.value,
      pms: selectCardArr.value,
      spread: {
        key: selectedSpread.value.key,
        name: selectedSpread.value.name,
        count: selectedSpread.value.count,
        positions: selectedSpread.value.positions
      }
    })
  })
  vh.hideLoading()
  resStatus.value = true
  const resText = await res.text()
  renderRES(resText)
}

const typedText = ref<HTMLParagraphElement>()
let typedInstance: Typed | null = null
const renderRES = async (md: string) => {
  const renderedMarkdown = await marked.parse(md)
  if (typedInstance) typedInstance.destroy()
  typedInstance = new Typed(typedText.value!, { strings: [renderedMarkdown], typeSpeed: 16, showCursor: false, contentType: 'html' })
}

const resetFn = () => {
  selectCardArr.value = []
  resStatus.value = false
  loadingStatus.value = false
  isSpreadConfirmed.value = false
  clickedSpread.value = null
  for (let i = randomCard.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[randomCard.value[i], randomCard.value[j]] = [randomCard.value[j], randomCard.value[i]]
  }
  textValue.value = ''
  if (typedInstance) {
    typedInstance.destroy()
    typedInstance = null
  }
}

const renderIMG = (url: string) => new URL(`../../assets/images/card/${url}`, import.meta.url).href
</script>

<style scoped lang="less">
@import 'Home.less';

.hover-info-wrapper { height: 140px; margin-bottom: 12px; }
.spread-info-bar { position: relative; background: #fff8f0; padding: 6px; border-radius: 4px; }

.spread-selection { margin-bottom: 24px; .spread-list { display: flex; flex-wrap: wrap; gap: 12px; } }
.spread-card { background: #fdf6f0; border: 1px solid #ccc; border-radius: 8px; padding: 12px; width: 200px; cursor: pointer; transition: all 0.2s;
  .spread-header { font-weight: bold; margin-bottom: 6px; }
  &:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  &.active { border-color: #f39c12; box-shadow: 0 0 0 3px rgba(243,156,18,0.2); }
}

.selected-spread-info { margin-top: 12px; font-size: 14px; color: #444; }

.card-list { display: flex; flex-wrap: wrap; margin-top: 12px; }
.card { width: 80px; height: 120px; background: #ccc; border-radius: 4px; cursor: pointer; margin-bottom: 12px; transition: all 0.2s; }
.card.active { border: 2px solid #f39c12; }

.show-card { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
.card-item { display: flex; flex-direction: column; align-items: center; }
.card-item img { width: 100px; height: auto; }
.card-label { margin-top: 4px; font-size: 14px; color: #666; }

@media (max-width: 768px) {
  .spread-list { flex-direction: column; }
  .spread-card { width: 100%; }
  .card-item img { width: min(22vw, 90px); }
  .card-label { font-size: 12px; }
}
</style>
