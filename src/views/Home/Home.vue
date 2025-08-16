<!--<template>-->
<!--  <section class="Home">-->
<!--    <div class="text">-->
<!--      <h3 class="section-title">1.深呼吸，屏除杂念，集中注意力，写下并默念你的问题，开始你的塔罗占卜之旅</h3>-->
<!--      <Textarea-->
<!--        v-model.trim="textValue"-->
<!--        placeholder="你要占卜的问题（可选）"-->
<!--        :disabled="loadingStatus"-->
<!--      />-->
<!--    </div>-->

<!--    <template v-if="!loadingStatus">-->
<!--      <div class="deck-selection mb-4">-->
<!--        <h3 class="section-title">2.选择塔罗牌种类（必须）</h3>-->
<!--        <div class="deck-list flex gap-4">-->
<!--          <div-->
<!--            v-for="d in decks"-->
<!--            :key="d.key"-->
<!--            class="deck-card p-2 border rounded cursor-pointer"-->
<!--            :class="{ active: selectedDeckKey === d.key }"-->
<!--            @click="selectDeck(d.key)"-->
<!--          >-->
<!--            {{ d.name }}-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="mt-2">-->
<!--        <label>-->
<!--          <input type="checkbox" v-model="needReversed" /> 是否带逆位-->
<!--        </label>-->
<!--      </div>-->


<!--      <div class="mt-2" v-if="selectedSpreadKey">-->
<!--        <label>-->
<!--          <input type="checkbox" v-model="needGuideCards" /> 是否抽指示牌-->
<!--        </label>-->

<!--        <template v-if="needGuideCards">-->
<!--          <label>-->
<!--            抽取指示牌数量：-->
<!--            <input type="number" v-model.number="guideCardCount" min="1" max="10" style="width:50px;" />-->
<!--          </label>-->
<!--        </template>-->
<!--      </div>-->


<!--      <div class="spread-selection" v-if="selectedDeckKey">-->
<!--        <h3 class="section-title">3.选择牌阵（必须）</h3>-->
<!--        <div class="spread-list flex flex-wrap gap-4">-->
<!--          <div-->
<!--            v-for="s in spreads"-->
<!--            :key="s.key"-->
<!--            class="spread-card p-2 border rounded cursor-pointer"-->
<!--            :class="{ active: selectedSpreadKey === s.key }"-->
<!--            @click="() => { selectedSpreadKey = s.key; clickedSpread = s; }"-->
<!--          >-->
<!--            <div class="spread-header font-bold">-->
<!--              <span class="spread-name">{{ s.name }}</span>-->
<!--              <span class="spread-count">（{{ s.count }}张）</span>-->
<!--            </div>-->
<!--            <p class="spread-desc text-sm">{{ s.desc }}</p>-->
<!--          </div>-->
<!--        </div>-->
<!--        <Button class="mt-4 w-full" :disabled="!selectedSpreadKey || isSpreadConfirmed" @click="confirmSpread">-->
<!--          确认牌阵-->
<!--        </Button>-->
<!--      </div>-->

<!--      <div class="hover-info-wrapper mt-4" v-if="clickedSpread">-->
<!--        <div class="spread-info-bar">-->
<!--          <p><strong>{{ clickedSpread?.name }}（{{ clickedSpread?.count }}张）</strong></p>-->
<!--          <p>{{ clickedSpread?.desc }}</p>-->
<!--          <p>适用场景：{{ clickedSpread?.usage }}</p>-->
<!--          <p>-->
<!--            <strong>牌位含义：</strong>-->
<!--            <span v-for="(pos, index) in clickedSpread?.positions ?? []" :key="index">-->
<!--              （{{ index + 1 }}）{{ pos }}-->
<!--              <span v-if="index < (clickedSpread?.positions?.length ?? 0) - 1"></span>-->
<!--            </span>-->
<!--          </p>-->
<!--        </div>-->
<!--      </div>-->

<!--&lt;!&ndash;      <div class="selected-spread-info mt-4" v-if="isSpreadConfirmed">&ndash;&gt;-->
<!--&lt;!&ndash;        当前牌阵：{{ selectedSpread?.name }}（需 {{ selectedCardCount }} 张） | 已选：{{ selectCardArr.length }} 张&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->

<!--      <div v-if="needGuideCards">-->
<!--        指示牌（需 {{ guideCardCount }} 张） | 已选：{{ Math.min(selectCardArr.length, guideCardCount) }} 张-->
<!--      </div>-->
<!--      当前牌阵：{{ selectedSpread?.name }}（需 {{ selectedCardCount }} 张） | 已选：{{ Math.max(0, selectCardArr.length - guideCardCount) }} 张-->


<!--      <div class="card-strip-wrapper" v-if="isSpreadConfirmed && !resStatus">-->
<!--        <div-->
<!--          class="card-strip"-->
<!--          ref="cardStripWrapper"-->
<!--          @mousedown="onDragStart"-->
<!--          @touchstart.passive="onDragStart"-->
<!--        >-->
<!--          <div-->
<!--            class="card"-->
<!--            v-for="(i, index) in shuffledDeck"-->
<!--            :key="i.no"-->
<!--            :class="{ active: selectCardArr.includes(i.no) }"-->
<!--            @click="selectCard(i.no)"-->
<!--            :style="{-->
<!--              transform: `translateX(${(index * cardPartialWidth) - viewOffset}px) ${selectCardArr.includes(i.no) ? 'translateY(-40px)' : ''}`,-->
<!--              width: cardWidth + 'px',-->
<!--              zIndex: selectCardArr.includes(i.no) ? 100 : index-->
<!--            }"-->
<!--          >-->
<!--            <img :src="renderBackImage()" class="card-back" />-->
<!--          </div>-->
<!--        </div>-->
<!--        <input-->
<!--          v-show="sliderMax > 0"-->
<!--          class="card-strip-slider"-->
<!--          style="width: 100%; margin-top: 10px;"-->
<!--          type="range"-->
<!--          min="0"-->
<!--          :max="sliderMax"-->
<!--          v-model.number="viewOffset"-->
<!--        />-->
<!--      </div>-->
<!--      <div class="btn mt-4">-->
<!--&lt;!&ndash;        <Button class="mt-4 w-full button-spacing" :disabled="selectCardArr.length !== selectedCardCount" @click="getRes">&ndash;&gt;-->
<!--&lt;!&ndash;          开始占卜&ndash;&gt;-->
<!--&lt;!&ndash;        </Button>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--        <Button class="mt-4 w-full button-spacing"-->
<!--                :disabled="selectCardArr.length !== totalCardCount"-->
<!--                @click="getRes">-->
<!--          开始占卜-->
<!--        </Button>-->
<!--      </div>&ndash;&gt;-->

<!--    </template>-->



<!--    <div class="card-jx mt-4" v-else>-->
<!--      &lt;!&ndash; 指示牌行 &ndash;&gt;-->
<!--      <div v-if="guideCards.length > 0" class="guide-cards-section mb-6">-->
<!--        <h4 class="cards-section-title">指示牌</h4>-->
<!--        <div class="show-card flex flex-wrap gap-4 justify-center">-->
<!--          <div class="card-item" v-for="(card, index) in guideCards" :key="card.no">-->
<!--            <img :class="{ rever: card.isReversed }" :src="renderIMG(card.no)" />-->
<!--            <div class="card-label">-->
<!--              指示牌{{ index + 1 }} - {{ card.name }}-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      &lt;!&ndash; 牌阵牌行 &ndash;&gt;-->
<!--      <div v-if="spreadCards.length > 0" class="spread-cards-section mb-6">-->
<!--        <h4 class="cards-section-title">{{ selectedSpread?.name }}牌阵</h4>-->
<!--        <div class="show-card flex flex-wrap gap-4 justify-center">-->
<!--          <div class="card-item" v-for="(card, index) in spreadCards" :key="card.no">-->
<!--            <img :class="{ rever: card.isReversed }" :src="renderIMG(card.no)" />-->
<!--            <div class="card-label">-->
<!--              （{{ index + 1 }}）{{ selectedSpread?.positions?.[index] ?? `第${index + 1}张` }} - {{ card.name }}-->
<!--            </div>-->
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
<!--import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'-->
<!--import vh from 'vh-plugin'-->
<!--import { marked } from 'marked'-->
<!--import Typed from 'typed.js'-->
<!--import { Button } from '@/components/ui/button'-->
<!--import { Textarea } from '@/components/ui/textarea'-->
<!--import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'-->
<!--// 导入你的数据配置文件-->
<!--import tarotDecks from '../../data/tarot-decks.json';-->
<!--type Spread = {-->
<!--  key: string-->
<!--  name: string-->
<!--  count: number-->
<!--  positions?: string[]-->
<!--  desc?: string-->
<!--  usage?: string-->
<!--}-->
<!--type Deck = {-->
<!--  key: string-->
<!--  name: string-->
<!--  cardCount: number-->
<!--  imagePath: string-->
<!--  start?: number-->
<!--  spreads: Spread[]-->
<!--  cardNames?: Record<number, string>  // 新增字段-->
<!--}-->
<!--type CardResult = {-->
<!--  no: number-->
<!--  isReversed: boolean-->
<!--}-->

<!--const typedText = ref<HTMLParagraphElement | null>(null)-->
<!--let typedInstance: Typed | null = null-->
<!--// 原：const renderRES = (md: string) => { ... }-->
<!--// 改成 ↓↓↓-->
<!--const renderRES = (html: string) => {-->
<!--  if (!typedText.value) return;-->

<!--  if (typedInstance) {-->
<!--    typedInstance.destroy();-->
<!--    typedInstance = null;-->
<!--  }-->

<!--  typedInstance = new Typed(typedText.value, {-->
<!--    strings: [html],-->
<!--    typeSpeed: 16,-->
<!--    showCursor: false,-->
<!--    contentType: 'html',-->
<!--  });-->
<!--};-->





<!--// 把可能是 string 或 Promise<string> 的结果，统一变成 string-->
<!--const parseMdToHtml = async (md: string): Promise<string> => {-->
<!--  const maybe = marked.parse(md);          // 类型：string | Promise<string>-->
<!--  return typeof maybe === 'string' ? maybe : await maybe; // 统一成 string-->
<!--};-->

