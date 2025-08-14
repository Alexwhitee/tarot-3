<!--<template>-->
<!--  <section class="Home">-->
<!--    <div class="text">-->
<!--      <h3>深呼吸，屏除杂念，集中注意力，默念你的问题，开始你的塔罗占卜之旅</h3>-->
<!--      <Textarea-->
<!--        v-model.trim="textValue"-->
<!--        placeholder="你要占卜的问题（可选）"-->
<!--        :disabled="loadingStatus"-->
<!--      />-->
<!--    </div>-->

<!--    <template v-if="!loadingStatus">-->
<!--      &lt;!&ndash; 固定牌阵信息条 &ndash;&gt;-->
<!--      <div class="hover-info-wrapper">-->
<!--        <div class="spread-info-bar" v-if="clickedSpread">-->
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
<!--        </div>-->
<!--      </div>-->

<!--      &lt;!&ndash; 牌阵选择区 &ndash;&gt;-->
<!--      <div class="spread-selection">-->
<!--        <h3 class="text nb">选择牌阵（必须）</h3>-->
<!--        <div class="spread-list">-->
<!--          <div-->
<!--            v-for="s in spreads"-->
<!--            :key="s.key"-->
<!--            class="spread-card"-->
<!--            :class="{ active: selectedSpreadKey === s.key }"-->
<!--            @click="() => {-->
<!--              selectedSpreadKey = s.key;-->
<!--              clickedSpread = s;-->
<!--            }"-->
<!--          >-->
<!--            <div class="spread-header">-->
<!--              <span class="spread-name">{{ s.name }}</span>-->
<!--              <span class="spread-count">（{{ s.count }}张）</span>-->
<!--            </div>-->
<!--            <p class="spread-desc">{{ s.desc }}</p>-->
<!--          </div>-->
<!--        </div>-->

<!--        <Button-->
<!--          class="mt-4 w-full"-->
<!--          :disabled="!selectedSpreadKey || isSpreadConfirmed"-->
<!--          @click="confirmSpread"-->
<!--        >-->
<!--          确认牌阵-->
<!--        </Button>-->
<!--      </div>-->

<!--      &lt;!&ndash; 已选牌阵信息 &ndash;&gt;-->
<!--      <div class="selected-spread-info" v-if="isSpreadConfirmed">-->
<!--        当前牌阵：{{ selectedSpread.name }}（需 {{ selectedCardCount }} 张） |-->
<!--        已选：{{ selectCardArr.length }} 张-->
<!--      </div>-->

<!--      &lt;!&ndash; 抽牌区 &ndash;&gt;-->
<!--      <div class="card-list" v-if="isSpreadConfirmed && !resStatus">-->
<!--        <div-->
<!--          class="card"-->
<!--          v-for="i in randomCard"-->
<!--          :key="i"-->
<!--          :style="{ marginRight: cardMargin + 'px' }"-->
<!--          @click="selectCard(i)"-->
<!--          :class="{ active: selectCardArr.includes(i) }"-->
<!--        ></div>-->
<!--      </div>-->

<!--      &lt;!&ndash; 是否带逆位开关 &ndash;&gt;-->
<!--      <div class="mt-2">-->
<!--        <label>-->
<!--          <input type="checkbox" v-model="needReversed" /> 是否带逆位-->
<!--        </label>-->
<!--      </div>-->

<!--      &lt;!&ndash; 开始占卜按钮 &ndash;&gt;-->
<!--      <div class="btn">-->
<!--        <Button-->
<!--          class="mt-4 w-full"-->
<!--          :disabled="selectCardArr.length !== selectedCardCount"-->
<!--          @click="getRes"-->
<!--        >-->
<!--          开始占卜-->
<!--        </Button>-->
<!--      </div>-->
<!--    </template>-->

