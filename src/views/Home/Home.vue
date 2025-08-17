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
        <!-- 新增这个容器 -->
        <div class="flex justify-between items-center mb-3">
          <h3 class="section-title mb-0">2.选择塔罗牌种类（必须）</h3>
          <Button class="view-cards-btn" @click="openCardViewModal">
            查看牌面
          </Button>
        </div>

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
              <span v-if="'isCustom' in s && s.isCustom" class="custom-badge">自定义</span>
            </div>
            <p class="spread-desc text-sm">{{ s.desc }}</p>
          </div>

          <!-- 添加自定义牌阵按钮 -->
          <div class="spread-card custom-create-card p-2 border rounded cursor-pointer" @click="openCustomSpreadModal">
            <div class="spread-header font-bold">
              <span class="spread-name">+ 自定义牌阵</span>
            </div>
            <p class="spread-desc text-sm">创建您专属的塔罗牌阵</p>
          </div>
        </div>

        <Button class="mt-4 w-full" :disabled="!selectedSpreadKey || isSpreadConfirmed" @click="confirmSpread">
          确认牌阵并洗牌
        </Button>

        <!-- 在确认牌阵按钮下方添加 -->
        <div class="mt-2" v-if="isSpreadConfirmed">
          <label class="open-card-option">
            <input type="checkbox" v-model="isOpenCardMode"> 明牌选择
          </label>
        </div>
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

      <!-- 修改后的卡牌条 -->
      <div class="card-strip-wrapper" v-if="isSpreadConfirmed && !resStatus">
        <div
          class="card-strip"
          ref="cardStripWrapper"
          @mousedown="onDragStart"
          @touchstart.passive="onDragStart"
        >
          <div
            class="card"
            v-for="(i, index) in displayDeck"
            :key="i.no"
            :class="{
active: selectCardArr.includes(i.no),
'open-card': isOpenCardMode,
'reversed': isOpenCardMode && cardReversedStates[i.no]
}"
            @click="selectCard(i.no)"
            :style="{
transform: `translateX(${(index * cardPartialWidth) - viewOffset}px) ${selectCardArr.includes(i.no) ? 'translateY(-160px)' : ''}`,
width: cardWidth + 'px',
zIndex: selectCardArr.includes(i.no) ? 100 : index
}"
          >
            <!-- 根据明牌模式显示不同图片 -->
            <img
              :src="isOpenCardMode ? renderIMG(i.no) : renderBackImage()"
              :class="isOpenCardMode ? 'card-front' : 'card-back'"
              :alt="isOpenCardMode ? i.name : '塔罗牌背面'"
            />

            <!-- 明牌模式下显示卡牌信息覆盖层 -->
            <div v-if="isOpenCardMode" class="card-info-overlay">
              <div class="card-name">{{ i.name }}</div>
              <div class="card-number">No.{{ i.no + 1 }}</div>
            </div>

            <!-- 选中卡牌的翻转控制按钮（仅明牌模式且已选中时显示） -->
            <div v-if="isOpenCardMode && selectCardArr.includes(i.no)" class="flip-control">
              <button
                class="flip-btn"
                @click.stop="toggleCardReverse(i.no)"
                :title="cardReversedStates[i.no] ? '点击转为正位' : '点击转为逆位'"
              >
                {{ cardReversedStates[i.no] ? '正位' : '逆位' }}
              </button>
            </div>
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

        <!-- 明牌模式提示 -->
<!--        <div v-if="isOpenCardMode" class="open-card-tip">-->
<!--          💡 明牌模式：您可以看到所有牌面，选中后点击翻转按钮设置正逆位-->
<!--        </div>-->
      </div>

      <div class="btn mt-4" v-if="isSpreadConfirmed && !resStatus">
        <Button class="mt-4 w-full button-spacing"
                :disabled="selectCardArr.length !== totalCardCount"
                @click="getRes">
          开始占卜
        </Button>
      </div>
    </template>