<!--// 修改 decks 的定义，直接使用导入的数据-->
<!--const decks = ref<Deck[]>(tarotDecks as Deck[]); // 使用导入的数据并进行类型断言-->
<!--const selectedDeckKey = ref('')-->
<!--const selectedDeck = computed(() => decks.value.find(d => d.key === selectedDeckKey.value))-->
<!--const spreads = computed(() => selectedDeck.value?.spreads ?? [])-->
<!--const selectedSpreadKey = ref<Spread['key']>('')-->
<!--const isSpreadConfirmed = ref(false)-->
<!--const clickedSpread = ref<Spread | null>(null)-->
<!--const needReversed = ref(true)-->
<!--const selectedSpread = computed(() => spreads.value.find(s => s.key === selectedSpreadKey.value))-->
<!--const selectedCardCount = computed(() => isSpreadConfirmed.value ? (selectedSpread.value?.count ?? 0) : 0)-->
<!--const selectCardArr = ref<number[]>([])-->
<!--watch(selectedSpreadKey, () => { selectCardArr.value = [] })-->

<!--const shuffledDeck = ref<CardResult[]>([])-->
<!--const initShuffledDeck = () => {-->
<!--  const deckCount = selectedDeck.value?.cardCount ?? 78-->
<!--  const deck: CardResult[] = Array.from({ length: deckCount }, (_, i) => ({ no: i, isReversed: false }))-->
<!--  for (let i = deck.length - 1; i > 0; i&#45;&#45;) {-->
<!--    const j = Math.floor(Math.random() * (i + 1))-->
<!--    ;[deck[i], deck[j]] = [deck[j], deck[i]]-->
<!--  }-->
<!--  shuffledDeck.value = deck-->
<!--}-->

<!--const cardStripWrapper = ref<HTMLDivElement | null>(null)-->
<!--const cardWidth = 88-->
<!--let isDragging = false-->
<!--let dragStartX = 0-->

<!--const viewOffset = ref(0)-->
<!--let dragStartOffset = 0-->
<!--const containerWidth = ref(0)-->

<!--const cardPartialWidth = cardWidth * 0.6-->

<!--const totalCardsWidth = computed(() => {-->
<!--  const deck = shuffledDeck.value-->
<!--  if (!deck || deck.length === 0) return 0-->
<!--  return (deck.length - 1) * cardPartialWidth + cardWidth-->
<!--})-->

<!--const sliderMax = computed(() => {-->
<!--  return Math.max(0, totalCardsWidth.value - containerWidth.value)-->
<!--})-->

<!--const onWheelWithShift = (e: WheelEvent) => {-->
<!--  if (e.shiftKey && isSpreadConfirmed.value) {-->
<!--    e.preventDefault();-->
<!--    const newOffset = viewOffset.value + (e.deltaY > 0 ? 50 : -50);-->
<!--    viewOffset.value = Math.max(0, Math.min(newOffset, sliderMax.value));-->
<!--  }-->
<!--};-->



<!--// 是否启用抽指示牌（用户勾选）-->
<!--const needGuideCards = ref(false)-->

<!--// 指示牌数量（默认可以是3，可弹窗选择 1-10）-->
<!--const guideCardCount = ref(1)-->

<!--// 计算总抽牌数 = 指示牌数量 + 牌阵数量-->
<!--const totalCardCount = computed(() =>-->
<!--  (needGuideCards.value ? guideCardCount.value : 0) + (selectedSpread.value?.count ?? 0)-->
<!--)-->





<!--onMounted(() => {-->
<!--  window.addEventListener('wheel', onWheelWithShift, { passive: false });-->

<!--  if (cardStripWrapper.value) {-->
<!--    containerWidth.value = cardStripWrapper.value.clientWidth;-->
<!--  }-->
<!--});-->

<!--onBeforeUnmount(() => {-->
<!--  window.removeEventListener('wheel', onWheelWithShift);-->

<!--  if (typedInstance) {-->
<!--    typedInstance.destroy();-->
<!--    typedInstance = null;-->
<!--  }-->
<!--});-->

<!--const onDragStart = (e: MouseEvent | TouchEvent) => {-->
<!--  const el = cardStripWrapper.value; if (!el) return-->
<!--  isDragging = true-->
<!--  dragStartX = 'touches' in e ? e.touches[0].clientX : e.clientX-->
<!--  dragStartOffset = viewOffset.value-->
<!--  window.addEventListener('mousemove', onDragMove)-->
<!--  window.addEventListener('mouseup', onDragEnd)-->
<!--  window.addEventListener('touchmove', onDragMove as any, { passive: false })-->
<!--  window.addEventListener('touchend', onDragEnd)-->
<!--}-->

<!--const SCALE = 3   // ← 新增：灵敏度系数-->
<!--const onDragMove = (e: MouseEvent | TouchEvent) => {-->
<!--  if (!isDragging) return-->
<!--  if ('preventDefault' in e) e.preventDefault()-->

<!--  const x = 'touches' in e ? e.touches[0].clientX : e.clientX-->
<!--  const dx = x - dragStartX-->
<!--  const newOffset = dragStartOffset - dx * SCALE   // ← 乘以系数-->

<!--  viewOffset.value = Math.max(0, Math.min(newOffset, sliderMax.value));-->
<!--}-->

<!--const onDragEnd = () => {-->
<!--  isDragging = false-->
<!--  window.removeEventListener('mousemove', onDragMove)-->
<!--  window.removeEventListener('mouseup', onDragEnd)-->
<!--  window.removeEventListener('touchmove', onDragMove as any)-->
<!--  window.removeEventListener('touchend', onDragEnd)-->


<!--}-->
<!--const recalcAfterDOMUpdate = async () => { }-->

<!--watch([selectedDeckKey, isSpreadConfirmed, () => shuffledDeck.value.length], recalcAfterDOMUpdate)-->

<!--const textValue = ref('')-->
<!--const loadingStatus = ref(false)-->
<!--const resStatus = ref(false)-->
<!--const cardResult = ref<CardResult[]>([])-->

<!--const selectDeck = (key: string) => {-->
<!--  selectedDeckKey.value = key-->
<!--  selectedSpreadKey.value = ''-->
<!--  clickedSpread.value = null-->
<!--  selectCardArr.value = []-->
<!--  initShuffledDeck()-->
<!--  recalcAfterDOMUpdate()-->
<!--}-->
<!--// const selectCard = (id: number) => {-->
<!--//   if (selectCardArr.value.includes(id)) { selectCardArr.value = selectCardArr.value.filter(i => i !== id); return }-->
<!--//   if (selectCardArr.value.length >= selectedCardCount.value) return-->
<!--//   selectCardArr.value.push(id)-->
<!--// }-->

<!--const selectCard = (id: number) => {-->
<!--  // 如果已选过，再点击取消-->
<!--  if (selectCardArr.value.includes(id)) {-->
<!--    selectCardArr.value = selectCardArr.value.filter(i => i !== id)-->
<!--    return-->
<!--  }-->

<!--  // 超过总抽牌数，不允许再选-->
<!--  if (selectCardArr.value.length >= totalCardCount.value) return-->

<!--  selectCardArr.value.push(id) // 按顺序加入数组-->
<!--}-->


<!--// 在现有的计算属性后添加这两个新的计算属性-->
<!--const guideCards = computed(() => {-->
<!--  return cardResult.value.filter(card => card.type === 'guide')-->
<!--})-->

<!--const spreadCards = computed(() => {-->
<!--  return cardResult.value.filter(card => card.type === 'spread')-->
<!--})-->



<!--const confirmSpread = async () => {-->
<!--  if (!selectedSpreadKey.value) return-->
<!--  isSpreadConfirmed.value = true-->
<!--  selectCardArr.value = []-->

<!--  await nextTick()-->
<!--  if (cardStripWrapper.value) {-->
<!--    containerWidth.value = cardStripWrapper.value.clientWidth-->
<!--  }-->
<!--}-->

<!--// 修正后的 getRes 函数-->
<!--// const getRes = async () => {-->
<!--//   loadingStatus.value = true-->
<!--//   cardResult.value = selectCardArr.value.map(i => ({ no: i, isReversed: needReversed.value ? Math.random() > 0.5 : false }))-->
<!--//   vh.showLoading()-->
<!--//   const res = await fetch('/api', {-->
<!--//     method: 'POST',-->
<!--//     body: JSON.stringify({-->
<!--//       text: textValue.value,-->
<!--//       pms: cardResult.value,-->
<!--//       spread: {-->
<!--//         key: selectedSpread.value?.key ?? '',-->
<!--//         name: selectedSpread.value?.name ?? '',-->
<!--//         count: selectedSpread.value?.count ?? 0,-->
<!--//         positions: selectedSpread.value?.positions ?? []-->
<!--//       },-->
<!--//       deck: {-->
<!--//         key: selectedDeck.value?.key ?? '',-->
<!--//         name: selectedDeck.value?.name ?? ''-->
<!--//       }-->
<!--//     })-->
<!--//   })-->
<!--//   vh.hideLoading()-->
<!--//   resStatus.value = true-->
<!--//   const resText = await res.text()-->
<!--//   await nextTick()-->
<!--//   // 在这里直接将纯字符串传给 renderRES，避免类型错误-->
<!--//   renderRES(resText)-->
<!--// }-->
<!--const resetFn = () => {-->
<!--  selectCardArr.value = []-->
<!--  cardResult.value = []-->
<!--  resStatus.value = false-->
<!--  loadingStatus.value = false-->
<!--  isSpreadConfirmed.value = false-->
<!--  clickedSpread.value = null-->
<!--  needReversed.value = true-->
<!--  selectedDeckKey.value = ''-->
<!--  selectedSpreadKey.value = ''-->
<!--  initShuffledDeck()-->
<!--  textValue.value = ''-->
<!--  if (typedInstance) { typedInstance.destroy(); typedInstance = null }-->
<!--}-->

<!--// const renderBackImage = () => {-->
<!--//   const path = selectedDeck.value?.imagePath ?? '../../assets/images/card/'-->
<!--//   return new URL(`${path}back.jpg`, import.meta.url).href-->
<!--// }-->
<!--//-->
<!--// // const renderIMG = (no: number) => {-->
<!--// //   const path = selectedDeck.value?.imagePath ?? '../../assets/images/card/'-->
<!--// //   return new URL(`${path}${no}.jpg`, import.meta.url).href-->
<!--// // }-->
<!--//-->
<!--//-->
<!--// // ... (之前的代码保持不变)-->
<!--//-->
<!--// // 修正后的 renderIMG 函数，它返回一个同步的字符串-->
<!--// const renderIMG = (no: number): string => {-->
<!--//   const path = selectedDeck.value?.imagePath ?? '../../assets/images/card/'-->
<!--//   // 使用 Vite 推荐的 new URL 方式-->
<!--//   return new URL(`${path}${no}.jpg`, import.meta.url).href-->
<!--// }-->
<!--const base = import.meta.env.BASE_URL // 一般是 '/'-->

