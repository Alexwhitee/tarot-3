<!--&lt;!&ndash;<template>&ndash;&gt;-->
<!--&lt;!&ndash;  <section class="Home">&ndash;&gt;-->
<!--&lt;!&ndash;    <div class="text">&ndash;&gt;-->
<!--&lt;!&ndash;      <h3>深呼吸，屏除杂念，集中注意力，默念你的问题，开始你的塔罗占卜之旅</h3>&ndash;&gt;-->
<!--&lt;!&ndash;      <Textarea&ndash;&gt;-->
<!--&lt;!&ndash;        v-model.trim="textValue"&ndash;&gt;-->
<!--&lt;!&ndash;        placeholder="你要占卜的问题（可选）"&ndash;&gt;-->
<!--&lt;!&ndash;        :disabled="loadingStatus"&ndash;&gt;-->
<!--&lt;!&ndash;      />&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->

<!--&lt;!&ndash;    <template v-if="!loadingStatus">&ndash;&gt;-->
<!--&lt;!&ndash;      &lt;!&ndash; 固定牌阵信息条 &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="hover-info-wrapper">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="spread-info-bar" v-if="clickedSpread">&ndash;&gt;-->
<!--&lt;!&ndash;          <p><strong>{{ clickedSpread.name }}（{{ clickedSpread.count }}张）</strong></p>&ndash;&gt;-->
<!--&lt;!&ndash;          <p>{{ clickedSpread.desc }}</p>&ndash;&gt;-->
<!--&lt;!&ndash;          <p>适用场景：{{ clickedSpread.usage }}</p>&ndash;&gt;-->
<!--&lt;!&ndash;          <p>&ndash;&gt;-->
<!--&lt;!&ndash;            <strong>牌位含义：</strong>&ndash;&gt;-->
<!--&lt;!&ndash;            <span v-for="(pos, index) in clickedSpread.positions" :key="pos">&ndash;&gt;-->
<!--&lt;!&ndash;              （{{ index + 1 }}）{{ pos }}&ndash;&gt;-->
<!--&lt;!&ndash;              <span v-if="index < clickedSpread.positions.length - 1"> </span>&ndash;&gt;-->
<!--&lt;!&ndash;            </span>&ndash;&gt;-->
<!--&lt;!&ndash;          </p>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->