<!--    <div class="card-jx mt-4" v-else>-->
<!--      &lt;!&ndash; 指示牌行 &ndash;&gt;-->
<!--      <div v-if="guideCards.length > 0" class="guide-cards-section mb-6">-->
<!--        <h4 class="cards-section-title">指示牌</h4>-->
<!--        <div class="show-card flex flex-wrap gap-4 justify-center">-->
<!--          <div class="card-item" v-for="(card, index) in guideCards" :key="card.no">-->
<!--            <img-->
<!--              :class="{-->
<!--rever: card.isReversed,-->
<!--'result-card': true,-->
<!--'result-card-reversed': card.isReversed-->
<!--}"-->
<!--              :src="renderIMG(card.no)"-->
<!--              :style="{ cursor: 'default' }"-->
<!--            />-->
<!--            <div class="card-label">-->
<!--              指示牌{{ index + 1 }} - {{ card.name }}-->
<!--              <span v-if="card.isReversed" class="reverse-indicator">（逆位）</span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      &lt;!&ndash; 牌阵牌行 &ndash;&gt;-->
<!--      <div v-if="spreadCards.length > 0" class="spread-cards-section mb-6">-->
<!--        <h4 class="cards-section-title">{{ selectedSpread?.name }}牌阵</h4>-->
<!--        <div class="show-card flex flex-wrap gap-4 justify-center">-->
<!--          <div class="card-item" v-for="(card, index) in spreadCards" :key="card.no">-->
<!--            <img-->
<!--              :class="{-->
<!--rever: card.isReversed,-->
<!--'result-card': true,-->
<!--'result-card-reversed': card.isReversed-->
<!--}"-->
<!--              :src="renderIMG(card.no)"-->
<!--              :style="{ cursor: 'default' }"-->
<!--            />-->
<!--            <div class="card-label">-->
<!--              （{{ index + 1 }}）{{ selectedSpread?.positions?.[index] ?? `第${index + 1}张` }} - {{ card.name }}-->
<!--              <span v-if="card.isReversed" class="reverse-indicator">（逆位）</span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

    <!-- 修改结果展示区域的卡牌部分 -->
    <div class="card-jx mt-4" v-else>
      <!-- 指示牌行 -->
      <div v-if="guideCards.length > 0" class="guide-cards-section mb-6">
        <h4 class="cards-section-title">指示牌</h4>
        <div class="show-card-container">
          <div class="show-card flex gap-4 justify-center">

          <div class="card-item" v-for="(card, index) in guideCards" :key="card.no">
            <div class="result-card-wrapper">
              <img
                :class="{
                'result-card': true,
                'result-card-reversed': card.isReversed
              }"
                :src="renderIMG(card.no)"
              />
            </div>
            <div class="card-label">
              指示牌{{ index + 1 }} - {{ card.name }}
              <span v-if="card.isReversed" class="reverse-indicator">（逆位）</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 牌阵牌行 -->
    <div v-if="spreadCards.length > 0" class="spread-cards-section mb-6">
      <h4 class="cards-section-title">{{ selectedSpread?.name }}牌阵</h4>
      <div class="show-card-container">
        <div class="show-card flex gap-4 justify-center">
          <div class="card-item" v-for="(card, index) in spreadCards" :key="card.no">
            <div class="result-card-wrapper">
              <img
                :class="{
                'result-card': true,
                'result-card-reversed': card.isReversed
              }"
                :src="renderIMG(card.no)"
              />
            </div>
            <div class="card-label">
              （{{ index + 1 }}）{{ selectedSpread?.positions?.[index] ?? `第${index + 1}张` }} - {{ card.name }}
              <span v-if="card.isReversed" class="reverse-indicator">（逆位）</span>
            </div>
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

    <!-- 自定义牌阵模态框 -->
    <div v-if="showCustomSpreadModal" class="modal-overlay" @click.self="closeCustomSpreadModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>创建自定义牌阵</h3>
          <button class="close-btn" @click="closeCustomSpreadModal">×</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label for="spread-name">牌阵名称 *</label>
            <input
              id="spread-name"
              v-model="customSpreadForm.name"
              type="text"
              class="form-input"
              :class="{ error: formErrors.name }"
              placeholder="请输入牌阵名称"
              maxlength="20"
            />
            <span v-if="formErrors.name" class="error-text">{{ formErrors.name }}</span>
          </div>

          <div class="form-group">
            <label for="spread-count">牌数 *</label>
            <input
              id="spread-count"
              v-model.number="customSpreadForm.count"
              type="number"
              class="form-input"
              :class="{ error: formErrors.count }"
              min="1"
              max="20"
            />
            <span v-if="formErrors.count" class="error-text">{{ formErrors.count }}</span>
          </div>

          <div class="form-group">
            <label>牌位名称 *</label>
            <div class="positions-grid">
              <div
                v-for="(position, index) in customSpreadForm.positions"
                :key="index"
                class="position-input-group"
              >
                <label :for="`position-${index}`" class="position-label">第{{ index + 1 }}位</label>
                <input
                  :id="`position-${index}`"
                  v-model="customSpreadForm.positions[index]"
                  type="text"
                  class="form-input position-input"
                  :class="{ error: formErrors[`position_${index}`] }"
                  :placeholder="`第${index + 1}位名称`"
                  maxlength="10"
                />
                <span v-if="formErrors[`position_${index}`]" class="error-text">
{{ formErrors[`position_${index}`] }}
</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="spread-desc">牌阵描述</label>
            <textarea
              id="spread-desc"
              v-model="customSpreadForm.desc"
              class="form-textarea"
              placeholder="请描述这个牌阵的特点"
              maxlength="200"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="spread-usage">适用场景</label>
            <input
              id="spread-usage"
              v-model="customSpreadForm.usage"
              type="text"
              class="form-input"
              placeholder="例如：爱情、事业、综合运势等"
              maxlength="50"
            />
          </div>

          <!-- 预览区域 -->
          <div class="preview-section">
            <h4>牌阵预览</h4>
            <div class="spread-preview">
              <div class="preview-header">
                <strong>{{ customSpreadForm.name }}</strong>
                <span>（{{ customSpreadForm.count }}张）</span>
              </div>
              <p class="preview-desc">{{ customSpreadForm.desc }}</p>
              <p class="preview-usage">适用场景：{{ customSpreadForm.usage }}</p>
              <div class="preview-positions">
                <strong>牌位含义：</strong>
                <span v-for="(pos, index) in customSpreadForm.positions" :key="index">
