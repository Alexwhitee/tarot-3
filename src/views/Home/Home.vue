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

<!--      <div class="selected-spread-info mt-4" v-if="isSpreadConfirmed">-->
<!--        当前牌阵：{{ selectedSpread?.name }}（需 {{ selectedCardCount }} 张） | 已选：{{ selectCardArr.length }} 张-->
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
<!--      <div class="btn mt-4">-->
<!--        <Button class="mt-4 w-full button-spacing" :disabled="selectCardArr.length !== selectedCardCount" @click="getRes">-->
<!--          开始占卜-->
<!--        </Button>-->
<!--      </div>-->
<!--    </template>-->

<!--    <div class="card-jx mt-4" v-else>-->
<!--      <div class="show-card flex flex-wrap gap-4">-->
<!--        <div class="card-item" v-for="(i, index) in cardResult" :key="i.no">-->
<!--          <img :class="{ rever: i.isReversed }" :src="renderIMG(i.no)" />-->
<!--          <div class="card-label">-->
<!--            （{{ index + 1 }}）{{ selectedSpread?.positions?.[index] ?? `第${index + 1}张` }}-->
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
<!--  spreads: Spread[]-->
<!--}-->
<!--type CardResult = {-->
<!--  no: number-->
<!--  isReversed: boolean-->
<!--}-->

<!--const typedText = ref<HTMLParagraphElement | null>(null)-->
<!--let typedInstance: Typed | null = null-->
<!--const renderRES = async (md: string) => {-->
<!--  if (!typedText.value) return-->

<!--  const renderedMarkdown = marked.parse(md)-->

<!--  if (typedInstance) typedInstance.destroy()-->
<!--  typedInstance = new Typed(typedText.value, {-->
<!--    strings: [renderedMarkdown],-->
<!--    typeSpeed: 16,-->
<!--    showCursor: false,-->
<!--    contentType: 'html',-->
<!--  })-->
<!--}-->

<!--// 修改 decks 的定义，直接使用导入的数据-->
<!--// const decks = ref<Deck[]>([ ... ]); // 移除旧代码-->
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

<!--const onDragMove = (e: MouseEvent | TouchEvent) => {-->
<!--  if (!isDragging) return-->
<!--  if ('preventDefault' in e) e.preventDefault()-->

<!--  const x = 'touches' in e ? e.touches[0].clientX : e.clientX-->
<!--  const dx = x - dragStartX-->
<!--  const newOffset = dragStartOffset - dx-->

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
<!--  if (selectCardArr.value.includes(id)) { selectCardArr.value = selectCardArr.value.filter(i => i !== id); return }-->
<!--  if (selectCardArr.value.length >= selectedCardCount.value) return-->
<!--  selectCardArr.value.push(id)-->
<!--}-->
<!--const confirmSpread = async () => {-->
<!--  if (!selectedSpreadKey.value) return-->
<!--  isSpreadConfirmed.value = true-->
<!--  selectCardArr.value = []-->

<!--  await nextTick()-->
<!--  if (cardStripWrapper.value) {-->
<!--    containerWidth.value = cardStripWrapper.value.clientWidth-->
<!--  }-->
<!--}-->
<!--const getRes = async () => {-->
<!--  loadingStatus.value = true-->
<!--  cardResult.value = selectCardArr.value.map(i => ({ no: i, isReversed: needReversed.value ? Math.random() > 0.5 : false }))-->
<!--  vh.showLoading()-->
<!--  const res = await fetch('/api', {-->
<!--    method: 'POST',-->
<!--    body: JSON.stringify({-->
<!--      text: textValue.value,-->
<!--      pms: cardResult.value,-->
<!--      spread: {-->
<!--        key: selectedSpread.value?.key ?? '',-->
<!--        name: selectedSpread.value?.name ?? '',-->
<!--        count: selectedSpread.value?.count ?? 0,-->
<!--        positions: selectedSpread.value?.positions ?? []-->
<!--      },-->
<!--      deck: {-->
<!--        key: selectedDeck.value?.key ?? '',-->
<!--        name: selectedDeck.value?.name ?? ''-->
<!--      }-->
<!--    })-->
<!--  })-->
<!--  vh.hideLoading()-->
<!--  resStatus.value = true-->
<!--  const resText = await res.text()-->
<!--  await nextTick()-->
<!--  renderRES(resText)-->
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
<!--  initShuffledDeck()-->
<!--  textValue.value = ''-->
<!--  if (typedInstance) { typedInstance.destroy(); typedInstance = null }-->
<!--}-->

<!--const renderBackImage = () => {-->
<!--  const path = selectedDeck.value?.imagePath ?? '../../assets/images/card/'-->
<!--  return new URL(`${path}back.jpg`, import.meta.url).href-->
<!--}-->