<!--    &lt;!&ndash; 占卜结果 &ndash;&gt;-->
<!--    <div class="card-jx" v-else>-->
<!--      <div class="show-card">-->
<!--        <div class="card-item" v-for="(i, index) in cardResult" :key="i.no">-->
<!--          <img :class="{ rever: i.isReversed }" :src="renderIMG(`${i.no}.jpg`)"/>-->
<!--          <div class="card-label">-->
<!--            （{{ index + 1 }}）{{ selectedSpread.positions?.[index] ?? `第${index + 1}张` }}-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      <Alert class="mt-4" v-if="resStatus">-->
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
<!--import vh from 'vh-plugin'-->
<!--import { marked } from 'marked'-->
<!--import Typed from 'typed.js'-->
<!--import { Button } from '@/components/ui/button'-->
<!--import { Textarea } from '@/components/ui/textarea'-->
<!--import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'-->

<!--type Spread = {-->
<!--  key: string-->
<!--  name: string-->
<!--  count: number-->
<!--  positions?: string[]-->
<!--  desc?: string-->
<!--  usage?: string-->
<!--}-->

<!--type CardResult = { no: number; isReversed: boolean }-->

<!--const spreads = ref<Spread[]>([-->
<!--  { key: 'one', name: '单张指引', count: 1, positions: ['指引'], desc: '快速指引，适合简单问题', usage: '适合日常小问题或需要直接指引时使用' },-->
<!--  { key: 'two', name: '双牌对比', count: 2, positions: ['现状','对策'], desc: '简洁对比，快速决策', usage: '在两难选择或需立即行动前使用' },-->
<!--  { key: 'three', name: '三张牌阵', count: 3, positions: ['过去','现在','未来'], desc: '经典三牌占卜', usage: '用于了解事件发展脉络及未来趋势' },-->
<!--])-->

<!--const selectedSpreadKey = ref<Spread['key']>('')-->
<!--const isSpreadConfirmed = ref(false)-->
<!--const clickedSpread = ref<Spread | null>(null)-->
<!--const needReversed = ref(true) // 是否带逆位开关-->

<!--// 当前选中牌阵-->
<!--const selectedSpread = computed(() =>-->
<!--  spreads.value.find(s => s.key === selectedSpreadKey.value)!-->
<!--)-->
<!--const selectedCardCount = computed(() =>-->
<!--  isSpreadConfirmed.value ? (selectedSpread.value?.count ?? 0) : 0-->
<!--)-->

<!--// 切换牌阵时清空已选卡牌-->
<!--const selectCardArr = ref<number[]>([])-->
<!--watch(selectedSpreadKey, () => { selectCardArr.value = [] })-->

<!--// 随机卡牌-->
<!--const randomCard = ref<number[]>(Array.from({ length: 78 }, (_, i) => i))-->
<!--for (let i = randomCard.value.length - 1; i > 0; i&#45;&#45;) {-->
<!--  const j = Math.floor(Math.random() * (i + 1))-->
<!--  ;[randomCard.value[i], randomCard.value[j]] = [randomCard.value[j], randomCard.value[i]]-->
<!--}-->

<!--// 每张牌间距-->
<!--const cardMargin = 20-->

<!--const selectCard = (id: number) => {-->
<!--  if (selectCardArr.value.includes(id)) {-->
<!--    selectCardArr.value = selectCardArr.value.filter(i => i !== id)-->
<!--    return-->
<!--  }-->
<!--  if (selectCardArr.value.length >= selectedCardCount.value) return-->
<!--  selectCardArr.value.push(id)-->
<!--}-->

<!--const textValue = ref<string>('')-->
<!--const loadingStatus = ref<boolean>(false)-->
<!--const resStatus = ref<boolean>(false)-->

<!--// 新变量存储带逆位信息的结果-->
<!--const cardResult = ref<CardResult[]>([])-->

<!--const confirmSpread = () => {-->
<!--  if (!selectedSpreadKey.value) return-->
<!--  isSpreadConfirmed.value = true-->
<!--  selectCardArr.value = []-->
<!--}-->