（{{ index + 1 }}）{{ pos }}
<span v-if="index < customSpreadForm.positions.length - 1">，</span>
</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <Button class="cancel-btn" @click="closeCustomSpreadModal">取消</Button>
          <Button class="create-btn" @click="createCustomSpread">创建牌阵</Button>
        </div>
      </div>
    </div>

    <!-- 查看牌面模态框 -->
    <div v-if="showCardViewModal" class="card-view-modal-overlay" @click.self="closeCardViewModal">
      <div class="card-view-modal-content">
        <!-- 头部 -->
        <div class="card-view-header">
          <h3 v-if="showDeckSelector">选择要查看的塔罗牌</h3>
          <h3 v-else>{{ decks.find(d => d.key === selectedViewDeck)?.name }} - 牌面一览</h3>
          <button class="close-btn" @click="closeCardViewModal">×</button>
        </div>

        <!-- 牌组选择界面 -->
        <div v-if="showDeckSelector" class="deck-selector">
          <div class="deck-grid">
            <div
              v-for="deck in decks"
              :key="deck.key"
              class="deck-option"
              @click="selectViewDeck(deck.key)"
            >
              <div class="deck-preview">
                <img :src="`${base}${deck.imagePath}back.jpg`" alt="牌背" class="deck-back-image">
              </div>
              <div class="deck-info">
                <h4>{{ deck.name }}</h4>
                <p>{{ deck.cardCount }}张牌</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 牌面网格显示 -->
        <div v-else class="cards-grid-container">
          <!-- 返回按钮 -->
          <div class="grid-header">
            <Button class="back-btn" @click="showDeckSelector = true">
              ← 返回选择
            </Button>
            <div class="card-count">
              共 {{ getSelectedDeckCards.length }} 张牌
            </div>
          </div>

          <!-- 牌面网格 -->
          <div class="cards-grid" ref="cardsGridRef">
            <div
              v-for="card in getSelectedDeckCards"
              :key="card.no"
              class="card-grid-item"
            >
              <img
                :src="card.imagePath"
                :alt="card.name"
                class="card-image"
                @error="handleImageError"
                loading="lazy"
              />
              <div class="card-info">
                <span class="card-number">{{ card.no + 1 }}</span>
                <span class="card-name">{{ card.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
import tarotDecks from '../../data/tarot-decks.json';
import { provide } from 'vue'

// 类型定义
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

// 在 script setup 顶部添加更严格的类型定义
type CardInfo = {
  no: number
  name: string
  type?: 'guide' | 'spread'
  isReversed: boolean
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

type CustomSpread = Spread & {
  isCustom: boolean
  createdAt: string
}

// 添加新的状态管理
const cardReversedStates = ref<Record<number, boolean>>({}) // 跟踪每张卡牌的逆位状态

// 现有状态
const customSpreads = ref<CustomSpread[]>([])
const showCustomSpreadModal = ref(false)
const customSpreadForm = ref({
  name: '自定义牌阵',
  count: 3,
  positions: ['过去', '现在', '未来'],
  desc: '自定义占卜牌阵',
  usage: '通用场景'
})
const formErrors = ref<Record<string, string>>({})

const showCardViewModal = ref(false)
const selectedViewDeck = ref<string>('')
const showDeckSelector = ref(true)
const isOpenCardMode = ref(false)

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
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})

// onMounted(() => {
//   // 现有代码保持不变
//   const savedTheme = localStorage.getItem('tarot-theme')
//   if (savedTheme) {
//     isDarkMode.value = savedTheme === 'dark'
//   } else {
//     isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
//   }
//
//   // 添加以下代码自动选择第一个牌种和牌阵
//   if (decks.value.length > 0) {
//     // 选择第一个牌组
//     selectedDeckKey.value = decks.value[0].key
//
//     // 初始化洗牌
//     initShuffledDeck()
//
//     // 当牌组加载后，选择第一个牌阵
//     nextTick(() => {
//       if (spreads.value.length > 0) {
//         selectedSpreadKey.value = spreads.value[0].key
//         clickedSpread.value = spreads.value[0]
//       }
//     })
//   }

//   // 窗口事件监听器相关代码保持不变
//   window.addEventListener('wheel', onWheelWithShift, { passive: false });
//   if (cardStripWrapper.value) {
//     containerWidth.value = cardStripWrapper.value.clientWidth;
//   }
// });


// 多轮对话相关
const conversationMessages = ref<ConversationMessage[]>([])
const followUpQuestion = ref('')
const isFollowUpLoading = ref(false)
const currentSessionId = ref<string | null>(null)
const conversationHistory = ref<HTMLDivElement | null>(null)
const firstDivinationResult = ref<string>('')

const scrollToBottom = () => {
  nextTick(() => {
    if (conversationHistory.value) {
      conversationHistory.value.scrollTop = conversationHistory.value.scrollHeight;
    }
  });
};

const typedText = ref<HTMLParagraphElement | null>(null)
let typedInstance: Typed | null = null

const renderRES = (html: string) => {
  firstDivinationResult.value = html
  scrollToBottom()
};

const parseMdToHtml = async (md: string): Promise<string> => {
  const maybe = marked.parse(md);
  return typeof maybe === 'string' ? maybe : await maybe;
};

// 牌组和牌阵相关
const decks = ref<Deck[]>(tarotDecks as Deck[]);
const selectedDeckKey = ref('')
const selectedDeck = computed(() => decks.value.find(d => d.key === selectedDeckKey.value))
const spreads = computed(() => {
  const deckSpreads = selectedDeck.value?.spreads ?? []
  return [...deckSpreads, ...customSpreads.value]
})

const selectedSpreadKey = ref<Spread['key']>('')
const isSpreadConfirmed = ref(false)
const clickedSpread = ref<Spread | null>(null)
const needReversed = ref(true)
const selectedSpread = computed(() => spreads.value.find(s => s.key === selectedSpreadKey.value))
const selectedCardCount = computed(() => isSpreadConfirmed.value ? (selectedSpread.value?.count ?? 0) : 0)
const selectCardArr = ref<number[]>([])

watch(selectedSpreadKey, () => {
  selectCardArr.value = []
  cardReversedStates.value = {} // 重置逆位状态
})

// 修改 shuffledDeck 相关逻辑
const shuffledDeck = ref<CardResult[]>([])

// 新增：计算显示的牌组（明牌模式按序号，普通模式随机）
// const displayDeck = computed(() => {
//   if (isOpenCardMode.value) {
//     // 明牌模式：按序号排列
//     const deckCount = selectedDeck.value?.cardCount ?? 78
//     return Array.from({ length: deckCount }, (_, i) => ({
//       no: i,
//       name: selectedDeck.value?.cardNames?.[i] ?? `第${i + 1}张`,
//       isReversed: false
//     }))
//   } else {
//     // 普通模式：随机排列
//     return shuffledDeck.value
//   }
// })

// 更新 displayDeck 的计算属性
const displayDeck = computed((): CardInfo[] => {
  if (isOpenCardMode.value) {
    // 明牌模式：按序号排列
    const deckCount = selectedDeck.value?.cardCount ?? 78
    return Array.from({ length: deckCount }, (_, i) => ({
      no: i,
      name: String(selectedDeck.value?.cardNames?.[i] ?? `第${i + 1}张`),
      isReversed: false,
      type: undefined // 明确设置为 undefined
    }))
  } else {
    // 普通模式：随机排列
    return shuffledDeck.value
  }
})


const initShuffledDeck = () => {
  const deckCount = selectedDeck.value?.cardCount ?? 78
  const deck: CardResult[] = Array.from({ length: deckCount }, (_, i) => ({
    no: i,
    name: String(selectedDeck.value?.cardNames?.[i] ?? `第${i}张`),
    isReversed: false,
    type: undefined // 添加 type 字段
  }))

  // 洗牌
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  shuffledDeck.value = deck

  // 重置逆位状态
  cardReversedStates.value = {}
}

// 卡牌条相关
const cardStripWrapper = ref<HTMLDivElement | null>(null)
const cardWidth = 88
let isDragging = false
let dragStartX = 0

const viewOffset = ref(0)
let dragStartOffset = 0
const containerWidth = ref(0)

const cardPartialWidth = cardWidth * 0.6

const totalCardsWidth = computed(() => {
  const deck = displayDeck.value
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

// 指示牌相关
const needGuideCards = ref(false)
const guideCardCount = ref(1)
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

// 拖拽相关
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

watch([selectedDeckKey, isSpreadConfirmed, () => displayDeck.value.length], recalcAfterDOMUpdate)

// 基础状态
const textValue = ref('')
const loadingStatus = ref(false)
const resStatus = ref(false)
const cardResult = ref<CardResult[]>([])

// 选择牌组
const selectDeck = (key: string) => {
  selectedDeckKey.value = key
  selectedSpreadKey.value = ''
  clickedSpread.value = null
  selectCardArr.value = []
  cardReversedStates.value = {}
  initShuffledDeck()
  recalcAfterDOMUpdate()
}

// 选择卡牌
const selectCard = (id: number) => {
  if (selectCardArr.value.includes(id)) {
    selectCardArr.value = selectCardArr.value.filter(i => i !== id)
    return
  }

  if (selectCardArr.value.length >= totalCardCount.value) return

  selectCardArr.value.push(id)
}

// 新增：翻转卡牌逆位状态（仅明牌模式可用）
const toggleCardReverse = (cardNo: number) => {
  if (!isOpenCardMode.value) return
  cardReversedStates.value[cardNo] = !cardReversedStates.value[cardNo]
}

// 计算属性
const guideCards = computed((): CardResult[] => {
  return cardResult.value.filter(card => card.type === 'guide')
})

const spreadCards = computed((): CardResult[] => {
  return cardResult.value.filter(card => card.type === 'spread')
})

// 确认牌阵
// 确认牌阵
const confirmSpread = async () => {
  if (!selectedSpreadKey.value) return
  isSpreadConfirmed.value = true
  selectCardArr.value = []
  cardReversedStates.value = {}

  await nextTick()
  if (cardStripWrapper.value) {
    containerWidth.value = cardStripWrapper.value.clientWidth
  }
}

// 重置功能
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
  isOpenCardMode.value = false
  cardReversedStates.value = {}
  customSpreads.value = []
  showCustomSpreadModal.value = false
  formErrors.value = {}
  textValue.value = ''
  if (typedInstance) {
    typedInstance.destroy();
    typedInstance = null
  }
  initShuffledDeck()
}

// 图片渲染
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

// API响应处理
// const parseApiResponse = (responseText: string): string => {
//   try {
//     const jsonData = JSON.parse(responseText)
//     if (jsonData.content) {
//       return jsonData.content
//     }
//   } catch (e) {
//     // 如果不是JSON，直接返回原文本
//   }
//   return responseText
// }


// const parseApiResponse = (responseText: string): string => {
//   try {
//     const jsonData = JSON.parse(responseText)
//     // 先检查是否有直接的content属性（你自己API的格式）
//     if (jsonData.content) {
//       return jsonData.content
//     }
//     // 再检查智谱API的响应格式
//     else if (jsonData.choices && jsonData.choices[0] && jsonData.choices[0].message) {
//       return jsonData.choices[0].message.content || ''
//     }
//   } catch (e) {
//     console.error('解析API响应失败:', e)
//   }
//   return responseText
// }
//

const parseApiResponse = (responseText: string): string => {
  try {
    const jsonData = JSON.parse(responseText)

    // 直接返回content字段(如果存在)
    if (jsonData.content) {
      return jsonData.content
    }

    // 处理智谱API的嵌套结构
    if (jsonData.choices &&
      jsonData.choices[0] &&
      jsonData.choices[0].message &&
      jsonData.choices[0].message.content) {
      return jsonData.choices[0].message.content
    }

    // 调试输出
    console.log('解析后的数据结构:', JSON.stringify(jsonData, null, 2))
  } catch (e) {
    console.error('解析API响应失败:', e)
  }
  return responseText
}



// 修改后的 getRes 函数
const getRes = async () => {
  if (!selectedSpread.value) return
  loadingStatus.value = true

  // 生成抽牌结果
  if (isOpenCardMode.value) {
    // 明牌模式：使用用户设置的逆位状态
    cardResult.value = selectCardArr.value.map((cardNo, index) => {
      const cardInfo = displayDeck.value.find(card => card.no === cardNo)

      return {
        no: cardNo,
        name: String(cardInfo?.name || `第${cardNo + 1}张`),
        type: needGuideCards.value && index < guideCardCount.value ? 'guide' : 'spread',
        isReversed: Boolean(cardReversedStates.value[cardNo])
      } as CardResult
    })
  } else {
    // 普通模式：随机生成逆位状态
    cardResult.value = selectCardArr.value.map((cardNo, index) => {
      const cardInfo = shuffledDeck.value.find(card => card.no === cardNo)

      return {
        no: cardNo,
        name: String(cardInfo?.name || selectedDeck.value?.cardNames?.[cardNo] || `第${cardNo + 1}张`),
        type: needGuideCards.value && index < guideCardCount.value ? 'guide' : 'spread',
        isReversed: needReversed.value ? Math.random() > 0.5 : false
      } as CardResult
    })
  }

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
    const content = parseApiResponse(resText)
    const html = await parseMdToHtml(content)

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
    loadingStatus.value = false
  }
}

// 发送后续问题
const sendFollowUpQuestion = async () => {
  if (!followUpQuestion.value.trim()) return

  isFollowUpLoading.value = true

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
    const content = parseApiResponse(resText)
    const html = await parseMdToHtml(content)

    conversationMessages.value.push({
      role: 'assistant',
      content: html
    } as ConversationMessage)

    scrollToBottom()
  } catch (error) {
    console.error('发送后续问题失败:', error)
    conversationMessages.value.push({
      role: 'assistant',
      content: '抱歉，发送消息时出现错误，请稍后重试。'
    } as ConversationMessage)
    conversationMessages.value.splice(-2, 1)
  } finally {
    isFollowUpLoading.value = false
  }
}