<!--const renderBackImage = () => {-->
<!--  const path = selectedDeck.value?.imagePath ?? 'cards/card/'-->

<!--  return `${base}${path}back.jpg`-->
<!--}-->

<!--// const renderIMG = (no: number): string => {-->
<!--//   const path = selectedDeck.value?.imagePath ?? 'cards/card/'-->
<!--//   return `${base}${path}${no}.jpg`-->
<!--// }-->
<!--const renderIMG = (no: number): string => {-->
<!--  const path = selectedDeck.value?.imagePath ?? 'cards/card/'-->
<!--  const start = selectedDeck.value?.start ?? 0   // 默认为 0-->
<!--  const fileNo = no + start-->
<!--  return `${base}${path}${fileNo}.jpg`-->
<!--}-->



<!--const getRes = async () => {-->
<!--  if (!selectedSpread.value) return-->
<!--  loadingStatus.value = true-->

<!--  // 生成抽牌结果，同时标记类型（guide / spread）-->
<!--  cardResult.value = selectCardArr.value.map((i, index) => ({-->
<!--    no: i,-->
<!--    type: needGuideCards.value && index < guideCardCount.value ? 'guide' : 'spread',-->
<!--    name: selectedDeck.value?.cardNames?.[i] ?? `第${i}张`,-->
<!--    isReversed: needReversed.value ? Math.random() > 0.5 : false-->
<!--  }))-->



<!--  vh.showLoading()-->
<!--  try {-->
<!--    const res = await fetch('/api', {-->
<!--      method: 'POST',-->
<!--      body: JSON.stringify({-->
<!--        text: textValue.value,-->
<!--        pms: cardResult.value,-->
<!--        spread: {-->
<!--          key: selectedSpread.value.key,-->
<!--          name: selectedSpread.value.name,-->
<!--          count: selectedSpread.value.count,-->
<!--          positions: selectedSpread.value.positions ?? []-->
<!--        },-->
<!--        deck: {-->
<!--          key: selectedDeck.value?.key ?? '',-->
<!--          name: selectedDeck.value?.name ?? ''-->
<!--        }-->
<!--      })-->
<!--    })-->
<!--    if (!res.ok) throw new Error(`API response was not ok: ${res.statusText}`)-->

<!--    const resText = await res.text()-->
<!--    const html = await parseMdToHtml(resText)-->

<!--    resStatus.value = true-->
<!--    await nextTick()-->
<!--    renderRES(html)-->
<!--  } catch (error) {-->
<!--    console.error('占卜请求失败:', error)-->
<!--  } finally {-->
<!--    vh.hideLoading()-->
<!--  }-->
<!--}-->




<!--onMounted(() => {-->
<!--  if (cardStripWrapper.value) {-->
<!--    containerWidth.value = cardStripWrapper.value.clientWidth-->
<!--  }-->
<!--})-->

<!--onBeforeUnmount(() => { if (typedInstance) { typedInstance.destroy(); typedInstance = null } })-->
<!--</script>-->

<!--<style scoped lang="less">-->
<!--@import 'Home.less';-->

<!--.hover-info-wrapper {-->
<!--  height: 140px;-->
<!--  margin-bottom: 12px;-->
<!--}-->

<!--.spread-info-bar {-->
<!--  position: relative;-->
<!--  background: #fff8f0;-->
<!--  padding: 6px;-->
<!--  border-radius: 4px;-->
<!--}-->

<!--.spread-selection {-->
<!--  margin-bottom: 24px;-->
<!--  .spread-list {-->
<!--    display: flex;-->
<!--    flex-wrap: wrap;-->
<!--    gap: 12px;-->
<!--  }-->
<!--}-->

<!--.spread-card {-->
<!--  background: #fdf6f0;-->
<!--  border: 1px solid #ccc;-->
<!--  border-radius: 8px;-->
<!--  padding: 12px;-->
<!--  width: 200px;-->
<!--  cursor: pointer;-->
<!--  transition: all 0.2s;-->

<!--  .spread-header {-->
<!--    font-weight: bold;-->
<!--    margin-bottom: 6px;-->
<!--  }-->

<!--  &:hover {-->
<!--    transform: translateY(-4px);-->
<!--    box-shadow: 0 4px 12px rgba(0,0,0,0.15);-->
<!--  }-->

<!--  &.active {-->
<!--    border-color: #f39c12;-->
<!--    box-shadow: 0 0 0 3px rgba(243,156,18,0.2);-->
<!--  }-->
<!--}-->

<!--.selected-spread-info {-->
<!--  margin-top: 12px;-->
<!--  font-size: 14px;-->
<!--  color: #444;-->
<!--}-->

<!--.card-strip-wrapper {-->
<!--  position: relative;-->
<!--  width: 100%;-->
<!--  overflow-x: visible;-->
<!--  height: 200px;-->
<!--  margin-top: 12px;-->
<!--}-->

<!--.card-strip {-->
<!--  position: relative;-->
<!--  height: 100%;-->
<!--  cursor: grab;-->
<!--}-->

<!--.card {-->
<!--  position: absolute;-->
<!--  bottom: 0;-->
<!--  width: 88px;-->
<!--  transition: transform 0.2s, z-index 0.2s;-->
<!--}-->

<!--.card.active {-->
<!--  border: 2px solid gold;-->
<!--  box-shadow: 0 0 10px rgba(255,215,0,0.6);-->
<!--  z-index: 100;-->
<!--}-->

<!--.card img.card-back {-->
<!--  width: 100%;-->
<!--  height: auto;-->
<!--  border-radius: 4px;-->
<!--  box-shadow: 0 2px 6px rgba(0,0,0,0.3);-->
<!--}-->

<!--.show-card {-->
<!--  display: flex;-->
<!--  flex-wrap: wrap;-->
<!--  gap: 12px;-->
<!--  justify-content: center;-->
<!--}-->

<!--.card-item {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  align-items: center;-->
<!--}-->

<!--.card-item img {-->
<!--  width: 100px;-->
<!--  height: auto;-->
<!--}-->

<!--.card-label {-->
<!--  margin-top: 4px;-->
<!--  font-size: 14px;-->
<!--  color: #666;-->
<!--}-->

<!--@media (max-width: 768px) {-->
<!--  .spread-list {-->
<!--    flex-direction: column;-->
<!--  }-->
<!--  .spread-card {-->
<!--    width: 100%;-->
<!--  }-->
<!--  .card-item img {-->
<!--    width: min(22vw, 90px);-->
<!--  }-->
<!--  .card-label {-->
<!--    font-size: 12px;-->
<!--  }-->
<!--}-->

<!--.card-strip-slider {-->
<!--  -webkit-appearance: none;-->
<!--  appearance: none;-->
<!--  width: 100%;-->
<!--  height: 8px;-->
<!--  background: #ddd;-->
<!--  border-radius: 5px;-->
<!--  outline: none;-->
<!--  opacity: 0.7;-->
<!--  transition: opacity .2s;-->
<!--  margin-top: 15px;-->
<!--}-->

<!--.card-strip-slider:hover {-->
<!--  opacity: 1;-->
<!--}-->

<!--.card-strip-slider::-webkit-slider-thumb {-->
<!--  -webkit-appearance: none;-->
<!--  appearance: none;-->
<!--  width: 18px;-->
<!--  height: 18px;-->
<!--  background: #f39c12;-->
<!--  cursor: pointer;-->
<!--  border-radius: 50%;-->
<!--}-->

<!--.card-strip-slider::-moz-range-thumb {-->
<!--  width: 18px;-->
<!--  height: 18px;-->
<!--  background: #f39c12;-->
<!--  cursor: pointer;-->
<!--  border-radius: 50%;-->
<!--}-->

<!--.section-title {-->
<!--  font-size: 1.25rem;-->
<!--  font-weight: bold;-->
<!--  color: #8b4513;-->
<!--  border-bottom: 2px solid #deb887;-->
<!--  padding-bottom: 8px;-->
<!--  margin-bottom: 1rem;-->
<!--  text-transform: uppercase;-->
<!--}-->
<!--.button-spacing {-->
<!--  margin-top: 40px; /* 增加上外边距，向下平移 */-->
<!--}-->



<!--// 在现有样式后添加-->
<!--.guide-cards-section, .spread-cards-section {-->
<!--  border: 1px solid #e0e0e0;-->
<!--  border-radius: 8px;-->
<!--  padding: 16px;-->
<!--  background: #fafafa;-->
<!--}-->

<!--.cards-section-title {-->
<!--  font-size: 1.1rem;-->
<!--  font-weight: bold;-->
<!--  color: #8b4513;-->
<!--  margin-bottom: 12px;-->
<!--  text-align: center;-->
<!--  border-bottom: 1px solid #deb887;-->
<!--  padding-bottom: 8px;-->
<!--}-->

<!--.guide-cards-section {-->
<!--  background: #f0f8ff; // 浅蓝色背景区分指示牌-->
<!--}-->

<!--.spread-cards-section {-->
<!--  background: #fff8f0; // 浅橙色背景区分牌阵牌-->
<!--}-->



<!--</style>-->

<!--<template>-->
<!--  <section class="Home">-->
<!--    <div class="text">-->
<!--      <h3 class="section-title">1.深呼吸，屏除杂念，集意力，写下并默念你的问题，开始你的塔罗占卜之旅</h3>-->
<!--      <Textarea-->
<!--        v-model.trim="textValue"-->
<!--        placeholder="你要占卜的问题（可选）"-->
<!--        :disabled="loadingStatus"-->
<!--      />-->
<!--    </div>-->