<!--&lt;!&ndash;      &lt;!&ndash; 牌阵选择区 &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="spread-selection">&ndash;&gt;-->
<!--&lt;!&ndash;        <h3 class="text nb">选择牌阵（必须）</h3>&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="spread-list">&ndash;&gt;-->
<!--&lt;!&ndash;          <div&ndash;&gt;-->
<!--&lt;!&ndash;            v-for="s in spreads"&ndash;&gt;-->
<!--&lt;!&ndash;            :key="s.key"&ndash;&gt;-->
<!--&lt;!&ndash;            class="spread-card"&ndash;&gt;-->
<!--&lt;!&ndash;            :class="{ active: selectedSpreadKey === s.key }"&ndash;&gt;-->
<!--&lt;!&ndash;            @click="() => {&ndash;&gt;-->
<!--&lt;!&ndash;              selectedSpreadKey = s.key;&ndash;&gt;-->
<!--&lt;!&ndash;              clickedSpread = s;&ndash;&gt;-->
<!--&lt;!&ndash;            }"&ndash;&gt;-->
<!--&lt;!&ndash;          >&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="spread-header">&ndash;&gt;-->
<!--&lt;!&ndash;              <span class="spread-name">{{ s.name }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;              <span class="spread-count">（{{ s.count }}张）</span>&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
<!--&lt;!&ndash;            <p class="spread-desc">{{ s.desc }}</p>&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->

<!--&lt;!&ndash;        <Button&ndash;&gt;-->
<!--&lt;!&ndash;          class="mt-4 w-full"&ndash;&gt;-->
<!--&lt;!&ndash;          :disabled="!selectedSpreadKey || isSpreadConfirmed"&ndash;&gt;-->
<!--&lt;!&ndash;          @click="confirmSpread"&ndash;&gt;-->
<!--&lt;!&ndash;        >&ndash;&gt;-->
<!--&lt;!&ndash;          确认牌阵&ndash;&gt;-->
<!--&lt;!&ndash;        </Button>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->

<!--&lt;!&ndash;      &lt;!&ndash; 已选牌阵信息 &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="selected-spread-info" v-if="isSpreadConfirmed">&ndash;&gt;-->
<!--&lt;!&ndash;        当前牌阵：{{ selectedSpread.name }}（需 {{ selectedCardCount }} 张） |&ndash;&gt;-->
<!--&lt;!&ndash;        已选：{{ selectCardArr.length }} 张&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->

<!--&lt;!&ndash;      &lt;!&ndash; 抽牌区 &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="card-list" v-if="isSpreadConfirmed && !resStatus">&ndash;&gt;-->
<!--&lt;!&ndash;        <div&ndash;&gt;-->
<!--&lt;!&ndash;          class="card"&ndash;&gt;-->
<!--&lt;!&ndash;          v-for="i in randomCard"&ndash;&gt;-->
<!--&lt;!&ndash;          :key="i"&ndash;&gt;-->
<!--&lt;!&ndash;          :style="{ marginRight: cardMargin + 'px' }"&ndash;&gt;-->
<!--&lt;!&ndash;          @click="selectCard(i)"&ndash;&gt;-->
<!--&lt;!&ndash;          :class="{ active: selectCardArr.includes(i) }"&ndash;&gt;-->
<!--&lt;!&ndash;        ></div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->

<!--&lt;!&ndash;      &lt;!&ndash; 是否带逆位开关 &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="mt-2">&ndash;&gt;-->
<!--&lt;!&ndash;        <label>&ndash;&gt;-->
<!--&lt;!&ndash;          <input type="checkbox" v-model="needReversed" /> 是否带逆位&ndash;&gt;-->
<!--&lt;!&ndash;        </label>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->

<!--&lt;!&ndash;      &lt;!&ndash; 开始占卜按钮 &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="btn">&ndash;&gt;-->
<!--&lt;!&ndash;        <Button&ndash;&gt;-->
<!--&lt;!&ndash;          class="mt-4 w-full"&ndash;&gt;-->
<!--&lt;!&ndash;          :disabled="selectCardArr.length !== selectedCardCount"&ndash;&gt;-->
<!--&lt;!&ndash;          @click="getRes"&ndash;&gt;-->
<!--&lt;!&ndash;        >&ndash;&gt;-->
<!--&lt;!&ndash;          开始占卜&ndash;&gt;-->
<!--&lt;!&ndash;        </Button>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;    </template>&ndash;&gt;-->

<!--&lt;!&ndash;    &lt;!&ndash; 占卜结果 &ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;    <div class="card-jx" v-else>&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="show-card">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="card-item" v-for="(i, index) in cardResult" :key="i.no">&ndash;&gt;-->
<!--&lt;!&ndash;          <img :class="{ rever: i.isReversed }" :src="renderIMG(`${i.no}.jpg`)"/>&ndash;&gt;-->
<!--&lt;!&ndash;          <div class="card-label">&ndash;&gt;-->
<!--&lt;!&ndash;            （{{ index + 1 }}）{{ selectedSpread.positions?.[index] ?? `第${index + 1}张` }}&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->

<!--&lt;!&ndash;      <Alert class="mt-4" v-if="resStatus">&ndash;&gt;-->
<!--&lt;!&ndash;        <AlertTitle>塔罗牌解析：</AlertTitle>&ndash;&gt;-->
<!--&lt;!&ndash;        <AlertDescription>&ndash;&gt;-->
<!--&lt;!&ndash;          <p class="[&>p]:indent-8 [&>p]:pt-2" ref="typedText"></p>&ndash;&gt;-->
<!--&lt;!&ndash;        </AlertDescription>&ndash;&gt;-->
<!--&lt;!&ndash;      </Alert>&ndash;&gt;-->
<!--&lt;!&ndash;      <Button class="mt-4 ml-auto block w-max" @click="resetFn">重新开始</Button>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->
<!--&lt;!&ndash;  </section>&ndash;&gt;-->
<!--&lt;!&ndash;</template>&ndash;&gt;-->

<!--&lt;!&ndash;<script setup lang="ts">&ndash;&gt;-->
<!--&lt;!&ndash;import { ref, computed, watch } from 'vue'&ndash;&gt;-->
<!--&lt;!&ndash;import vh from 'vh-plugin'&ndash;&gt;-->
<!--&lt;!&ndash;import { marked } from 'marked'&ndash;&gt;-->
<!--&lt;!&ndash;import Typed from 'typed.js'&ndash;&gt;-->
<!--&lt;!&ndash;import { Button } from '@/components/ui/button'&ndash;&gt;-->
<!--&lt;!&ndash;import { Textarea } from '@/components/ui/textarea'&ndash;&gt;-->
<!--&lt;!&ndash;import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'&ndash;&gt;-->

<!--&lt;!&ndash;type Spread = {&ndash;&gt;-->
<!--&lt;!&ndash;  key: string&ndash;&gt;-->
<!--&lt;!&ndash;  name: string&ndash;&gt;-->
<!--&lt;!&ndash;  count: number&ndash;&gt;-->
<!--&lt;!&ndash;  positions?: string[]&ndash;&gt;-->
<!--&lt;!&ndash;  desc?: string&ndash;&gt;-->
<!--&lt;!&ndash;  usage?: string&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;type CardResult = { no: number; isReversed: boolean }&ndash;&gt;-->

<!--&lt;!&ndash;const spreads = ref<Spread[]>([&ndash;&gt;-->
<!--&lt;!&ndash;  { key: 'one', name: '单张指引', count: 1, positions: ['指引'], desc: '快速指引，适合简单问题', usage: '适合日常小问题或需要直接指引时使用' },&ndash;&gt;-->
<!--&lt;!&ndash;  { key: 'two', name: '双牌对比', count: 2, positions: ['现状','对策'], desc: '简洁对比，快速决策', usage: '在两难选择或需立即行动前使用' },&ndash;&gt;-->
<!--&lt;!&ndash;  { key: 'three', name: '三张牌阵', count: 3, positions: ['过去','现在','未来'], desc: '经典三牌占卜', usage: '用于了解事件发展脉络及未来趋势' },&ndash;&gt;-->
<!--&lt;!&ndash;])&ndash;&gt;-->

<!--&lt;!&ndash;const selectedSpreadKey = ref<Spread['key']>('')&ndash;&gt;-->
<!--&lt;!&ndash;const isSpreadConfirmed = ref(false)&ndash;&gt;-->
<!--&lt;!&ndash;const clickedSpread = ref<Spread | null>(null)&ndash;&gt;-->
<!--&lt;!&ndash;const needReversed = ref(true) // 是否带逆位开关&ndash;&gt;-->

<!--&lt;!&ndash;// 当前选中牌阵&ndash;&gt;-->
<!--&lt;!&ndash;const selectedSpread = computed(() =>&ndash;&gt;-->
<!--&lt;!&ndash;  spreads.value.find(s => s.key === selectedSpreadKey.value)!&ndash;&gt;-->
<!--&lt;!&ndash;)&ndash;&gt;-->
<!--&lt;!&ndash;const selectedCardCount = computed(() =>&ndash;&gt;-->
<!--&lt;!&ndash;  isSpreadConfirmed.value ? (selectedSpread.value?.count ?? 0) : 0&ndash;&gt;-->
<!--&lt;!&ndash;)&ndash;&gt;-->

<!--&lt;!&ndash;// 切换牌阵时清空已选卡牌&ndash;&gt;-->
<!--&lt;!&ndash;const selectCardArr = ref<number[]>([])&ndash;&gt;-->
<!--&lt;!&ndash;watch(selectedSpreadKey, () => { selectCardArr.value = [] })&ndash;&gt;-->

<!--&lt;!&ndash;// 随机卡牌&ndash;&gt;-->
<!--&lt;!&ndash;const randomCard = ref<number[]>(Array.from({ length: 78 }, (_, i) => i))&ndash;&gt;-->
<!--&lt;!&ndash;for (let i = randomCard.value.length - 1; i > 0; i&#45;&#45;) {&ndash;&gt;-->
<!--&lt;!&ndash;  const j = Math.floor(Math.random() * (i + 1))&ndash;&gt;-->
<!--&lt;!&ndash;  ;[randomCard.value[i], randomCard.value[j]] = [randomCard.value[j], randomCard.value[i]]&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;// 每张牌间距&ndash;&gt;-->
<!--&lt;!&ndash;const cardMargin = 20&ndash;&gt;-->

<!--&lt;!&ndash;const selectCard = (id: number) => {&ndash;&gt;-->
<!--&lt;!&ndash;  if (selectCardArr.value.includes(id)) {&ndash;&gt;-->
<!--&lt;!&ndash;    selectCardArr.value = selectCardArr.value.filter(i => i !== id)&ndash;&gt;-->
<!--&lt;!&ndash;    return&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  if (selectCardArr.value.length >= selectedCardCount.value) return&ndash;&gt;-->
<!--&lt;!&ndash;  selectCardArr.value.push(id)&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;const textValue = ref<string>('')&ndash;&gt;-->
<!--&lt;!&ndash;const loadingStatus = ref<boolean>(false)&ndash;&gt;-->
<!--&lt;!&ndash;const resStatus = ref<boolean>(false)&ndash;&gt;-->

<!--&lt;!&ndash;// 新变量存储带逆位信息的结果&ndash;&gt;-->
<!--&lt;!&ndash;const cardResult = ref<CardResult[]>([])&ndash;&gt;-->

<!--&lt;!&ndash;const confirmSpread = () => {&ndash;&gt;-->
<!--&lt;!&ndash;  if (!selectedSpreadKey.value) return&ndash;&gt;-->
<!--&lt;!&ndash;  isSpreadConfirmed.value = true&ndash;&gt;-->
<!--&lt;!&ndash;  selectCardArr.value = []&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;const getRes = async () => {&ndash;&gt;-->
<!--&lt;!&ndash;  loadingStatus.value = true&ndash;&gt;-->

<!--&lt;!&ndash;  // 生成占卜结果&ndash;&gt;-->
<!--&lt;!&ndash;  cardResult.value = selectCardArr.value.map(i => ({&ndash;&gt;-->
<!--&lt;!&ndash;    no: i,&ndash;&gt;-->
<!--&lt;!&ndash;    isReversed: needReversed.value ? Math.random() > 0.5 : false&ndash;&gt;-->
<!--&lt;!&ndash;  }))&ndash;&gt;-->

<!--&lt;!&ndash;  vh.showLoading()&ndash;&gt;-->
<!--&lt;!&ndash;  const res = await fetch('/api', {&ndash;&gt;-->
<!--&lt;!&ndash;    method: 'POST',&ndash;&gt;-->
<!--&lt;!&ndash;    body: JSON.stringify({&ndash;&gt;-->
<!--&lt;!&ndash;      text: textValue.value,&ndash;&gt;-->
<!--&lt;!&ndash;      pms: cardResult.value,&ndash;&gt;-->
<!--&lt;!&ndash;      spread: {&ndash;&gt;-->
<!--&lt;!&ndash;        key: selectedSpread.value.key,&ndash;&gt;-->
<!--&lt;!&ndash;        name: selectedSpread.value.name,&ndash;&gt;-->
<!--&lt;!&ndash;        count: selectedSpread.value.count,&ndash;&gt;-->
<!--&lt;!&ndash;        positions: selectedSpread.value.positions&ndash;&gt;-->
<!--&lt;!&ndash;      }&ndash;&gt;-->
<!--&lt;!&ndash;    })&ndash;&gt;-->
<!--&lt;!&ndash;  })&ndash;&gt;-->
<!--&lt;!&ndash;  vh.hideLoading()&ndash;&gt;-->
<!--&lt;!&ndash;  resStatus.value = true&ndash;&gt;-->
<!--&lt;!&ndash;  const resText = await res.text()&ndash;&gt;-->
<!--&lt;!&ndash;  renderRES(resText)&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;const typedText = ref<HTMLParagraphElement>()&ndash;&gt;-->
<!--&lt;!&ndash;let typedInstance: Typed | null = null&ndash;&gt;-->
<!--&lt;!&ndash;const renderRES = async (md: string) => {&ndash;&gt;-->
<!--&lt;!&ndash;  const renderedMarkdown = await marked.parse(md)&ndash;&gt;-->
<!--&lt;!&ndash;  if (typedInstance) typedInstance.destroy()&ndash;&gt;-->
<!--&lt;!&ndash;  typedInstance = new Typed(typedText.value!, { strings: [renderedMarkdown], typeSpeed: 16, showCursor: false, contentType: 'html' })&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;const resetFn = () => {&ndash;&gt;-->
<!--&lt;!&ndash;  selectCardArr.value = []&ndash;&gt;-->
<!--&lt;!&ndash;  cardResult.value = []&ndash;&gt;-->
<!--&lt;!&ndash;  resStatus.value = false&ndash;&gt;-->
<!--&lt;!&ndash;  loadingStatus.value = false&ndash;&gt;-->
<!--&lt;!&ndash;  isSpreadConfirmed.value = false&ndash;&gt;-->
<!--&lt;!&ndash;  clickedSpread.value = null&ndash;&gt;-->
<!--&lt;!&ndash;  for (let i = randomCard.value.length - 1; i > 0; i&#45;&#45;) {&ndash;&gt;-->
<!--&lt;!&ndash;    const j = Math.floor(Math.random() * (i + 1))&ndash;&gt;-->
<!--&lt;!&ndash;    ;[randomCard.value[i], randomCard.value[j]] = [randomCard.value[j], randomCard.value[i]]&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;  textValue.value = ''&ndash;&gt;-->
<!--&lt;!&ndash;  needReversed.value = true&ndash;&gt;-->
<!--&lt;!&ndash;  if (typedInstance) {&ndash;&gt;-->
<!--&lt;!&ndash;    typedInstance.destroy()&ndash;&gt;-->
<!--&lt;!&ndash;    typedInstance = null&ndash;&gt;-->
<!--&lt;!&ndash;  }&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;const renderIMG = (url: string) => new URL(`../../assets/images/card/${url}`, import.meta.url).href&ndash;&gt;-->
<!--&lt;!&ndash;</script>&ndash;&gt;-->

<!--&lt;!&ndash;<style scoped lang="less">&ndash;&gt;-->
<!--&lt;!&ndash;@import 'Home.less';&ndash;&gt;-->

<!--&lt;!&ndash;.hover-info-wrapper { height: 140px; margin-bottom: 12px; }&ndash;&gt;-->
<!--&lt;!&ndash;.spread-info-bar { position: relative; background: #fff8f0; padding: 6px; border-radius: 4px; }&ndash;&gt;-->

<!--&lt;!&ndash;.spread-selection { margin-bottom: 24px; .spread-list { display: flex; flex-wrap: wrap; gap: 12px; } }&ndash;&gt;-->
<!--&lt;!&ndash;.spread-card { background: #fdf6f0; border: 1px solid #ccc; border-radius: 8px; padding: 12px; width: 200px; cursor: pointer; transition: all 0.2s;&ndash;&gt;-->
<!--&lt;!&ndash;  .spread-header { font-weight: bold; margin-bottom: 6px; }&ndash;&gt;-->
<!--&lt;!&ndash;  &:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }&ndash;&gt;-->
<!--&lt;!&ndash;  &.active { border-color: #f39c12; box-shadow: 0 0 0 3px rgba(243,156,18,0.2); }&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->

<!--&lt;!&ndash;.selected-spread-info { margin-top: 12px; font-size: 14px; color: #444; }&ndash;&gt;-->

<!--&lt;!&ndash;.card-list { display: flex; flex-wrap: wrap; margin-top: 12px; }&ndash;&gt;-->
<!--&lt;!&ndash;.card { width: 80px; height: 120px; background: #ccc; border-radius: 4px; cursor: pointer; margin-bottom: 12px; transition: all 0.2s; }&ndash;&gt;-->
<!--&lt;!&ndash;.card.active { border: 2px solid #f39c12; }&ndash;&gt;-->

<!--&lt;!&ndash;.show-card { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }&ndash;&gt;-->
<!--&lt;!&ndash;.card-item { display: flex; flex-direction: column; align-items: center; }&ndash;&gt;-->
<!--&lt;!&ndash;.card-item img { width: 100px; height: auto; }&ndash;&gt;-->
<!--&lt;!&ndash;.card-label { margin-top: 4px; font-size: 14px; color: #666; }&ndash;&gt;-->

<!--&lt;!&ndash;@media (max-width: 768px) {&ndash;&gt;-->
<!--&lt;!&ndash;  .spread-list { flex-direction: column; }&ndash;&gt;-->
<!--&lt;!&ndash;  .spread-card { width: 100%; }&ndash;&gt;-->
<!--&lt;!&ndash;  .card-item img { width: min(22vw, 90px); }&ndash;&gt;-->
<!--&lt;!&ndash;  .card-label { font-size: 12px; }&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;</style>&ndash;&gt;-->


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
<!--          v-for="i in shuffledDeck"-->
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

<!--// 随机卡牌顺序（一次初始化或重置）-->
<!--const shuffledDeck = ref<number[]>([])-->
<!--const initShuffledDeck = () => {-->
<!--  shuffledDeck.value = Array.from({ length: 78 }, (_, i) => i)-->
<!--  for (let i = shuffledDeck.value.length - 1; i > 0; i&#45;&#45;) {-->
<!--    const j = Math.floor(Math.random() * (i + 1))-->
<!--    ;[shuffledDeck.value[i], shuffledDeck.value[j]] = [shuffledDeck.value[j], shuffledDeck.value[i]]-->
<!--  }-->
<!--}-->
<!--initShuffledDeck()-->

<!--const cardMargin = 20-->
<!--const cardResult = ref<CardResult[]>([])-->

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
<!--const typedText = ref<HTMLParagraphElement>()-->
<!--let typedInstance: Typed | null = null-->

<!--const confirmSpread = () => {-->
<!--  if (!selectedSpreadKey.value) return-->
<!--  isSpreadConfirmed.value = true-->
<!--  selectCardArr.value = []-->
<!--}-->

<!--const getRes = async () => {-->
<!--  if (cardResult.value.length) return // 已生成结果，不重复生成-->
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
<!--  initShuffledDeck() // 重新随机牌堆-->
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
          <p><strong>{{ clickedSpread?.name }}（{{ clickedSpread?.count }}张）</strong></p>
          <p>{{ clickedSpread?.desc }}</p>
          <p>适用场景：{{ clickedSpread?.usage }}</p>
          <p>
            <strong>牌位含义：</strong>
            <span
              v-for="(pos, index) in clickedSpread?.positions ?? []"
              :key="index"
            >
              （{{ index + 1 }}）{{ pos }}
              <span
                v-if="index < (clickedSpread?.positions?.length ?? 0) - 1"
              > </span>
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
            @click="() => { selectedSpreadKey = s.key; clickedSpread = s; }"
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
        当前牌阵：{{ selectedSpread?.name }}（需 {{ selectedCardCount }} 张） |
        已选：{{ selectCardArr.length }} 张
      </div>

      <!-- 抽牌区 -->
      <div class="card-list" v-if="isSpreadConfirmed && !resStatus">
        <div
          class="card"
          v-for="i in shuffledDeck"
          :key="i.no"
          :style="{ marginRight: cardMargin + 'px' }"
          @click="selectCard(i.no)"
          :class="{ active: selectCardArr.includes(i.no) }"
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
        <div
          class="card-item"
          v-for="(i, index) in cardResult"
          :key="i.no"
        >
          <img :class="{ rever: i.isReversed }" :src="renderIMG(`${i.no}.jpg`)"/>
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
  spreads.value.find(s => s.key === selectedSpreadKey.value)
)
const selectedCardCount = computed(() =>
  isSpreadConfirmed.value ? (selectedSpread.value?.count ?? 0) : 0
)

// 切换牌阵时清空已选卡牌
const selectCardArr = ref<number[]>([])
watch(selectedSpreadKey, () => { selectCardArr.value = [] })

// 完整牌堆，每张牌包含编号和逆位状态
const shuffledDeck = ref<CardResult[]>([])
const initShuffledDeck = () => {
  const deck: CardResult[] = Array.from({ length: 78 }, (_, i) => ({ no: i, isReversed: false }))
  // 打乱顺序
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  shuffledDeck.value = deck
}

// 初始化牌堆
initShuffledDeck()

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
const cardResult = ref<CardResult[]>([])

const confirmSpread = () => {
  if (!selectedSpreadKey.value) return
  isSpreadConfirmed.value = true
  selectCardArr.value = []
}

const getRes = async () => {
  loadingStatus.value = true

  // 生成占卜结果，固定逆位状态
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
        key: selectedSpread.value?.key ?? '',
        name: selectedSpread.value?.name ?? '',
        count: selectedSpread.value?.count ?? 0,
        positions: selectedSpread.value?.positions ?? []
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
  cardResult.value = []
  resStatus.value = false
  loadingStatus.value = false
  isSpreadConfirmed.value = false
  clickedSpread.value = null
  needReversed.value = true
  initShuffledDeck()
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