// 查看牌面相关
const openCardViewModal = () => {
  showCardViewModal.value = true
  showDeckSelector.value = true
  selectedViewDeck.value = ''
}

const closeCardViewModal = () => {
  showCardViewModal.value = false
  selectedViewDeck.value = ''
  showDeckSelector.value = true
}

const selectViewDeck = (deckKey: string) => {
  selectedViewDeck.value = deckKey
  showDeckSelector.value = false
}

const getSelectedDeckCards = computed(() => {
  const deck = decks.value.find(d => d.key === selectedViewDeck.value)
  if (!deck) return []

  return Array.from({ length: deck.cardCount }, (_, i) => ({
    no: i,
    name: deck.cardNames?.[i] ?? `第${i + 1}张`,
    imagePath: `${base}${deck.imagePath}${i + (deck.start ?? 0)}.jpg`
  }))
})

// 自定义牌阵相关
const openCustomSpreadModal = () => {
  showCustomSpreadModal.value = true
  resetCustomForm()
}

const closeCustomSpreadModal = () => {
  showCustomSpreadModal.value = false
  formErrors.value = {}
}

const resetCustomForm = () => {
  customSpreadForm.value = {
    name: '自定义牌阵',
    count: 1,
    positions: ['现在'],
    desc: '自定义占卜牌阵',
    usage: '通用场景'
  }
}