<!--    <template v-if="!loadingStatus">-->
<!--      <div class="deck-selection mb-4">-->
<!--        <h3 class="section-title">2.选择塔罗牌种类（必须）</h3>-->
<!--        <div class="deck-list flex gap-4">-->
<!--          <div-->
<!--            v-for="d in decks"-->
<!--            :key="d.key"-->
<!--            class="deck-card p-2 border rounded cursor-pointer"-->
<!--            :class="{ active: selectedDeckKey === d.key }"-->
<!--            @click="selectDeck(d.key)"-->
<!--          >-->
<!--            {{ d.name }}-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="mt-2">-->
<!--        <label>-->
<!--          <input type="checkbox" v-model="needReversed" /> 是否带逆位-->
<!--        </label>-->
<!--      </div>-->

<!--      <div class="mt-2" v-if="selectedSpreadKey">-->
<!--        <label>-->
<!--          <input type="checkbox" v-model="needGuideCards" /> 是否抽指示牌-->
<!--        </label>-->

<!--        <template v-if="needGuideCards">-->
<!--          <label>-->
<!--            抽取指示牌数量：-->
<!--            <input type="number" v-model.number="guideCardCount" min="1" max="10" style="width:50px;" />-->
<!--          </label>-->
<!--        </template>-->
<!--      </div>-->

<!--      <div class="spread-selection" v-if="selectedDeckKey">-->
<!--        <h3 class="section-title">3.选择牌阵（必须）</h3>-->
<!--        <div class="spread-list flex flex-wrap gap-4">-->
<!--          <div-->
<!--            v-for="s in spreads"-->
<!--            :key="s.key"-->
<!--            class="spread-card p-2 border rounded cursor-pointer"-->
<!--            :class="{ active: selectedSpreadKey === s.key }"-->
<!--            @click="() => { selectedSpreadKey = s.key; clickedSpread = s; }"-->
<!--          >-->
<!--            <div class="spread-header font-bold">-->
<!--              <span class="spread-name">{{ s.name }}</span>-->
<!--              <span class="spread-count">（{{ s.count }}张）</span>-->
<!--            </div>-->
<!--            <p class="spread-desc text-sm">{{ s.desc }}</p>-->
<!--          </div>-->
<!--        </div>-->
<!--        <Button class="mt-4 w-full" :disabled="!selectedSpreadKey || isSpreadConfirmed" @click="confirmSpread">-->
<!--          确认牌阵-->
<!--        </Button>-->
<!--      </div>-->

<!--      <div class="hover-info-wrapper mt-4" v-if="clickedSpread">-->
<!--        <div class="spread-info-bar">-->
<!--          <p><strong>{{ clickedSpread?.name }}（{{ clickedSpread?.count }}张）</strong></p>-->
<!--          <p>{{ clickedSpread?.desc }}</p>-->
<!--          <p>适用场景：{{ clickedSpread?.usage }}</p>-->
<!--          <p>-->
<!--            <strong>牌位含义：</strong>-->
<!--            <span v-for="(pos, index) in clickedSpread?.positions ?? []" :key="index">-->
<!--              （{{ index + 1 }}）{{ pos }}-->
<!--              <span v-if="index < (clickedSpread?.positions?.length ?? 0) - 1"></span>-->
<!--            </span>-->
<!--          </p>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div v-if="needGuideCards && isSpreadConfirmed">-->
<!--        指示牌（需 {{ guideCardCount }} 张） | 已选：{{ Math.min(selectCardArr.length, guideCardCount) }} 张-->
<!--      </div>-->
<!--      <div v-if="isSpreadConfirmed">-->
<!--        当前牌阵：{{ selectedSpread?.name }}（需 {{ selectedCardCount }} 张） | 已选：{{ Math.max(0, selectCardArr.length - (needGuideCards ? guideCardCount : 0)) }} 张-->
<!--      </div>-->

<!--      <div class="card-strip-wrapper" v-if="isSpreadConfirmed && !resStatus">-->
<!--        <div-->
<!--          class="card-strip"-->
<!--          ref="cardStripWrapper"-->
<!--          @mousedown="onDragStart"-->
<!--          @touchstart.passive="onDragStart"-->
<!--        >-->
<!--          <div-->
<!--            class="card"-->
<!--            v-for="(i, index) in shuffledDeck"-->
<!--            :key="i.no"-->
<!--            :class="{ active: selectCardArr.includes(i.no) }"-->
<!--            @click="selectCard(i.no)"-->
<!--            :style="{-->
<!--              transform: `translateX(${(index * cardPartialWidth) - viewOffset}px) ${selectCardArr.includes(i.no) ? 'translateY(-40px)' : ''}`,-->
<!--              width: cardWidth + 'px',-->
<!--              zIndex: selectCardArr.includes(i.no) ? 100 : index-->
<!--            }"-->
<!--          >-->
<!--            <img :src="renderBackImage()" class="card-back" />-->
<!--          </div>-->
<!--        </div>-->
<!--        <input-->
<!--          v-show="sliderMax > 0"-->
<!--          class="card-strip-slider"-->
<!--          style="width: 100%; margin-top: 10px;"-->
<!--          type="range"-->
<!--          min="0"-->
<!--          :max="sliderMax"-->
<!--          v-model.number="viewOffset"-->
<!--        />-->
<!--      </div>-->
<!--      <div class="btn mt-4" v-if="isSpreadConfirmed && !resStatus">-->
<!--        <Button class="mt-4 w-full button-spacing"-->
<!--                :disabled="selectCardArr.length !== totalCardCount"-->
<!--                @click="getRes">-->
<!--          开始占卜-->
<!--        </Button>-->
<!--      </div>-->
<!--    </template>-->

<!--    <div class="card-jx mt-4" v-else>-->
<!--      &lt;!&ndash; 指示牌行 &ndash;&gt;-->
<!--      <div v-if="guideCards.length > 0" class="guide-cards-section mb-6">-->
<!--        <h4 class="cards-section-title">指示牌</h4>-->
<!--        <div class="show-card flex flex-wrap gap-4 justify-center">-->
<!--          <div class="card-item" v-for="(card, index) in guideCards" :key="card.no">-->
<!--            <img :class="{ rever: card.isReversed }" :src="renderIMG(card.no)" />-->
<!--            <div class="card-label">-->
<!--              指示牌{{ index + 1 }} - {{ card.name }}-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      &lt;!&ndash; 牌阵牌行 &ndash;&gt;-->
<!--      <div v-if="spreadCards.length > 0" class="spread-cards-section mb-6">-->
<!--        <h4 class="cards-section-title">{{ selectedSpread?.name }}牌阵</h4>-->
<!--        <div class="show-card flex flex-wrap gap-4 justify-center">-->
<!--          <div class="card-item" v-for="(card, index) in spreadCards" :key="card.no">-->
<!--            <img :class="{ rever: card.isReversed }" :src="renderIMG(card.no)" />-->
<!--            <div class="card-label">-->
<!--              （{{ index + 1 }}）{{ selectedSpread?.positions?.[index] ?? `第${index + 1}张` }} - {{ card.name }}-->
<!--            </div>-->
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
<!--import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'-->
<!--import vh from 'vh-plugin'-->
<!--import { marked } from 'marked'-->
<!--import Typed from 'typed.js'-->
<!--import { Button } from '@/components/ui/button'-->
<!--import { Textarea } from '@/components/ui/textarea'-->
<!--import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'-->
<!--// 导入你的数据配置文件-->
<!--import tarotDecks from '../../data/tarot-decks.json';-->

<!--// 类型定义 - 修正后的完整类型-->
<!--type Spread = {-->
<!--  key: string-->
<!--  name: string-->
<!--  count: number-->
<!--  positions?: string[]-->
<!--  desc?: string-->
<!--  usage?: string-->
<!--}-->

<!--type Deck = {-->
<!--  key: string-->
<!--  name: string-->
<!--  cardCount: number-->
<!--  imagePath: string-->
<!--  start?: number-->
<!--  spreads: Spread[]-->
<!--  cardNames?: Record<number, string>-->
<!--}-->

<!--type CardResult = {-->
<!--  no: number-->
<!--  name: string-->
<!--  type?: 'guide' | 'spread'-->
<!--  isReversed: boolean-->
<!--}-->

<!--const typedText = ref<HTMLParagraphElement | null>(null)-->
<!--let typedInstance: Typed | null = null-->

<!--const renderRES = (html: string) => {-->
<!--  if (!typedText.value) return;-->

<!--  if (typedInstance) {-->
<!--    typedInstance.destroy();-->
<!--    typedInstance = null;-->
<!--  }-->

<!--  typedInstance = new Typed(typedText.value, {-->
<!--    strings: [html],-->
<!--    typeSpeed: 16,-->
<!--    showCursor: false,-->
<!--    contentType: 'html',-->
<!--  });-->
<!--};-->

<!--// 把可能是 string 或 Promise<string> 的结果，统一变成 string-->
<!--const parseMdToHtml = async (md: string): Promise<string> => {-->
<!--  const maybe = marked.parse(md);-->
<!--  return typeof maybe === 'string' ? maybe : await maybe;-->
<!--};-->

<!--// 修改 decks 的定义，直接使用导入的数据-->
<!--const decks = ref<Deck[]>(tarotDecks as Deck[]);-->
<!--const selectedDeckKey = ref('')-->
<!--const selectedDeck = computed(() => decks.value.find(d => d.key === selectedDeckKey.value))-->
<!--const spreads = computed(() => selectedDeck.value?.spreads ?? [])-->
<!--const selectedSpreadKey = ref<Spread['key']>('')-->
<!--const isSpreadConfirmed = ref(false)-->
<!--const clickedSpread = ref<Spread | null>(null)-->
<!--const needReversed = ref(true)-->
<!--const selectedSpread = computed(() => spreads.value.find(s => s.key === selectedSpreadKey.value))-->
<!--const selectedCardCount = computed(() => isSpreadConfirmed.value ? (selectedSpread.value?.count ?? 0) : 0)-->
<!--const selectCardArr = ref<number[]>([])-->
<!--watch(selectedSpreadKey, () => { selectCardArr.value = [] })-->

<!--// 修正 shuffledDeck 的初始化-->
<!--const shuffledDeck = ref<CardResult[]>([])-->
<!--const initShuffledDeck = () => {-->
<!--  const deckCount = selectedDeck.value?.cardCount ?? 78-->
<!--  const deck: CardResult[] = Array.from({ length: deckCount }, (_, i) => ({-->
<!--    no: i,-->
<!--    name: selectedDeck.value?.cardNames?.[i] ?? `第${i}张`,-->
<!--    isReversed: false-->
<!--  }))-->
<!--  for (let i = deck.length - 1; i > 0; i&#45;&#45;) {-->
<!--    const j = Math.floor(Math.random() * (i + 1))-->
<!--    ;[deck[i], deck[j]] = [deck[j], deck[i]]-->
<!--  }-->
<!--  shuffledDeck.value = deck-->
<!--}-->