<!--const getRes = async () => {-->
<!--  loadingStatus.value = true-->

<!--  // 生成占卜结果-->
<!--  cardResult.value = selectCardArr.value.map(i => ({-->
<!--    no: i,-->
<!--    isReversed: needReversed.value ? Math.random() > 0.5 : false-->
<!--  }))-->

<!--  vh.showLoading()-->
<!--  const res = await fetch('/api', {-->
<!--    method: 'POST',-->
<!--    body: JSON.stringify({-->
<!--      text: textValue.value,-->
<!--      pms: cardResult.value,-->
<!--      spread: {-->
<!--        key: selectedSpread.value.key,-->
<!--        name: selectedSpread.value.name,-->
<!--        count: selectedSpread.value.count,-->
<!--        positions: selectedSpread.value.positions-->
<!--      }-->
<!--    })-->
<!--  })-->
<!--  vh.hideLoading()-->
<!--  resStatus.value = true-->
<!--  const resText = await res.text()-->
<!--  renderRES(resText)-->
<!--}-->

<!--const typedText = ref<HTMLParagraphElement>()-->
<!--let typedInstance: Typed | null = null-->
<!--const renderRES = async (md: string) => {-->
<!--  const renderedMarkdown = await marked.parse(md)-->
<!--  if (typedInstance) typedInstance.destroy()-->
<!--  typedInstance = new Typed(typedText.value!, { strings: [renderedMarkdown], typeSpeed: 16, showCursor: false, contentType: 'html' })-->
<!--}-->

<!--const resetFn = () => {-->
<!--  selectCardArr.value = []-->
<!--  cardResult.value = []-->
<!--  resStatus.value = false-->
<!--  loadingStatus.value = false-->
<!--  isSpreadConfirmed.value = false-->
<!--  clickedSpread.value = null-->
<!--  for (let i = randomCard.value.length - 1; i > 0; i&#45;&#45;) {-->
<!--    const j = Math.floor(Math.random() * (i + 1))-->
<!--    ;[randomCard.value[i], randomCard.value[j]] = [randomCard.value[j], randomCard.value[i]]-->
<!--  }-->
<!--  textValue.value = ''-->
<!--  needReversed.value = true-->
<!--  if (typedInstance) {-->
<!--    typedInstance.destroy()-->
<!--    typedInstance = null-->
<!--  }-->
<!--}-->

<!--const renderIMG = (url: string) => new URL(`../../assets/images/card/${url}`, import.meta.url).href-->
<!--</script>-->

<!--<style scoped lang="less">-->
<!--@import 'Home.less';-->