<!--const renderIMG = (no: number) => {-->
<!--  const path = selectedDeck.value?.imagePath ?? '../../assets/images/card/'-->
<!--  return new URL(`${path}${no}.jpg`, import.meta.url).href-->
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
<!--</style>-->

<template>
  <section class="Home">
    <div class="text">
      <h3 class="section-title">1.深呼吸，屏除杂念，集中注意力，写下并默念你的问题，开始你的塔罗占卜之旅</h3>
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

      <div class="selected-spread-info mt-4" v-if="isSpreadConfirmed">
        当前牌阵：{{ selectedSpread?.name }}（需 {{ selectedCardCount }} 张） | 已选：{{ selectCardArr.length }} 张
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
      <div class="btn mt-4">
        <Button class="mt-4 w-full button-spacing" :disabled="selectCardArr.length !== selectedCardCount" @click="getRes">
          开始占卜
        </Button>
      </div>
    </template>

    <div class="card-jx mt-4" v-else>
      <div class="show-card flex flex-wrap gap-4">
        <div class="card-item" v-for="(i, index) in cardResult" :key="i.no">
          <img :class="{ rever: i.isReversed }" :src="renderIMG(i.no)" />
          <div class="card-label">
            （{{ index + 1 }}）{{ selectedSpread?.positions?.[index] ?? `第${index + 1}张` }}
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
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import vh from 'vh-plugin'
import { marked } from 'marked'
import Typed from 'typed.js'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
// 导入你的数据配置文件
import tarotDecks from '../../data/tarot-decks.json';
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
  spreads: Spread[]
}
type CardResult = {
  no: number
  isReversed: boolean
}

const typedText = ref<HTMLParagraphElement | null>(null)
let typedInstance: Typed | null = null
const renderRES = async (md: string) => {
  if (!typedText.value) return

  const renderedMarkdown = marked.parse(md)

  if (typedInstance) typedInstance.destroy()
  typedInstance = new Typed(typedText.value, {
    strings: [renderedMarkdown],
    typeSpeed: 16,
    showCursor: false,
    contentType: 'html',
  })
}

// 修改 decks 的定义，直接使用导入的数据
const decks = ref<Deck[]>(tarotDecks as Deck[]); // 使用导入的数据并进行类型断言
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

const shuffledDeck = ref<CardResult[]>([])
const initShuffledDeck = () => {
  const deckCount = selectedDeck.value?.cardCount ?? 78
  const deck: CardResult[] = Array.from({ length: deckCount }, (_, i) => ({ no: i, isReversed: false }))
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

const onDragMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging) return
  if ('preventDefault' in e) e.preventDefault()

  const x = 'touches' in e ? e.touches[0].clientX : e.clientX
  const dx = x - dragStartX
  const newOffset = dragStartOffset - dx

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
  if (selectCardArr.value.includes(id)) { selectCardArr.value = selectCardArr.value.filter(i => i !== id); return }
  if (selectCardArr.value.length >= selectedCardCount.value) return
  selectCardArr.value.push(id)
}
const confirmSpread = async () => {
  if (!selectedSpreadKey.value) return
  isSpreadConfirmed.value = true
  selectCardArr.value = []

  await nextTick()
  if (cardStripWrapper.value) {
    containerWidth.value = cardStripWrapper.value.clientWidth
  }
}

// 修正后的 getRes 函数
const getRes = async () => {
  loadingStatus.value = true
  cardResult.value = selectCardArr.value.map(i => ({ no: i, isReversed: needReversed.value ? Math.random() > 0.5 : false }))
  vh.showLoading()
  const res = await fetch('/api', {
    method: 'POST',
    body: JSON.stringify({
      text: textValue.value,
      pms: cardResult.value,
      spread: {
        key: selectedSpread.value?.key ?? '',
        name: selectedSpread.value?.name ?? '',
        count: selectedSpread.value?.count ?? 0,
        positions: selectedSpread.value?.positions ?? []
      },
      deck: {
        key: selectedDeck.value?.key ?? '',
        name: selectedDeck.value?.name ?? ''
      }
    })
  })
  vh.hideLoading()
  resStatus.value = true
  const resText = await res.text()
  await nextTick()
  // 在这里直接将纯字符串传给 renderRES，避免类型错误
  renderRES(resText)
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
  initShuffledDeck()
  textValue.value = ''
  if (typedInstance) { typedInstance.destroy(); typedInstance = null }
}

const renderBackImage = () => {
  const path = selectedDeck.value?.imagePath ?? '../../assets/images/card/'
  return new URL(`${path}back.jpg`, import.meta.url).href
}

const renderIMG = (no: number) => {
  const path = selectedDeck.value?.imagePath ?? '../../assets/images/card/'
  return new URL(`${path}${no}.jpg`, import.meta.url).href
}

onMounted(() => {
  if (cardStripWrapper.value) {
    containerWidth.value = cardStripWrapper.value.clientWidth
  }
})

onBeforeUnmount(() => { if (typedInstance) { typedInstance.destroy(); typedInstance = null } })
</script>

<style scoped lang="less">
@import 'Home.less';

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
  .spread-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
}

.spread-card {
  background: #fdf6f0;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  width: 200px;
  cursor: pointer;
  transition: all 0.2s;

  .spread-header {
    font-weight: bold;
    margin-bottom: 6px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  &.active {
    border-color: #f39c12;
    box-shadow: 0 0 0 3px rgba(243,156,18,0.2);
  }
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

.card-label {
  margin-top: 4px;
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .spread-list {
    flex-direction: column;
  }
  .spread-card {
    width: 100%;
  }
  .card-item img {
    width: min(22vw, 90px);
  }
  .card-label {
    font-size: 12px;
  }
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
  margin-top: 40px; /* 增加上外边距，向下平移 */
}
</style>