<!--const cardStripWrapper = ref<HTMLDivElement | null>(null)-->
<!--const cardWidth = 88-->
<!--let isDragging = false-->
<!--let dragStartX = 0-->

<!--const viewOffset = ref(0)-->
<!--let dragStartOffset = 0-->
<!--const containerWidth = ref(0)-->

<!--const cardPartialWidth = cardWidth * 0.6-->

<!--const totalCardsWidth = computed(() => {-->
<!--  const deck = shuffledDeck.value-->
<!--  if (!deck || deck.length === 0) return 0-->
<!--  return (deck.length - 1) * cardPartialWidth + cardWidth-->
<!--})-->

<!--const sliderMax = computed(() => {-->
<!--  return Math.max(0, totalCardsWidth.value - containerWidth.value)-->
<!--})-->

<!--const onWheelWithShift = (e: WheelEvent) => {-->
<!--  if (e.shiftKey && isSpreadConfirmed.value) {-->
<!--    e.preventDefault();-->
<!--    const newOffset = viewOffset.value + (e.deltaY > 0 ? 50 : -50);-->
<!--    viewOffset.value = Math.max(0, Math.min(newOffset, sliderMax.value));-->
<!--  }-->
<!--};-->

<!--// 是否启用抽指示牌（用户勾选）-->
<!--const needGuideCards = ref(false)-->

<!--// 指示牌数量（默认可以是3，可弹窗选择 1-10）-->
<!--const guideCardCount = ref(1)-->

<!--// 计算总抽牌数 = 指示牌数量 + 牌阵数量-->
<!--const totalCardCount = computed(() =>-->
<!--  (needGuideCards.value ? guideCardCount.value : 0) + (selectedSpread.value?.count ?? 0)-->
<!--)-->

<!--onMounted(() => {-->
<!--  window.addEventListener('wheel', onWheelWithShift, { passive: false });-->

<!--  if (cardStripWrapper.value) {-->
<!--    containerWidth.value = cardStripWrapper.value.clientWidth;-->
<!--  }-->
<!--});-->

<!--onBeforeUnmount(() => {-->
<!--  window.removeEventListener('wheel', onWheelWithShift);-->

<!--  if (typedInstance) {-->
<!--    typedInstance.destroy();-->
<!--    typedInstance = null;-->
<!--  }-->
<!--});-->

<!--const onDragStart = (e: MouseEvent | TouchEvent) => {-->
<!--  const el = cardStripWrapper.value; if (!el) return-->
<!--  isDragging = true-->
<!--  dragStartX = 'touches' in e ? e.touches[0].clientX : e.clientX-->
<!--  dragStartOffset = viewOffset.value-->
<!--  window.addEventListener('mousemove', onDragMove)-->
<!--  window.addEventListener('mouseup', onDragEnd)-->
<!--  window.addEventListener('touchmove', onDragMove as any, { passive: false })-->
<!--  window.addEventListener('touchend', onDragEnd)-->
<!--}-->

<!--const SCALE = 3-->
<!--const onDragMove = (e: MouseEvent | TouchEvent) => {-->
<!--  if (!isDragging) return-->
<!--  if ('preventDefault' in e) e.preventDefault()-->

<!--  const x = 'touches' in e ? e.touches[0].clientX : e.clientX-->
<!--  const dx = x - dragStartX-->
<!--  const newOffset = dragStartOffset - dx * SCALE-->

<!--  viewOffset.value = Math.max(0, Math.min(newOffset, sliderMax.value));-->
<!--}-->

<!--const onDragEnd = () => {-->
<!--  isDragging = false-->
<!--  window.removeEventListener('mousemove', onDragMove)-->
<!--  window.removeEventListener('mouseup', onDragEnd)-->
<!--  window.removeEventListener('touchmove', onDragMove as any)-->
<!--  window.removeEventListener('touchend', onDragEnd)-->
<!--}-->

<!--const recalcAfterDOMUpdate = async () => { }-->

<!--watch([selectedDeckKey, isSpreadConfirmed, () => shuffledDeck.value.length], recalcAfterDOMUpdate)-->

<!--const textValue = ref('')-->
<!--const loadingStatus = ref(false)-->
<!--const resStatus = ref(false)-->
<!--const cardResult = ref<CardResult[]>([])-->

<!--const selectDeck = (key: string) => {-->
<!--  selectedDeckKey.value = key-->
<!--  selectedSpreadKey.value = ''-->
<!--  clickedSpread.value = null-->
<!--  selectCardArr.value = []-->
<!--  initShuffledDeck()-->
<!--  recalcAfterDOMUpdate()-->
<!--}-->

<!--const selectCard = (id: number) => {-->
<!--  // 如果已选过，再点击取消-->
<!--  if (selectCardArr.value.includes(id)) {-->
<!--    selectCardArr.value = selectCardArr.value.filter(i => i !== id)-->
<!--    return-->
<!--  }-->

<!--  // 超过总抽牌数，不允许再选-->
<!--  if (selectCardArr.value.length >= totalCardCount.value) return-->

<!--  selectCardArr.value.push(id) // 按顺序加入数组-->
<!--}-->

<!--// 修正计算属性的类型注解-->
<!--const guideCards = computed((): CardResult[] => {-->
<!--  return cardResult.value.filter(card => card.type === 'guide')-->
<!--})-->

<!--const spreadCards = computed((): CardResult[] => {-->
<!--  return cardResult.value.filter(card => card.type === 'spread')-->
<!--})-->

<!--const confirmSpread = async () => {-->
<!--  if (!selectedSpreadKey.value) return-->
<!--  isSpreadConfirmed.value = true-->
<!--  selectCardArr.value = []-->

<!--  await nextTick()-->
<!--  if (cardStripWrapper.value) {-->
<!--    containerWidth.value = cardStripWrapper.value.clientWidth-->
<!--  }-->
<!--}-->

<!--const resetFn = () => {-->
<!--  selectCardArr.value = []-->
<!--  cardResult.value = []-->
<!--  resStatus.value = false-->
<!--  loadingStatus.value = false-->
<!--  isSpreadConfirmed.value = false-->
<!--  clickedSpread.value = null-->
<!--  needReversed.value = true-->
<!--  selectedDeckKey.value = ''-->
<!--  selectedSpreadKey.value = ''-->
<!--  needGuideCards.value = false-->
<!--  guideCardCount.value = 1-->
<!--  initShuffledDeck()-->
<!--  textValue.value = ''-->
<!--  if (typedInstance) { typedInstance.destroy(); typedInstance = null }-->
<!--}-->

<!--const base = import.meta.env.BASE_URL-->

<!--const renderBackImage = () => {-->
<!--  const path = selectedDeck.value?.imagePath ?? 'cards/card/'-->
<!--  return `${base}${path}back.jpg`-->
<!--}-->

<!--const renderIMG = (no: number): string => {-->
<!--  const path = selectedDeck.value?.imagePath ?? 'cards/card/'-->
<!--  const start = selectedDeck.value?.start ?? 0-->
<!--  const fileNo = no + start-->
<!--  return `${base}${path}${fileNo}.jpg`-->
<!--}-->