<!--.hover-info-wrapper { height: 140px; margin-bottom: 12px; }-->
<!--.spread-info-bar { position: relative; background: #fff8f0; padding: 6px; border-radius: 4px; }-->

<!--.spread-selection { margin-bottom: 24px; .spread-list { display: flex; flex-wrap: wrap; gap: 12px; } }-->
<!--.spread-card { background: #fdf6f0; border: 1px solid #ccc; border-radius: 8px; padding: 12px; width: 200px; cursor: pointer; transition: all 0.2s;-->
<!--  .spread-header { font-weight: bold; margin-bottom: 6px; }-->
<!--  &:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }-->
<!--  &.active { border-color: #f39c12; box-shadow: 0 0 0 3px rgba(243,156,18,0.2); }-->
<!--}-->

<!--.selected-spread-info { margin-top: 12px; font-size: 14px; color: #444; }-->

<!--.card-list { display: flex; flex-wrap: wrap; margin-top: 12px; }-->
<!--.card { width: 80px; height: 120px; background: #ccc; border-radius: 4px; cursor: pointer; margin-bottom: 12px; transition: all 0.2s; }-->
<!--.card.active { border: 2px solid #f39c12; }-->

<!--.show-card { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }-->
<!--.card-item { display: flex; flex-direction: column; align-items: center; }-->
<!--.card-item img { width: 100px; height: auto; }-->
<!--.card-label { margin-top: 4px; font-size: 14px; color: #666; }-->

<!--@media (max-width: 768px) {-->
<!--  .spread-list { flex-direction: column; }-->
<!--  .spread-card { width: 100%; }-->
<!--  .card-item img { width: min(22vw, 90px); }-->
<!--  .card-label { font-size: 12px; }-->
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
          <p><strong>{{ clickedSpread.name }}（{{ clickedSpread.count }}张）</strong></p>
          <p>{{ clickedSpread.desc }}</p>
          <p>适用场景：{{ clickedSpread.usage }}</p>
          <p>
            <strong>牌位含义：</strong>
            <span v-for="(pos, index) in clickedSpread.positions" :key="pos">
              （{{ index + 1 }}）{{ pos }}
              <span v-if="index < clickedSpread.positions.length - 1"> </span>
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
          v-for="i in shuffledDeck"
          :key="i"
          :style="{ marginRight: cardMargin + 'px' }"
          @click="selectCard(i)"
          :class="{ active: selectCardArr.includes(i) }"
        ></div>
      </div>

      <!-- 是否带逆位开关 -->
      <div class="mt-2">
        <label>
          <input type="checkbox" v-model="needReversed" /> 是否带逆位
        </label>
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
        <div class="card-item" v-for="(i, index) in cardResult" :key="i.no">
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

type CardResult = { no: number; isReversed: boolean }

const spreads = ref<Spread[]>([
  { key: 'one', name: '单张指引', count: 1, positions: ['指引'], desc: '快速指引，适合简单问题', usage: '适合日常小问题或需要直接指引时使用' },
  { key: 'two', name: '双牌对比', count: 2, positions: ['现状','对策'], desc: '简洁对比，快速决策', usage: '在两难选择或需立即行动前使用' },
  { key: 'three', name: '三张牌阵', count: 3, positions: ['过去','现在','未来'], desc: '经典三牌占卜', usage: '用于了解事件发展脉络及未来趋势' },
])

const selectedSpreadKey = ref<Spread['key']>('')
const isSpreadConfirmed = ref(false)
const clickedSpread = ref<Spread | null>(null)
const needReversed = ref(true) // 是否带逆位开关

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

// 随机卡牌顺序（一次初始化或重置）
const shuffledDeck = ref<number[]>([])
const initShuffledDeck = () => {
  shuffledDeck.value = Array.from({ length: 78 }, (_, i) => i)
  for (let i = shuffledDeck.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledDeck.value[i], shuffledDeck.value[j]] = [shuffledDeck.value[j], shuffledDeck.value[i]]
  }
}
initShuffledDeck()

const cardMargin = 20
const cardResult = ref<CardResult[]>([])

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
const typedText = ref<HTMLParagraphElement>()
let typedInstance: Typed | null = null

const confirmSpread = () => {
  if (!selectedSpreadKey.value) return
  isSpreadConfirmed.value = true
  selectCardArr.value = []
}

const getRes = async () => {
  if (cardResult.value.length) return // 已生成结果，不重复生成
  loadingStatus.value = true

  // 生成占卜结果
  cardResult.value = selectCardArr.value.map(i => ({
    no: i,
    isReversed: needReversed.value ? Math.random() > 0.5 : false
  }))

  vh.showLoading()
  const res = await fetch('/api', {
    method: 'POST',
    body: JSON.stringify({
      text: textValue.value,
      pms: cardResult.value,
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

const renderRES = async (md: string) => {
  const renderedMarkdown = await marked.parse(md)
  if (typedInstance) typedInstance.destroy()
  typedInstance = new Typed(typedText.value!, { strings: [renderedMarkdown], typeSpeed: 16, showCursor: false, contentType: 'html' })
}

const resetFn = () => {
  selectCardArr.value = []
  cardResult.value = []
  resStatus.value = false
  loadingStatus.value = false
  isSpreadConfirmed.value = false
  clickedSpread.value = null
  initShuffledDeck() // 重新随机牌堆
  textValue.value = ''
  needReversed.value = true
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