const validateCustomForm = (): boolean => {
  formErrors.value = {}

  if (!customSpreadForm.value.name.trim()) {
    formErrors.value.name = '牌阵名称不能为空'
  } else if (customSpreadForm.value.name.length > 20) {
    formErrors.value.name = '牌阵名称不能超过20个字符'
  }

  if (customSpreadForm.value.count < 1 || customSpreadForm.value.count > 20) {
    formErrors.value.count = '牌数必须在1-20之间'
  }

  for (let i = 0; i < customSpreadForm.value.positions.length; i++) {
    const position = customSpreadForm.value.positions[i]
    if (!position.trim()) {
      formErrors.value[`position_${i}`] = '牌位名称不能为空'
    } else if (position.length > 10) {
      formErrors.value[`position_${i}`] = '牌位名称不能超过10个字符'
    }
  }

  return Object.keys(formErrors.value).length === 0
}

const updatePositions = () => {
  const count = customSpreadForm.value.count
  const positions = customSpreadForm.value.positions

  if (count > positions.length) {
    for (let i = positions.length; i < count; i++) {
      positions.push(`第${i + 1}位`)
    }
  } else if (count < positions.length) {
    customSpreadForm.value.positions = positions.slice(0, count)
  }
}

const createCustomSpread = () => {
  if (!validateCustomForm()) return

  const newSpread: CustomSpread = {
    key: `custom_${Date.now()}`,
    name: customSpreadForm.value.name,
    count: customSpreadForm.value.count,
    positions: [...customSpreadForm.value.positions],
    desc: customSpreadForm.value.desc,
    usage: customSpreadForm.value.usage,
    isCustom: true,
    createdAt: new Date().toISOString()
  }

  customSpreads.value.push(newSpread)
  selectedSpreadKey.value = newSpread.key
  clickedSpread.value = newSpread
  closeCustomSpreadModal()
}