<!--// 修正 getRes 函数-->
<!--const getRes = async () => {-->
<!--  if (!selectedSpread.value) return-->
<!--  loadingStatus.value = true-->

<!--  // 生成抽牌结果，同时标记类型（guide / spread）-->
<!--  cardResult.value = selectCardArr.value.map((cardNo, index) => {-->
<!--    // 从 shuffledDeck 中找到对应的卡牌信息-->
<!--    const cardInfo = shuffledDeck.value.find(card => card.no === cardNo)-->

<!--    return {-->
<!--      no: cardNo,-->
<!--      name: cardInfo?.name || selectedDeck.value?.cardNames?.[cardNo] || `第${cardNo}张`,-->
<!--      type: needGuideCards.value && index < guideCardCount.value ? 'guide' as const : 'spread' as const,-->
<!--      isReversed: needReversed.value ? Math.random() > 0.5 : false-->
<!--    }-->
<!--  })-->

<!--  vh.showLoading()-->
<!--  try {-->
<!--    const res = await fetch('/api', {-->
<!--      method: 'POST',-->
<!--      headers: {-->
<!--        'Content-Type': 'application/json'-->
<!--      },-->
<!--      body: JSON.stringify({-->
<!--        text: textValue.value,-->
<!--        pms: cardResult.value,-->
<!--        spread: {-->
<!--          key: selectedSpread.value.key,-->
<!--          name: selectedSpread.value.name,-->
<!--          count: selectedSpread.value.count,-->
<!--          positions: selectedSpread.value.positions ?? []-->
<!--        },-->
<!--        deck: {-->
<!--          key: selectedDeck.value?.key ?? '',-->
<!--          name: selectedDeck.value?.name ?? ''-->
<!--        }-->
<!--      })-->
<!--    })-->
<!--    if (!res.ok) throw new Error(`API response was not ok: ${res.statusText}`)-->

<!--    const resText = await res.text()-->
<!--    const html = await parseMdToHtml(resText)-->

<!--    resStatus.value = true-->
<!--    await nextTick()-->
<!--    renderRES(html)-->
<!--  } catch (error) {-->
<!--    console.error('占卜请求失败:', error)-->
<!--  } finally {-->
<!--    vh.hideLoading()-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped lang="less">-->
<!--@import 'Home.less';-->

<!--.hover-info-wrapper {-->
<!--  height: 140px;-->
<!--  margin-bottom: 12px;-->
<!--}-->

<!--.spread-info-bar {-->
<!--  position: relative;-->
<!--  background: #fff8f0;-->
<!--  padding: 6px;-->
<!--  border-radius: 4px;-->
<!--}-->

<!--.spread-selection {-->
<!--  margin-bottom: 24px;-->
<!--  .spread-list {-->
<!--    display: flex;-->
<!--    flex-wrap: wrap;-->
<!--    gap: 12px;-->
<!--  }-->
<!--}-->

<!--.spread-card {-->
<!--  background: #fdf6f0;-->
<!--  border: 1px solid #ccc;-->
<!--  border-radius: 8px;-->
<!--  padding: 12px;-->
<!--  width: 200px;-->
<!--  cursor: pointer;-->
<!--  transition: all 0.2s;-->

<!--  .spread-header {-->
<!--    font-weight: bold;-->
<!--    margin-bottom: 6px;-->
<!--  }-->

<!--  &:hover {-->
<!--    transform: translateY(-4px);-->
<!--    box-shadow: 0 4px 12px rgba(0,0,0,0.15);-->
<!--  }-->

<!--  &.active {-->
<!--    border-color: #f39c12;-->
<!--    box-shadow: 0 0 0 3px rgba(243,156,18,0.2);-->
<!--  }-->
<!--}-->

<!--.selected-spread-info {-->
<!--  margin-top: 12px;-->
<!--  font-size: 14px;-->
<!--  color: #444;-->
<!--}-->

<!--.card-strip-wrapper {-->
<!--  position: relative;-->
<!--  width: 100%;-->
<!--  overflow-x: visible;-->
<!--  height: 200px;-->
<!--  margin-top: 12px;-->
<!--}-->

<!--.card-strip {-->
<!--  position: relative;-->
<!--  height: 100%;-->
<!--  cursor: grab;-->
<!--}-->

<!--.card {-->
<!--  position: absolute;-->
<!--  bottom: 0;-->
<!--  width: 88px;-->
<!--  transition: transform 0.2s, z-index 0.2s;-->
<!--}-->

<!--.card.active {-->
<!--  border: 2px solid gold;-->
<!--  box-shadow: 0 0 10px rgba(255,215,0,0.6);-->
<!--  z-index: 100;-->
<!--}-->

<!--.card img.card-back {-->
<!--  width: 100%;-->
<!--  height: auto;-->
<!--  border-radius: 4px;-->
<!--  box-shadow: 0 2px 6px rgba(0,0,0,0.3);-->
<!--}-->

<!--.show-card {-->
<!--  display: flex;-->
<!--  flex-wrap: wrap;-->
<!--  gap: 12px;-->
<!--  justify-content: center;-->
<!--}-->

<!--.card-item {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  align-items: center;-->
<!--}-->

<!--.card-item img {-->
<!--  width: 100px;-->
<!--  height: auto;-->
<!--}-->

<!--.card-label {-->
<!--  margin-top: 4px;-->
<!--  font-size: 14px;-->
<!--  color: #666;-->
<!--}-->

<!--@media (max-width: 768px) {-->
<!--  .spread-list {-->
<!--    flex-direction: column;-->
<!--  }-->
<!--  .spread-card {-->
<!--    width: 100%;-->
<!--  }-->
<!--  .card-item img {-->
<!--    width: min(22vw, 90px);-->
<!--  }-->
<!--  .card-label {-->
<!--    font-size: 12px;-->
<!--  }-->
<!--}-->

<!--.card-strip-slider {-->
<!--  -webkit-appearance: none;-->
<!--  appearance: none;-->
<!--  width: 100%;-->
<!--  height: 8px;-->
<!--  background: #ddd;-->
<!--  border-radius: 5px;-->
<!--  outline: none;-->
<!--  opacity: 0.7;-->
<!--  transition: opacity .2s;-->
<!--  margin-top: 15px;-->
<!--}-->

<!--.card-strip-slider:hover {-->
<!--  opacity: 1;-->
<!--}-->

<!--.card-strip-slider::-webkit-slider-thumb {-->
<!--  -webkit-appearance: none;-->
<!--  appearance: none;-->
<!--  width: 18px;-->
<!--  height: 18px;-->
<!--  background: #f39c12;-->
<!--  cursor: pointer;-->
<!--  border-radius: 50%;-->
<!--}-->

<!--.card-strip-slider::-moz-range-thumb {-->
<!--  width: 18px;-->
<!--  height: 18px;-->
<!--  background: #f39c12;-->
<!--  cursor: pointer;-->
<!--  border-radius: 50%;-->
<!--}-->

<!--.section-title {-->
<!--  font-size: 1.25rem;-->
<!--  font-weight: bold;-->
<!--  color: #8b4513;-->
<!--  border-bottom: 2px solid #deb887;-->
<!--  padding-bottom: 8px;-->
<!--  margin-bottom: 1rem;-->
<!--  text-transform: uppercase;-->
<!--}-->

<!--.button-spacing {-->
<!--  margin-top: 40px;-->
<!--}-->

<!--.guide-cards-section, .spread-cards-section {-->
<!--  border: 1px solid #e0e0e0;-->
<!--  border-radius: 8px;-->
<!--  padding: 16px;-->
<!--  background: #fafafa;-->
<!--}-->

<!--.cards-section-title {-->
<!--  font-size: 1.1rem;-->
<!--  font-weight: bold;-->
<!--  color: #8b4513;-->
<!--  margin-bottom: 12px;-->
<!--  text-align: center;-->
<!--  border-bottom: 1px solid #deb887;-->
<!--  padding-bottom: 8px;-->
<!--}-->

<!--.guide-cards-section {-->
<!--  background: #f0f8ff;-->
<!--}-->

<!--.spread-cards-section {-->
<!--  background: #fff8f0;-->
<!--}-->
<!--</style>-->


<template>
  <section class="Home" :class="{ 'dark-mode': isDarkMode }">
    <!-- 主题切换按钮 -->
    <div class="theme-toggle">
      <button @click="toggleTheme" class="theme-btn">
        <span v-if="isDarkMode">🌞</span>
        <span v-else>🌙</span>
      </button>
    </div>

    <div class="text">
      <h3 class="section-title">1深呼吸，屏除杂念，集中注意力，写下并默念你的问题，开始你的塔罗占卜之旅</h3>
      <Textarea
        v-model.trim="textValue"
        placeholder="你要占卜的问题（可选）"
        :disabled="loadingStatus"
      />
    </div>

    <template v-if="!loadingStatus">
      <div class="deck-selection mb-4">
        <h3 class="section-title">2.选择塔罗牌种类（必须）</h3>
        <div class="deck-list flex gap-4">
          <div
            v-for="d in decks"
            :key="d.key"
            class="deck-card p-2 border rounded cursor-pointer"
            :class="{ active: selectedDeckKey === d.key }"
            @click="selectDeck(d.key)"
          >
            {{ d.name }}
          </div>
        </div>
      </div>

      <div class="mt-2">
        <label>
          <input type="checkbox" v-model="needReversed" /> 是否带逆位
        </label>
      </div>

      <div class="mt-2" v-if="selectedSpreadKey">
        <label>
          <input type="checkbox" v-model="needGuideCards" /> 是否抽指示牌
        </label>

        <template v-if="needGuideCards">
          <label>
            抽取指示牌数量：
            <input type="number" v-model.number="guideCardCount" min="1" max="10" style="width:50px;" />
          </label>
        </template>
      </div>

      <div class="spread-selection" v-if="selectedDeckKey">
        <h3 class="section-title">3.选择牌阵（必须）</h3>
        <div class="spread-list flex flex-wrap gap-4">
          <div
            v-for="s in spreads"
            :key="s.key"
            class="spread-card p-2 border rounded cursor-pointer"
            :class="{ active: selectedSpreadKey === s.key }"
            @click="() => { selectedSpreadKey = s.key; clickedSpread = s; }"
          >
            <div class="spread-header font-bold">
              <span class="spread-name">{{ s.name }}</span>
              <span class="spread-count">（{{ s.count }}张）</span>
            </div>
            <p class="spread-desc text-sm">{{ s.desc }}</p>
          </div>
        </div>
        <Button class="mt-4 w-full" :disabled="!selectedSpreadKey || isSpreadConfirmed" @click="confirmSpread">
          确认牌阵
        </Button>
      </div>

      <div class="hover-info-wrapper mt-4" v-if="clickedSpread">
        <div class="spread-info-bar">
          <p><strong>{{ clickedSpread?.name }}（{{ clickedSpread?.count }}张）</strong></p>
          <p>{{ clickedSpread?.desc }}</p>
          <p>适用场景：{{ clickedSpread?.usage }}</p>
          <p>
            <strong>牌位含义：</strong>
            <span v-for="(pos, index) in clickedSpread?.positions ?? []" :key="index">
              （{{ index + 1 }}）{{ pos }}
              <span v-if="index < (clickedSpread?.positions?.length ?? 0) - 1"></span>
            </span>
          </p>
        </div>
      </div>

      <div v-if="needGuideCards && isSpreadConfirmed">
        指示牌（需 {{ guideCardCount }} 张） | 已选：{{ Math.min(selectCardArr.length, guideCardCount) }} 张
      </div>
      <div v-if="isSpreadConfirmed">
        当前牌阵：{{ selectedSpread?.name }}（需 {{ selectedCardCount }} 张） | 已选：{{ Math.max(0, selectCardArr.length - (needGuideCards ? guideCardCount : 0)) }} 张
      </div>

      <div class="card-strip-wrapper" v-if="isSpreadConfirmed && !resStatus">
        <div
          class="card-strip"
          ref="cardStripWrapper"
          @mousedown="onDragStart"
          @touchstart.passive="onDragStart"
        >
          <div
            class="card"
            v-for="(i, index) in shuffledDeck"
            :key="i.no"
            :class="{ active: selectCardArr.includes(i.no) }"
            @click="selectCard(i.no)"
            :style="{
              transform: `translateX(${(index * cardPartialWidth) - viewOffset}px) ${selectCardArr.includes(i.no) ? 'translateY(-40px)' : ''}`,
              width: cardWidth + 'px',
              zIndex: selectCardArr.includes(i.no) ? 100 : index
            }"
          >
            <img :src="renderBackImage()" class="card-back" />
          </div>
        </div>
        <input
          v-show="sliderMax > 0"
          class="card-strip-slider"
          style="width: 100%; margin-top: 10px;"
          type="range"
          min="0"
          :max="sliderMax"
          v-model.number="viewOffset"
        />
      </div>
      <div class="btn mt-4" v-if="isSpreadConfirmed && !resStatus">
        <Button class="mt-4 w-full button-spacing"
                :disabled="selectCardArr.length !== totalCardCount"
                @click="getRes">
          开始占卜
        </Button>
      </div>
    </template>

    <div class="card-jx mt-4" v-else>
      <!-- 指示牌行 -->
      <div v-if="guideCards.length > 0" class="guide-cards-section mb-6">
        <h4 class="cards-section-title">指示牌</h4>
        <div class="show-card flex flex-wrap gap-4 justify-center">
          <div class="card-item" v-for="(card, index) in guideCards" :key="card.no">
            <img :class="{ rever: card.isReversed }" :src="renderIMG(card.no)" />
            <div class="card-label">
              指示牌{{ index + 1 }} - {{ card.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- 牌阵牌行 -->
      <div v-if="spreadCards.length > 0" class="spread-cards-section mb-6">
        <h4 class="cards-section-title">{{ selectedSpread?.name }}牌阵</h4>
        <div class="show-card flex flex-wrap gap-4 justify-center">
          <div class="card-item" v-for="(card, index) in spreadCards" :key="card.no">
            <img :class="{ rever: card.isReversed }" :src="renderIMG(card.no)" />
            <div class="card-label">
              （{{ index + 1 }}）{{ selectedSpread?.positions?.[index] ?? `第${index + 1}张` }} - {{ card.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- 统一的对话显示区域 -->
      <div class="conversation-container mt-4">
        <div class="conversation-history" ref="conversationHistory">
          <!-- 第一条占卜结果 -->
          <div v-if="firstDivinationResult" class="message assistant-message">
            <div class="message-header">
              <span class="message-role">塔罗牌解析</span>
            </div>
            <div class="message-content" v-html="firstDivinationResult"></div>
          </div>

          <!-- 后续对话 -->
          <div
            v-for="(msg, index) in conversationMessages"
            :key="index"
            class="message"
            :class="{ 'user-message': msg.role === 'user', 'assistant-message': msg.role === 'assistant' }"
          >
            <div class="message-header">
              <span class="message-role">{{ msg.role === 'user' ? '你' : '塔罗师' }}</span>
            </div>
            <div class="message-content" v-html="msg.content"></div>
          </div>
        </div>

        <!-- 多轮对话输入区域 -->
        <div class="conversation-input" v-if="resStatus">
          <Textarea
            v-model.trim="followUpQuestion"
            placeholder="继续提问关于这次占卜的问题..."
            :disabled="isFollowUpLoading"
            @keydown.enter.ctrl="sendFollowUpQuestion"
            class="follow-up-textarea"
          />
          <Button
            @click="sendFollowUpQuestion"
            :disabled="!followUpQuestion.trim() || isFollowUpLoading"
            class="send-btn"
          >
            {{ isFollowUpLoading ? '发送中...' : '发送 (Ctrl+Enter)' }}
          </Button>
        </div>
      </div>

      <Button class="mt-4 ml-auto block w-max" @click="resetFn">重新开始</Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import vh from 'vh-plugin'
import { marked } from 'marked'
import Typed from 'typed.js'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
// 导入你的数据配置文件
import tarotDecks from '../../data/tarot-decks.json';

// 类型定义 - 修正后的完整类型
type Spread = {
  key: string
  name: string
  count: number
  positions?: string[]
  desc?: string
  usage?: string
}

type Deck = {
  key: string
  name: string
  cardCount: number
  imagePath: string
  start?: number
  spreads: Spread[]
  cardNames?: Record<number, string>
}

type CardResult = {
  no: number
  name: string
  type?: 'guide' | 'spread'
  isReversed: boolean
}

type ConversationMessage = {
  role: 'user' | 'assistant'
  content: string
}

// 主题相关
const isDarkMode = ref(false)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('tarot-theme', isDarkMode.value ? 'dark' : 'light')
}

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('tarot-theme')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  } else {
    // 检测系统主题偏好
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})

// 多轮对话相关
const conversationMessages = ref<ConversationMessage[]>([])
const followUpQuestion = ref('')
const isFollowUpLoading = ref(false)
const currentSessionId = ref<string | null>(null)
const conversationHistory = ref<HTMLDivElement | null>(null)
const firstDivinationResult = ref<string>('')

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (conversationHistory.value) {
      conversationHistory.value.scrollTop = conversationHistory.value.scrollHeight;
    }
  });
};

const typedText = ref<HTMLParagraphElement | null>(null)
let typedInstance: Typed | null = null

// 修改 renderRES 函数，不再使用 Typed.js，直接显示内容
const renderRES = (html: string) => {
  firstDivinationResult.value = html
  scrollToBottom()
};

// 把可能是 string 或 Promise<string> 的结果，统一变成 string
const parseMdToHtml = async (md: string): Promise<string> => {
  const maybe = marked.parse(md);
  return typeof maybe === 'string' ? maybe : await maybe;
};

// 修改 decks 的定义，直接使用导入的数据
const decks = ref<Deck[]>(tarotDecks as Deck[]);
const selectedDeckKey = ref('')
const selectedDeck = computed(() => decks.value.find(d => d.key === selectedDeckKey.value))
const spreads = computed(() => selectedDeck.value?.spreads ?? [])
const selectedSpreadKey = ref<Spread['key']>('')
const isSpreadConfirmed = ref(false)
const clickedSpread = ref<Spread | null>(null)
const needReversed = ref(true)
const selectedSpread = computed(() => spreads.value.find(s => s.key === selectedSpreadKey.value))
const selectedCardCount = computed(() => isSpreadConfirmed.value ? (selectedSpread.value?.count ?? 0) : 0)
const selectCardArr = ref<number[]>([])
watch(selectedSpreadKey, () => { selectCardArr.value = [] })

// 修正 shuffledDeck 的初始化
const shuffledDeck = ref<CardResult[]>([])
const initShuffledDeck = () => {
  const deckCount = selectedDeck.value?.cardCount ?? 78
  const deck: CardResult[] = Array.from({ length: deckCount }, (_, i) => ({
    no: i,
    name: selectedDeck.value?.cardNames?.[i] ?? `第${i}张`,
    isReversed: false
  }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  shuffledDeck.value = deck
}

const cardStripWrapper = ref<HTMLDivElement | null>(null)
const cardWidth = 88
let isDragging = false
let dragStartX = 0

const viewOffset = ref(0)
let dragStartOffset = 0
const containerWidth = ref(0)

const cardPartialWidth = cardWidth * 0.6

const totalCardsWidth = computed(() => {
  const deck = shuffledDeck.value
  if (!deck || deck.length === 0) return 0
  return (deck.length - 1) * cardPartialWidth + cardWidth
})

const sliderMax = computed(() => {
  return Math.max(0, totalCardsWidth.value - containerWidth.value)
})

const onWheelWithShift = (e: WheelEvent) => {
  if (e.shiftKey && isSpreadConfirmed.value) {
    e.preventDefault();
    const newOffset = viewOffset.value + (e.deltaY > 0 ? 50 : -50);
    viewOffset.value = Math.max(0, Math.min(newOffset, sliderMax.value));
  }
};

// 是否启用抽指示牌（用户勾选）
const needGuideCards = ref(false)

// 指示牌数量（默认可以是3，可弹窗选择 1-10）
const guideCardCount = ref(1)

// 计算总抽牌数 = 指示牌数量 + 牌阵数量
const totalCardCount = computed(() =>
  (needGuideCards.value ? guideCardCount.value : 0) + (selectedSpread.value?.count ?? 0)
)

onMounted(() => {
  window.addEventListener('wheel', onWheelWithShift, { passive: false });

  if (cardStripWrapper.value) {
    containerWidth.value = cardStripWrapper.value.clientWidth;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('wheel', onWheelWithShift);

  if (typedInstance) {
    typedInstance.destroy();
    typedInstance = null;
  }
});

const onDragStart = (e: MouseEvent | TouchEvent) => {
  const el = cardStripWrapper.value; if (!el) return
  isDragging = true
  dragStartX = 'touches' in e ? e.touches[0].clientX : e.clientX
  dragStartOffset = viewOffset.value
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
  window.addEventListener('touchmove', onDragMove as any, { passive: false })
  window.addEventListener('touchend', onDragEnd)
}

const SCALE = 3
const onDragMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging) return
  if ('preventDefault' in e) e.preventDefault()

  const x = 'touches' in e ? e.touches[0].clientX : e.clientX
  const dx = x - dragStartX
  const newOffset = dragStartOffset - dx * SCALE

  viewOffset.value = Math.max(0, Math.min(newOffset, sliderMax.value));
}

const onDragEnd = () => {
  isDragging = false
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('touchmove', onDragMove as any)
  window.removeEventListener('touchend', onDragEnd)
}

const recalcAfterDOMUpdate = async () => { }

watch([selectedDeckKey, isSpreadConfirmed, () => shuffledDeck.value.length], recalcAfterDOMUpdate)

const textValue = ref('')
const loadingStatus = ref(false)
const resStatus = ref(false)
const cardResult = ref<CardResult[]>([])

const selectDeck = (key: string) => {
  selectedDeckKey.value = key
  selectedSpreadKey.value = ''
  clickedSpread.value = null
  selectCardArr.value = []
  initShuffledDeck()
  recalcAfterDOMUpdate()
}

const selectCard = (id: number) => {
  // 如果已选过，再点击取消
  if (selectCardArr.value.includes(id)) {
    selectCardArr.value = selectCardArr.value.filter(i => i !== id)
    return
  }

  // 超过总抽牌数，不允许再选
  if (selectCardArr.value.length >= totalCardCount.value) return

  selectCardArr.value.push(id) // 按顺序加入数组
}

// 修正计算属性的类型注解
const guideCards = computed((): CardResult[] => {
  return cardResult.value.filter(card => card.type === 'guide')
})

const spreadCards = computed((): CardResult[] => {
  return cardResult.value.filter(card => card.type === 'spread')
})

const confirmSpread = async () => {
  if (!selectedSpreadKey.value) return
  isSpreadConfirmed.value = true
  selectCardArr.value = []

  await nextTick()
  if (cardStripWrapper.value) {
    containerWidth.value = cardStripWrapper.value.clientWidth
  }
}

const resetFn = () => {
  selectCardArr.value = []
  cardResult.value = []
  resStatus.value = false
  loadingStatus.value = false
  isSpreadConfirmed.value = false
  clickedSpread.value = null
  needReversed.value = true
  selectedDeckKey.value = ''
  selectedSpreadKey.value = ''
  needGuideCards.value = false
  guideCardCount.value = 1
  conversationMessages.value = []
  firstDivinationResult.value = ''
  followUpQuestion.value = ''
  currentSessionId.value = null
  initShuffledDeck()
  textValue.value = ''
  if (typedInstance) { typedInstance.destroy(); typedInstance = null }
}

const base = import.meta.env.BASE_URL

const renderBackImage = () => {
  const path = selectedDeck.value?.imagePath ?? 'cards/card/'
  return `${base}${path}back.jpg`
}

const renderIMG = (no: number): string => {
  const path = selectedDeck.value?.imagePath ?? 'cards/card/'
  const start = selectedDeck.value?.start ?? 0
  const fileNo = no + start
  return `${base}${path}${fileNo}.jpg`
}

// 处理API响应数据的函数
const parseApiResponse = (responseText: string): string => {
  try {
    // 尝试解析JSON响应
    const jsonData = JSON.parse(responseText)
    if (jsonData.content) {
      return jsonData.content
    }
  } catch (e) {
    // 如果不是JSON，直接返回原文本
  }
  return responseText
}

// 修正 getRes 函数
const getRes = async () => {
  if (!selectedSpread.value) return
  loadingStatus.value = true

  // 生成抽牌结果，同时标记类型（guide / spread）
  cardResult.value = selectCardArr.value.map((cardNo, index) => {
    // 从 shuffledDeck 中找到对应的卡牌信息
    const cardInfo = shuffledDeck.value.find(card => card.no === cardNo)

    return {
      no: cardNo,
      name: cardInfo?.name || selectedDeck.value?.cardNames?.[cardNo] || `第${cardNo}张`,
      type: needGuideCards.value && index < guideCardCount.value ? 'guide' as const : 'spread' as const,
      isReversed: needReversed.value ? Math.random() > 0.5 : false
    }
  })

  vh.showLoading()
  try {
    const res = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: textValue.value,
        pms: cardResult.value,
        spread: {
          key: selectedSpread.value.key,
          name: selectedSpread.value.name,
          count: selectedSpread.value.count,
          positions: selectedSpread.value.positions ?? []
        },
        deck: {
          key: selectedDeck.value?.key ?? '',
          name: selectedDeck.value?.name ?? ''
        }
      })
    })

    if (!res.ok) throw new Error(`API response was not ok: ${res.statusText}`)

    const resText = await res.text()
    // 处理API返回的数据
    const content = parseApiResponse(resText)
    const html = await parseMdToHtml(content)

    // 保存会话ID（如果有的话）
    try {
      const jsonData = JSON.parse(resText)
      if (jsonData.sessionId) {
        currentSessionId.value = jsonData.sessionId
      }
    } catch (e) {
      // 忽略JSON解析错误
    }

    resStatus.value = true
    await nextTick()
    renderRES(html)
  } catch (error) {
    console.error('占卜请求失败:', error)
  } finally {
    vh.hideLoading()
  }
}