watch(() => customSpreadForm.value.count, updatePositions)

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = `${base}cards/placeholder.jpg`
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

  background: #007bff;

  color: white;

  margin-left: auto;

  margin-right: 0;

}

.user-message .message-header {

  text-align: right;

}

.assistant-message {

  background: #0056b3;

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
  height: 320px;
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
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: wrap !important;
  gap: 12px !important;
  justify-content: center !important;
  align-items: flex-start !important;
  width: 100% !important;
}

.show-card-container {
  width: 100% !important;
  overflow-x: auto;
  padding: 8px 0;
}

.card-item {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  flex-shrink: 0 !important;
  min-width: 120px;
  max-width: 140px;
}


.card-item img {

  width: 100px;

  height: auto;

}

.card-item img.rever {

  transform: rotate(180deg);

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

  /* 新增以下样式 */
  .show-card {
    flex-direction: row !important;
    justify-content: center !important;
  }

  .card-item {
    min-width: 100px !important;
    max-width: 120px !important;
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

.dark-mode .button-spacing,

.dark-mode .w-full {

  background-color: #f39c12 !important; /* 橙色背景 */

  color: #1a1a1a !important; /* 深色文字，保证对比度 */

  border: none;

}

.dark-mode .button-spacing:hover,

.dark-mode .w-full:hover {

  background-color: #d35400 !important; /* hover 更深的橙色 */

  color: #fff !important; /* hover 时文字变白 */

}

   /* 现有样式保持不变，以下是新增和修改的样式 */


/* 强制明牌模式使用与普通模式相同的布局 */
.card.open-card {
  /* 移除任何可能影响定位的样式 */
  position: absolute !important;
  /* 其他样式保持和 .card 一样 */
}

/* 如果有任何覆盖 .card 基础样式的地方，都要确保明牌模式也能继承 */


.card.open-card.reversed {
  border: 2px solid #e74c3c !important;
  box-shadow: 0 0 15px rgba(231, 76, 60, 0.5) !important;
}

.card.open-card.reversed img {
  transform: rotate(180deg);
}

/* 卡牌信息覆盖层 */
.card-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 8px 4px 4px;
  font-size: 11px;
  text-align: center;
  border-radius: 0 0 4px 4px;
}

.card-name {
  font-weight: bold;
  margin-bottom: 2px;
  line-height: 1.2;
}

.card-number {
  font-size: 9px;
  opacity: 0.8;
}

/* 翻转控制按钮 */
.flip-control {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.flip-btn {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.flip-btn:hover {
  background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
  transform: scale(1.05);
}

.flip-btn:active {
  transform: scale(0.95);
}

/* 明牌模式提示样式优化 */
.open-card-tip {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 1px solid #2196f3;
  border-radius: 8px;
  padding: 12px;
  margin-top: 16px;
  font-size: 14px;
  color: #1565c0;
  text-align: center;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
}

/* 结果页面卡牌样式 */
.result-card {
  transition: none !important;
  cursor: default !important;
  user-select: none;
}

.result-card-reversed {
  transform: rotate(180deg) !important;
  border: 2px solid #e74c3c !important;
  box-shadow: 0 0 15px rgba(231, 76, 60, 0.5) !important;
  border-radius: 8px;
}
.dark-mode .result-card-reversed:hover {
  transform: rotate(180deg) !important;
  border: 2px solid #e74c3c !important;
  box-shadow: 0 0 15px rgba(231, 76, 60, 0.5) !important;
}


.result-card:hover {
  transform: none !important;
}

.result-card-reversed:hover {
  transform: rotate(180deg) !important;
}


/* 逆位指示器样式增强 */
.reverse-indicator {
  color: #e74c3c;
  font-weight: bold;
  font-size: 0.9em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 深色模式适配 */
.dark-mode .card-info-overlay {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
}

.dark-mode .open-card-tip {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  border-color: #3b82f6;
  color: #dbeafe;
}

.dark-mode .flip-btn {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
}

.dark-mode .flip-btn:hover {
  background: linear-gradient(135deg, #e67e22 0%, #c98050 100%);
}

.dark-mode .result-card-reversed {
  border: 2px solid #e74c3c !important;
  box-shadow: 0 0 15px rgba(231, 76, 60, 0.5) !important;
}

.dark-mode .reverse-indicator {
  color: #fca5a1;
}

/* 自定义牌阵样式 */
.custom-spread-container {
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.custom-spread-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.custom-spread-position {
  margin: 4px 0;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}

.custom-spread-error {
  color: #e74c3c;
  font-size: 12px;
}

/* 结果页面样式 */
.result-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.result-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.result-content {
  font-size: 16px;
  line-height: 1.5;
}

.result-footer {
  margin-top: 20px;
  text-align: right;
}

.result-footer button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.result-footer button:hover {
  background-color: #45a049;
}



/* 明牌模式卡牌选择区域增强 */
.card.open-card.card-front {
  width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

/* 确保结果页面卡牌不会被其他样式影响 */
.card-item .result-card {
  pointer-events: none !important;
  transition: none !important;
}

/* 添加卡牌名称覆盖层（明牌模式用） */
.card-name-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 4px;
  font-size: 10px;
  text-align: center;
  border-radius: 0 0 4px 4px;
}

/* 明牌选择选项样式 */
.open-card-option {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 16px;
}


.dark-mode .card-name-overlay {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
}



/* ===========================================
   查看牌面模态框样式
   =========================================== */

/* 模态框遮罩层 */
.card-view-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

/* 模态框内容容器 */
.card-view-modal-content {
  background: white;
  border-radius: 12px;
  width: 90vw;
  max-width: 1200px;
  height: 85vh;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* 模态框头部 */
.card-view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.card-view-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

/* 关闭按钮 */
.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #333;
}
/* 牌组选择器样式 */
.deck-selector {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.deck-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.deck-option {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.deck-option:hover {
  border-color: #f39c12;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.deck-preview {
  text-align: center;
  margin-bottom: 12px;
}

.deck-back-image {
  width: 80px;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.deck-info h4 {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  color: #333;
}

.deck-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}
/* 牌面网格容器样式 */
.cards-grid-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.back-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease;
}

.back-btn:hover {
  background: #5a6268;
}

.card-count {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

/* 牌面网格 */
.cards-grid {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  align-content: start;
}

/* 单个卡牌项目 */
.card-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 8px;
  transition: all 0.2s ease;
}

.card-grid-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #f39c12;
}

.card-image {
  width: 100%;
  max-width: 100px;
  height: auto;
  border-radius: 4px;
  margin-bottom: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.card-info {
  text-align: center;
  width: 100%;
}

.card-number {
  display: block;
  font-size: 0.75rem;
  color: #999;
  margin-bottom: 2px;
}

.card-name {
  display: block;
  font-size: 0.8rem;
  color: #333;
  font-weight: 500;
  line-height: 1.2;
  word-wrap: break-word;
}
/* 深色模式适配 */
.dark-mode .card-view-modal-content {
  background: #2d2d2d;
  color: #e0e0e0;
}

.dark-mode .card-view-header {
  background: #1a1a1a;
  border-bottom-color: #444;
}

.dark-mode .card-view-header h3 {
  color: #e0e0e0;
}

.dark-mode .close-btn {
  color: #ccc;
}

.dark-mode .close-btn:hover {
  background: #444;
  color: #fff;
}

.dark-mode .deck-option {
  background: #3d3d3d;
  border-color: #555;
  color: #e0e0e0;
}

.dark-mode .deck-option:hover {
  border-color: #f39c12;
  background: #4d4d4d;
}

.dark-mode .grid-header {
  background: #1a1a1a;
  border-bottom-color: #444;
}

.dark-mode .card-count {
  color: #ccc;
}

.dark-mode .back-btn {
  background: #495057;
}

.dark-mode .back-btn:hover {
  background: #6c757d;
}

.dark-mode .card-grid-item {
  background: #3d3d3d;
  border-color: #555;
  color: #e0e0e0;
}

.dark-mode .card-grid-item:hover {
  border-color: #f39c12;
  background: #4d4d4d;
}

.dark-mode .card-name {
  color: #e0e0e0;
}

.dark-mode .card-number {
  color: #aaa;
}
/* 响应式设计 */
@media (max-width: 768px) {
  .card-view-modal-content {
    width: 95vw;
    height: 90vh;
    margin: 20px 10px;
  }

  .card-view-header {
    padding: 16px 20px;
  }

  .card-view-header h3 {
    font-size: 1.3rem;
  }

  .deck-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
    padding: 16px;
  }

  .grid-header {
    padding: 12px 16px;
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .back-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
    padding: 12px;
  }

  .card-grid-item {
    padding: 8px 4px;
  }

  .card-image {
    max-width: 80px;
  }

  .card-name {
    font-size: 0.7rem;
  }

  .card-number {
    font-size: 0.65rem;
  }
}


/* ===========================================
   自定义牌阵模态框样式
   =========================================== */

/* 模态框遮罩层 */
.modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background: rgba(0, 0, 0, 0.6) !important;
  z-index: 9998 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  backdrop-filter: blur(2px);
}

/* 模态框内容容器 */
.modal-content {
  background: white !important;
  border-radius: 12px !important;
  width: 90vw !important;
  max-width: 600px !important;
  max-height: 85vh !important;
  display: flex !important;
  flex-direction: column !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
  overflow: hidden !important;
  position: relative !important;
}

/* 模态框头部 */
.modal-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 20px 24px !important;
  border-bottom: 1px solid #e0e0e0 !important;
  background: #f8f9fa !important;
  flex-shrink: 0 !important;
}

.modal-header h3 {
  margin: 0 !important;
  font-size: 1.4rem !important;
  font-weight: bold !important;
  color: #8b4513 !important;
}

/* 关闭按钮 */
.modal-header .close-btn {
  background: none !important;
  border: none !important;
  font-size: 1.8rem !important;
  cursor: pointer !important;
  color: #666 !important;
  padding: 0 !important;
  width: 35px !important;
  height: 35px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 50% !important;
  transition: all 0.2s ease !important;
}

.modal-header .close-btn:hover {
  background: #f0f0f0 !important;
  color: #333 !important;
}

/* 模态框主体 */
.modal-body {
  flex: 1 !important;
  overflow-y: auto !important;
  padding: 24px !important;
}

/* 模态框底部 */
.modal-footer {
  display: flex !important;
  gap: 12px !important;
  justify-content: flex-end !important;
  padding: 20px 24px !important;
  border-top: 1px solid #e0e0e0 !important;
  background: #f8f9fa !important;
  flex-shrink: 0 !important;
}
/* 表单样式 */
.form-group {
  margin-bottom: 20px !important;
}

.form-group label {
  display: block !important;
  margin-bottom: 6px !important;
  font-weight: 500 !important;
  color: #333 !important;
  font-size: 0.95rem !important;
}

.form-input,
.form-textarea {
  width: 100% !important;
  padding: 10px 12px !important;
  border: 1px solid #ddd !important;
  border-radius: 6px !important;
  font-size: 14px !important;
  transition: border-color 0.2s ease !important;
  box-sizing: border-box !important;
}

.form-input:focus,
.form-textarea:focus {
  outline: none !important;
  border-color: #f39c12 !important;
  box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.2) !important;
}

.form-input.error,
.form-textarea.error {
  border-color: #e74c3c !important;
}

.form-textarea {
  min-height: 80px !important;
  resize: vertical !important;
}

.error-text {
  color: #e74c3c !important;
  font-size: 12px !important;
  margin-top: 4px !important;
  display: block !important;
}

/* 牌位网格样式 */
.positions-grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
  gap: 16px !important;
}

.position-input-group {
  display: flex !important;
  flex-direction: column !important;
}

.position-label {
  font-size: 12px !important;
  color: #666 !important;
  margin-bottom: 4px !important;
  font-weight: normal !important;
}

.position-input {
  margin-bottom: 0 !important;
}

/* 预览区域样式 */
.preview-section {
  margin-top: 24px !important;
  padding: 16px !important;
  background: #f8f9fa !important;
  border-radius: 8px !important;
  border: 1px solid #e0e0e0 !important;
}

.preview-section h4 {
  margin: 0 0 12px 0 !important;
  color: #8b4513 !important;
  font-size: 1rem !important;
}

.spread-preview {
  font-size: 14px !important;
}

.preview-header {
  font-weight: bold !important;
  margin-bottom: 8px !important;
  color: #333 !important;
}

.preview-desc,
.preview-usage {
  margin-bottom: 8px !important;
  color: #666 !important;
  line-height: 1.4 !important;
}

.preview-positions {
  color: #333 !important;
  line-height: 1.4 !important;
}

/* 按钮样式 */
.cancel-btn {
  background: #6c757d !important;
  color: white !important;
  border: none !important;
  padding: 10px 20px !important;
  border-radius: 6px !important;
  cursor: pointer !important;
  transition: background-color 0.2s ease !important;
  font-size: 0.9rem !important;
}

.cancel-btn:hover {
  background: #5a6268 !important;
}

.create-btn {
  background: #f39c12 !important;
  color: white !important;
  border: none !important;
  padding: 10px 20px !important;
  border-radius: 6px !important;
  cursor: pointer !important;
  transition: background-color 0.2s ease !important;
  font-size: 0.9rem !important;
}

.create-btn:hover {
  background: #e67e22 !important;
}
/* 深色模式适配 */
.dark-mode .modal-content {
  background: #2d2d2d !important;
  color: #e0e0e0 !important;
}

.dark-mode .modal-header {
  background: #1a1a1a !important;
  border-bottom-color: #444 !important;
}

.dark-mode .modal-header h3 {
  color: #f39c12 !important;
}

.dark-mode .modal-footer {
  background: #1a1a1a !important;
  border-top-color: #444 !important;
}

.dark-mode .modal-header .close-btn {
  color: #ccc !important;
}

.dark-mode .modal-header .close-btn:hover {
  background: #444 !important;
  color: #fff !important;
}

.dark-mode .form-group label {
  color: #e0e0e0 !important;
}

.dark-mode .form-input,
.dark-mode .form-textarea {
  background: #3d3d3d !important;
  border-color: #555 !important;
  color: #e0e0e0 !important;
}

.dark-mode .form-input:focus,
.dark-mode .form-textarea:focus {
  border-color: #f39c12 !important;
}

.dark-mode .preview-section {
  background: #3d3d3d !important;
  border-color: #555 !important;
}

.dark-mode .preview-header {
  color: #e0e0e0 !important;
}

.dark-mode .preview-desc,
.dark-mode .preview-usage,
.dark-mode .preview-positions {
  color: #ccc !important;
}

.dark-mode .position-label {
  color: #aaa !important;
}
/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    width: 95vw !important;
    max-height: 90vh !important;
  }

  .modal-header {
    padding: 16px 20px !important;
  }

  .modal-header h3 {
    font-size: 1.2rem !important;
  }

  .modal-body {
    padding: 20px !important;
  }

  .modal-footer {
    padding: 16px 20px !important;
    flex-direction: column !important;
  }

  .cancel-btn,
  .create-btn {
    width: 100% !important;
  }

  .positions-grid {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 480px) {
  .modal-header {
    padding: 12px 16px !important;
  }

  .modal-body {
    padding: 16px !important;
  }

  .modal-footer {
    padding: 12px 16px !important;
  }
}


</style>