// 发送后续问题
const sendFollowUpQuestion = async () => {
  if (!followUpQuestion.value.trim()) return

  isFollowUpLoading.value = true

  // 添加用户问题到对话历史
  conversationMessages.value.push({
    role: 'user',
    content: followUpQuestion.value
  } as ConversationMessage)

  const userQuestion = followUpQuestion.value
  followUpQuestion.value = ''

  try {
    const res = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: userQuestion,
        sessionId: currentSessionId.value,
        followUp: true
      })
    })

    if (!res.ok) throw new Error(`API response was not ok: ${res.statusText}`)

    const resText = await res.text()
    const jsonData = JSON.parse(resText)

    // 处理回复内容
    const content = jsonData.content || resText
    const html = await parseMdToHtml(content)

    conversationMessages.value.push({
      role: 'assistant',
      content: html
    } as ConversationMessage)

    // 更新会话ID
    if (jsonData.sessionId) {
      currentSessionId.value = jsonData.sessionId
    }

    scrollToBottom()
  } catch (error) {
    console.error('发送后续问题失败:', error)
    // 移除用户问题（因为发送失败）
    conversationMessages.value.pop()
  } finally {
    isFollowUpLoading.value = false
  }
}
</script>

<style scoped>
/* 基础样式 */
.Home {
  position: relative;
  padding: 20px;
  min-height: 100vh;
  transition: all 0.3s ease;
}

/* 深色模式 */
.dark-mode {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

.dark-mode .section-title {
  color: #f39c12;
  border-bottom-color: #8b6914;
}

.dark-mode .deck-card,
.dark-mode .spread-card {
  background-color: #2d2d2d;
  border-color: #444;
  color: #e0e0e0;
}

.dark-mode .deck-card:hover,
.dark-mode .spread-card:hover {
  background-color: #3d3d3d;
}

.dark-mode .deck-card.active,
.dark-mode .spread-card.active {
  border-color: #f39c12;
  background-color: #3d2a00;
}

.dark-mode .spread-info-bar {
  background-color: #2d2d2d;
  color: #e0e0e0;
}

.dark-mode .guide-cards-section {
  background-color: #1e2a3a;
  border-color: #333;
}

.dark-mode .spread-cards-section {
  background-color: #3a2e1e;
  border-color: #333;
}

.dark-mode .conversation-container {
  background-color: #2d2d2d;
  border-color: #444;
}

.dark-mode .message.user-message {
  background-color: #1e3a8a;
}

.dark-mode .message.assistant-message {
  background-color: #374151;
}

.dark-mode input,
.dark-mode textarea {
  background-color: #2d2d2d;
  border-color: #444;
  color: #e0e0e0;
}

.dark-mode input:focus,
.dark-mode textarea:focus {
  border-color: #f39c12;
}

.dark-mode .conversation-input {
  background-color: #2d2d2d;
  border-top-color: #444;
}

/* 主题切换按钮 */
.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.theme-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #ddd;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.theme-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.dark-mode .theme-btn {
  background: rgba(45, 45, 45, 0.9);
  border-color: #555;
  color: #e0e0e0;
}

/* 对话容器样式 */
.conversation-container {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 0;
  margin-top: 20px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.conversation-history {
  max-height: 500px;
  overflow-y: auto;
  padding: 16px;
}

.conversation-history::-webkit-scrollbar {
  width: 6px;
}

.conversation-history::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.conversation-history::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.conversation-history::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.message {
  margin-bottom: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 85%;
  word-wrap: break-word;
}

.user-message {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-left: auto;
  margin-right: 0;
}


.user-message .message-header {
  text-align: right;
   }

.assistant-message {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  margin-left: 0;
  margin-right: auto;
}

.assistant-message .message-header {
  text-align: left;
}

.message-header {
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: 8px;
  opacity: 0.9;
}

.message-content {
  line-height: 1.6;
}

.conversation-input {
  border-top: 1px solid #e0e0e0;
  padding: 16px;
  background: #ffffff;
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.follow-up-textarea {
  flex: 1;
  min-height: 60px;
  resize: vertical;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
}

.follow-up-textarea:focus {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.send-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 原有样式保持不变 */
.hover-info-wrapper {
  height: 140px;
  margin-bottom: 12px;
}

.spread-info-bar {
  position: relative;
  background: #fff8f0;
  padding: 6px;
  border-radius: 4px;
}

.spread-selection {
  margin-bottom: 24px;
}

.spread-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.spread-card {
  background: #fdf6f0;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  width: 200px;
  cursor: pointer;
  transition: all 0.2s;
}

.spread-header {
  font-weight: bold;
  margin-bottom: 6px;
}

.spread-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.spread-card.active {
  border-color: #f39c12;
  box-shadow: 0 0 0 3px rgba(243,156,18,0.2);
}

.deck-card {
  background: #fdf6f0;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.deck-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.deck-card.active {
  border-color: #f39c12;
  box-shadow: 0 0 0 2px rgba(243,156,18,0.3);
}

.selected-spread-info {
  margin-top: 12px;
  font-size: 14px;
  color: #444;
}

.card-strip-wrapper {
  position: relative;
  width: 100%;
  overflow-x: visible;
  height: 200px;
  margin-top: 12px;
}

.card-strip {
  position: relative;
  height: 100%;
  cursor: grab;
}

.card {
  position: absolute;
  bottom: 0;
  width: 88px;
  transition: transform 0.2s, z-index 0.2s;
}

.card.active {
  border: 2px solid gold;
  box-shadow: 0 0 10px rgba(255,215,0,0.6);
  z-index: 100;
}

.card img.card-back {
  width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.show-card {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.card-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-item img {
  width: 100px;
  height: auto;
}

.card-item img.rever {
  transform: rotateY(180deg);
}

.card-label {
  margin-top: 4px;
  font-size: 14px;
  color: #666;
}

.card-strip-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  background: #ddd;
  border-radius: 5px;
  outline: none;
  opacity: 0.7;
  transition: opacity .2s;
  margin-top: 15px;
}

.card-strip-slider:hover {
  opacity: 1;
}

.card-strip-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #f39c12;
  cursor: pointer;
  border-radius: 50%;
}

.card-strip-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #f39c12;
  cursor: pointer;
  border-radius: 50%;
}

.section-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #8b4513;
  border-bottom: 2px solid #deb887;
  padding-bottom: 8px;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.button-spacing {
  margin-top: 40px;
}

.guide-cards-section, .spread-cards-section {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.cards-section-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #8b4513;
  margin-bottom: 12px;
  text-align: center;
  border-bottom: 1px solid #deb887;
  padding-bottom: 8px;
}

.guide-cards-section {
  background: #f0f8ff;
}

.spread-cards-section {
  background: #fff8f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .Home {
    padding: 15px;
  }

  .theme-toggle {
    top: 15px;
    right: 15px;
  }

  .theme-btn {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }

  .spread-list {
    flex-direction: column;
  }

  .spread-card, .deck-card {
    width: 100%;
  }

  .card-item img {
    width: min(22vw, 90px);
  }

  .card-label {
    font-size: 12px;
  }

  .message {
    max-width: 95%;
  }

  .conversation-input {
    flex-direction: column;
  }

  .follow-up-textarea {
    min-height: 80px;
  }

  .send-btn {
    width: 100%;
    padding: 14px;
  }

  .conversation-history {
    max-height: 300px;
  }
}

/* 输入框样式 */
input[type="checkbox"] {
  margin-right: 8px;
  transform: scale(1.2);
}

input[type="number"] {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 8px;
  margin-left: 8px;
}

label {
  display: inline-flex;
  align-items: center;
  margin-right: 16px;
  margin-bottom: 8px;
  font-weight: 500;
  cursor: pointer;
}
</style>
