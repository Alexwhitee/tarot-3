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


    <!--    &lt;!&ndash; 简化的结果展示区域 &ndash;&gt;-->
    <!--    <div v-if="resStatus" class="result-container">-->
    <!--      &lt;!&ndash; 指示牌展示 &ndash;&gt;-->
    <!--      <div v-if="guideCards.length > 0" class="guide-cards-section">-->
    <!--        <h4 class="cards-section-title">指示牌</h4>-->
    <!--        <div class="cards-display">-->
    <!--          <div v-for="(card, index) in guideCards" :key="`guide-${card.no}`" class="card-display-item">-->
    <!--            <div class="card-wrapper">-->
    <!--              <img-->
    <!--                :src="renderIMG(card.no)"-->
    <!--                :class="{ 'card-reversed': card.isReversed }"-->
    <!--                :alt="card.name"-->
    <!--                class="result-card-image"-->
    <!--              />-->
    <!--            </div>-->
    <!--            <div class="card-info-text">-->
    <!--              <div class="card-position">指示牌{{ index + 1 }}</div>-->
    <!--              <div class="card-name-text">{{ card.name }}</div>-->
    <!--              <div v-if="card.isReversed" class="reverse-indicator">（逆位）</div>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->

    <!--      &lt;!&ndash; 牌阵牌展示 &ndash;&gt;-->
    <!--      <div v-if="spreadCards.length > 0" class="spread-cards-section">-->
    <!--        <h4 class="cards-section-title">{{ selectedSpread?.name }}牌阵</h4>-->
    <!--        <div class="cards-display">-->
    <!--          <div v-for="(card, index) in spreadCards" :key="`spread-${card.no}`" class="card-display-item">-->
    <!--            <div class="card-wrapper">-->
    <!--              <img-->
    <!--                :src="renderIMG(card.no)"-->
    <!--                :class="{ 'card-reversed': card.isReversed }"-->
    <!--                :alt="card.name"-->
    <!--                class="result-card-image"-->
    <!--              />-->
    <!--            </div>-->
    <!--            <div class="card-info-text">-->
    <!--              <div class="card-position">-->
    <!--                （{{ index + 1 }}）{{ selectedSpread?.positions?.[index] ?? `第${index + 1}张` }}-->
    <!--              </div>-->
    <!--              <div class="card-name-text">{{ card.name }}</div>-->
    <!--              <div v-if="card.isReversed" class="reverse-indicator">（逆位）</div>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->

    <!--      &lt;!&ndash; 占卜结果显示 &ndash;&gt;-->
    <!--      <div class="divination-result" v-if="firstDivinationResult">-->
    <!--        <h4 class="result-title">占卜解析</h4>-->
    <!--        <div class="result-content" v-html="firstDivinationResult"></div>-->
    <!--      </div>-->

    <!--      &lt;!&ndash; 重新开始按钮 &ndash;&gt;-->
    <!--      <div class="result-actions">-->
    <!--        <Button class="restart-btn" @click="resetFn">重新开始</Button>-->
    <!--      </div>-->
    <!--    </div>-->

    <!-- 结果展示区域 - 优先显示 -->
    <div v-if="resStatus" class="result-container">




      <!-- 指示牌展示 -->
<!--      <div v-if="guideCards.length > 0" class="guide-cards-section">-->
<!--        <h4 class="cards-section-title">指示牌</h4>-->
<!--        <div class="cards-display">-->
<!--          <div v-for="(card, index) in guideCards" :key="`guide-${card.no}`" class="card-display-item">-->
<!--            <div class="card-wrapper">-->
<!--              <img-->
<!--                :src="renderIMG(card.no)"-->
<!--                :class="{ 'card-reversed': card.isReversed }"-->
<!--                :alt="card.name"-->
<!--                class="result-card-image"-->
<!--              />-->
<!--            </div>-->
<!--            <div class="card-info-text">-->
<!--              <div class="card-position">指示牌{{ index + 1 }}</div>-->
<!--              <div class="card-name-text">{{ card.name }}</div>-->
<!--              <div v-if="card.isReversed" class="reverse-indicator">（逆位）</div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
      <!-- 找到这个区域并修改 -->
      <div v-if="guideCards.length > 0" class="guide-cards-section">
        <h4 class="cards-section-title">指示牌</h4>
        <div class="cards-display">
          <div v-for="(card, index) in guideCards" :key="`guide-${card.no}`" class="card-display-item">
            <div class="card-wrapper clickable-card-wrapper" @click="showDrawnCardDetail(card)">
              <img
                :src="renderIMG(card.no)"
                :class="{ 'card-reversed': card.isReversed }"
                :alt="card.name"
                class="result-card-image clickable-card"
              />
            </div>
            <div class="card-info-text">
              <div class="card-position">指示牌{{ index + 1 }}</div>
              <div class="card-name-text">{{ card.name }}</div>
              <div v-if="card.isReversed" class="reverse-indicator">（逆位）</div>
              <div class="click-hint">点击查看详情</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 牌阵牌展示 -->
<!--      <div v-if="spreadCards.length > 0" class="spread-cards-section">-->
<!--        <h4 class="cards-section-title">{{ selectedSpread?.name }}牌阵</h4>-->
<!--        <div class="cards-display">-->
<!--          <div v-for="(card, index) in spreadCards" :key="`spread-${card.no}`" class="card-display-item">-->
<!--            <div class="card-wrapper">-->
<!--              <img-->
<!--                :src="renderIMG(card.no)"-->
<!--                :class="{ 'card-reversed': card.isReversed }"-->
<!--                :alt="card.name"-->
<!--                class="result-card-image"-->
<!--              />-->
<!--            </div>-->
<!--            <div class="card-info-text">-->
<!--              <div class="card-position">-->
<!--                （{{ index + 1 }}）{{ selectedSpread?.positions?.[index] ?? `第${index + 1}张` }}-->
<!--              </div>-->
<!--              <div class="card-name-text">{{ card.name }}</div>-->
<!--              <div v-if="card.isReversed" class="reverse-indicator">（逆位）</div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

      <!-- 找到这个区域并修改 -->
      <div v-if="spreadCards.length > 0" class="spread-cards-section">
        <h4 class="cards-section-title">{{ selectedSpread?.name }}牌阵</h4>
        <div class="cards-display">
          <div v-for="(card, index) in spreadCards" :key="`spread-${card.no}`" class="card-display-item">
            <div class="card-wrapper clickable-card-wrapper" @click="showDrawnCardDetail(card)">
              <img
                :src="renderIMG(card.no)"
                :class="{ 'card-reversed': card.isReversed }"
                :alt="card.name"
                class="result-card-image clickable-card"
              />
            </div>
            <div class="card-info-text">
              <div class="card-position">
                （{{ index + 1 }}）{{ selectedSpread?.positions?.[index] ?? `第${index + 1}张` }}
              </div>
              <div class="card-name-text">{{ card.name }}</div>
              <div v-if="card.isReversed" class="reverse-indicator">（逆位）</div>
              <div class="click-hint">点击查看详情</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 新增：抽牌详情展示区域 -->
<!--      <div class="divination-details-section">-->
<!--        <div class="section-header">-->
<!--          <h4 class="cards-section-title">抽牌详情</h4>-->
<!--          <button class="copy-all-btn" @click="copyAllDetails" :disabled="isCopying">-->
<!--            <span v-if="isCopying">复制中...</span>-->
<!--            <span v-else-if="copySuccess">已复制 ✓</span>-->
<!--            <span v-else>📋 复制全部</span>-->
<!--          </button>-->
<!--        </div>-->

<!--        &lt;!&ndash; 问题展示 &ndash;&gt;-->
<!--        <div class="question-display">-->
<!--          <div class="subsection-header">-->
<!--            <h5 class="subsection-title">基本信息</h5>-->
<!--            <button class="copy-btn" @click="copyBasicInfo">📋</button>-->
<!--          </div>-->
<!--          <div class="detail-item">-->
<!--            <span class="detail-label">占卜问题：</span>-->
<!--            <span class="detail-content">{{ textValue || '无具体问题' }}</span>-->
<!--          </div>-->
<!--          <div class="detail-item">-->
<!--            <span class="detail-label">使用牌组：</span>-->
<!--            <span class="detail-content">{{ selectedDeck?.name || '标准塔罗牌' }}</span>-->
<!--          </div>-->
<!--          <div class="detail-item">-->
<!--            <span class="detail-label">选择牌阵：</span>-->
<!--            <span class="detail-content">{{ selectedSpread?.name || '标准牌阵' }}</span>-->
<!--          </div>-->
<!--          <div class="detail-item">-->
<!--            <span class="detail-label">占卜时间：</span>-->
<!--            <span class="detail-content">{{ formatCurrentTime }}</span>-->
<!--          </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; 抽牌结果详细展示 &ndash;&gt;-->
<!--        <div class="cards-detail-display">-->

<!--          &lt;!&ndash; 指示牌详情（如果有） &ndash;&gt;-->
<!--          <div v-if="guideCards.length > 0" class="guide-cards-detail">-->
<!--            <div class="subsection-header">-->
<!--              <h5 class="detail-subtitle">指示牌抽牌结果</h5>-->
<!--              <button class="copy-btn" @click="copyGuideCards">📋</button>-->
<!--            </div>-->
<!--            <div class="cards-list">-->
<!--              <div v-for="(card, index) in guideCards" :key="`guide-detail-${card.no}`" class="card-detail-item">-->
<!--                <div class="card-index">{{ index + 1 }}</div>-->
<!--                <div class="card-detail-info">-->
<!--                  <div class="card-name-with-status">-->
<!--                    {{ card.name }}-->
<!--                    <span class="card-status" :class="{ 'reversed-status': card.isReversed }">-->
<!--                {{ card.isReversed ? '（逆位）' : '（正位）' }}-->
<!--              </span>-->
<!--                  </div>-->
<!--                  <div class="card-type-label">指示牌</div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

<!--          &lt;!&ndash; 牌阵牌详情 &ndash;&gt;-->
<!--          <div v-if="spreadCards.length > 0" class="spread-cards-detail">-->
<!--            <div class="subsection-header">-->
<!--              <h5 class="detail-subtitle">牌阵牌抽牌结果</h5>-->
<!--              <button class="copy-btn" @click="copySpreadCards">📋</button>-->
<!--            </div>-->
<!--            <div class="cards-list">-->
<!--              <div v-for="(card, index) in spreadCards" :key="`spread-detail-${card.no}`" class="card-detail-item">-->
<!--                <div class="card-index">{{ index + 1 }}</div>-->
<!--                <div class="card-detail-info">-->
<!--                  <div class="card-name-with-status">-->
<!--                    {{ card.name }}-->
<!--                    <span class="card-status" :class="{ 'reversed-status': card.isReversed }">-->
<!--                {{ card.isReversed ? '（逆位）' : '（正位）' }}-->
<!--              </span>-->
<!--                  </div>-->
<!--                  <div class="card-position-label">-->
<!--                    {{ selectedSpread?.positions?.[index] || `第${index + 1}位` }}-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

<!--          &lt;!&ndash; 传给AI的完整数据预览 &ndash;&gt;-->
<!--          <div class="ai-input-preview">-->
<!--            <div class="subsection-header">-->
<!--              <h5 class="detail-subtitle">-->
<!--                传给AI的数据-->
<!--                <button class="toggle-btn" @click="showAIData = !showAIData">-->
<!--                  {{ showAIData ? '隐藏' : '显示' }}-->
<!--                </button>-->
<!--              </h5>-->
<!--              <button v-if="showAIData" class="copy-btn" @click="copyAIData">📋</button>-->
<!--            </div>-->
<!--            <div v-if="showAIData" class="ai-data-content">-->
<!--              <pre class="ai-data-json">{{ formatAIInputData }}</pre>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

      <!-- 新增：抽牌详情展示区域 -->
      <div class="divination-details-section">
        <div class="section-header">
          <h4 class="cards-section-title">
            抽牌详情
            <button class="toggle-btn" @click="showDivinationDetails = !showDivinationDetails">
              {{ showDivinationDetails ? '隐藏' : '显示' }}
            </button>
          </h4>
          <button v-if="showDivinationDetails" class="copy-all-btn" @click="copyAllDetails" :disabled="isCopying">
            <span v-if="isCopying">复制中...</span>
            <span v-else-if="copySuccess">已复制 ✓</span>
            <span v-else>📋 复制全部</span>
          </button>
        </div>

        <!-- 整个详情内容区域 - 添加 v-if 控制显示 -->
        <div v-if="showDivinationDetails" class="divination-details-content">
          <!-- 问题展示 -->
          <div class="question-display">
            <div class="subsection-header">
              <h5 class="subsection-title">基本信息</h5>
              <button class="copy-btn" @click="copyBasicInfo">📋</button>
            </div>
            <div class="detail-item">
              <span class="detail-label">占卜问题：</span>
              <span class="detail-content">{{ textValue || '无具体问题' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">使用牌组：</span>
              <span class="detail-content">{{ selectedDeck?.name || '标准塔罗牌' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">选择牌阵：</span>
              <span class="detail-content">{{ selectedSpread?.name || '标准牌阵' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">占卜时间：</span>
              <span class="detail-content">{{ formatCurrentTime }}</span>
            </div>
          </div>

          <!-- 抽牌结果详细展示 -->
          <div class="cards-detail-display">
            <!-- 指示牌详情（如果有） -->
            <div v-if="guideCards.length > 0" class="guide-cards-detail">
              <div class="subsection-header">
                <h5 class="detail-subtitle">指示牌抽牌结果</h5>
                <button class="copy-btn" @click="copyGuideCards">📋</button>
              </div>
              <div class="cards-list">
                <div v-for="(card, index) in guideCards" :key="`guide-detail-${card.no}`" class="card-detail-item">
                  <div class="card-index">{{ index + 1 }}</div>
                  <div class="card-detail-info">
                    <div class="card-name-with-status">
                      {{ card.name }}
                      <span class="card-status" :class="{ 'reversed-status': card.isReversed }">
                  {{ card.isReversed ? '（逆位）' : '（正位）' }}
                </span>
                    </div>
                    <div class="card-type-label">指示牌</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 牌阵牌详情 -->
            <div v-if="spreadCards.length > 0" class="spread-cards-detail">
              <div class="subsection-header">
                <h5 class="detail-subtitle">牌阵牌抽牌结果</h5>
                <button class="copy-btn" @click="copySpreadCards">📋</button>
              </div>
              <div class="cards-list">
                <div v-for="(card, index) in spreadCards" :key="`spread-detail-${card.no}`" class="card-detail-item">
                  <div class="card-index">{{ index + 1 }}</div>
                  <div class="card-detail-info">
                    <div class="card-name-with-status">
                      {{ card.name }}
                      <span class="card-status" :class="{ 'reversed-status': card.isReversed }">
                  {{ card.isReversed ? '（逆位）' : '（正位）' }}
                </span>
                    </div>
                    <div class="card-position-label">
                      {{ selectedSpread?.positions?.[index] || `第${index + 1}位` }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 传给AI的完整数据预览 -->
            <div class="ai-input-preview">
              <div class="subsection-header">
                <h5 class="detail-subtitle">
                  前端发给API的数据
                  <button class="toggle-btn" @click="showAIData = !showAIData">
                    {{ showAIData ? '隐藏' : '显示' }}
                  </button>
                </h5>
                <button v-if="showAIData" class="copy-btn" @click="copyAIData">📋</button>
              </div>
              <div v-if="showAIData" class="ai-data-content">
                <pre class="ai-data-json">{{ formatAIInputData }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- 占卜结果显示区域 -->
      <div class="divination-result">
        <h4 class="result-title">占卜解析</h4>

        <!-- 加载状态 - 只在文字区域显示 -->
        <div v-if="isWaitingForAnalysis" class="analysis-loading">
          <div class="loading-spinner"></div>
          <p class="loading-text">AI正在为您解析牌面含义，请稍候...</p>
        </div>

        <!-- 分析结果 -->
        <div v-else-if="firstDivinationResult" class="result-content" v-html="firstDivinationResult"></div>

        <!-- 无结果提示 -->
        <div v-else class="no-result">
          <p>暂无分析结果</p>
        </div>
      </div>

      <!-- 重新开始按钮 -->
      <div class="result-actions">
        <Button class="restart-btn" @click="resetFn">重新开始</Button>
      </div>
    </div>

    <!--    <template v-if="!loadingStatus">-->
    <template v-else-if="!loadingStatus">
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
            <div v-if="isOpenCardMode" class="card-info-external">

              <div class="card-number">No.{{ i.no + 1 }}</div>
              <div class="card-name">{{ i.name }}</div>

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
<!--    <div v-if="showCardViewModal" class="card-view-modal-overlay" @click.self="closeCardViewModal">-->
<!--      <div class="card-view-modal-content">-->
<!--        &lt;!&ndash; 头部 &ndash;&gt;-->
<!--        <div class="card-view-header">-->
<!--          <h3 v-if="showDeckSelector">选择要查看的塔罗牌</h3>-->
<!--          <h3 v-else>{{ decks.find(d => d.key === selectedViewDeck)?.name }} - 牌面一览</h3>-->
<!--          <button class="close-btn" @click="closeCardViewModal">×</button>-->
<!--        </div>-->

<!--        &lt;!&ndash; 牌组选择界面 &ndash;&gt;-->
<!--        <div v-if="showDeckSelector" class="deck-selector">-->
<!--          <div class="deck-grid">-->
<!--            <div-->
<!--              v-for="deck in decks"-->
<!--              :key="deck.key"-->
<!--              class="deck-option"-->
<!--              @click="selectViewDeck(deck.key)"-->
<!--            >-->
<!--              <div class="deck-preview">-->
<!--                <img :src="`${base}${deck.imagePath}back.jpg`" alt="牌背" class="deck-back-image">-->
<!--              </div>-->
<!--              <div class="deck-info">-->
<!--                <h4>{{ deck.name }}</h4>-->
<!--                <p>{{ deck.cardCount }}张牌</p>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; 牌面网格显示 &ndash;&gt;-->
<!--        <div v-else class="cards-grid-container">-->
<!--          &lt;!&ndash; 返回按钮 &ndash;&gt;-->
<!--          <div class="grid-header">-->
<!--            <Button class="back-btn" @click="showDeckSelector = true">-->
<!--              ← 返回选择-->
<!--            </Button>-->
<!--            <div class="card-count">-->
<!--              共 {{ getSelectedDeckCards.length }} 张牌-->
<!--            </div>-->
<!--          </div>-->

<!--          &lt;!&ndash; 牌面网格 &ndash;&gt;-->
<!--          <div class="cards-grid" ref="cardsGridRef">-->
<!--            <div-->
<!--              v-for="card in getSelectedDeckCards"-->
<!--              :key="card.no"-->
<!--              class="card-grid-item"-->
<!--            >-->
<!--              <img-->
<!--                :src="card.imagePath"-->
<!--                :alt="card.name"-->
<!--                class="card-image"-->
<!--                @error="handleImageError"-->
<!--                loading="lazy"-->
<!--              />-->
<!--              <div class="card-info">-->
<!--                <span class="card-number">{{ card.no + 1 }}</span>-->
<!--                <span class="card-name">{{ card.name }}</span>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <!-- 查看牌面模态框 -->
    <div v-if="showCardViewModal" class="card-view-modal-overlay" @click.self="closeCardViewModal">
      <div class="card-view-modal-content" :class="{ 'detail-mode': showCardDetail }">
        <!-- 头部 -->
        <div class="card-view-header">
          <h3 v-if="showDeckSelector">选择要查看的塔罗牌</h3>
          <h3 v-else-if="!showCardDetail">{{ decks.find(d => d.key === selectedViewDeck)?.name }} - 牌面一览</h3>
          <h3 v-else>{{ selectedCardDetail?.name }} {{ selectedCardDetail?.english }}</h3>
          <button class="close-btn" @click="closeCardViewModal">×</button>
        </div>

        <!-- 主体内容区域 -->
        <div class="card-view-body">
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

          <!-- 牌面网格和详情面板 -->
          <div v-else class="cards-main-container">
            <!-- 左侧：牌面网格 -->
            <div class="cards-grid-section" :class="{ 'compressed': showCardDetail }">
              <div class="grid-header">
                <Button class="back-btn" @click="showDeckSelector = true">
                  ← 返回选择
                </Button>
                <div class="card-count">
                  共 {{ getSelectedDeckCards.length }} 张牌
                </div>
              </div>

              <div class="cards-grid" ref="cardsGridRef">
                <div
                  v-for="card in getSelectedDeckCards"
                  :key="card.no"
                  class="card-grid-item"
                  :class="{ 'active': selectedCardDetail?.id === card.no }"
                  @click="selectCardDetail(card.no)"
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

            <!-- 右侧：卡牌详情面板 -->
            <div v-if="showCardDetail && selectedCardDetail" class="card-detail-panel">
              <div class="detail-panel-header">
                <button class="close-detail-btn" @click="closeCardDetail">×</button>
              </div>

              <div class="detail-panel-content">
                <!-- 卡牌基本信息 -->
                <div class="card-basic-info">
                  <div class="card-image-large">
                    <img
                      :src="getCardImagePath(selectedCardDetail.id)"
                      :alt="selectedCardDetail.name"
                      class="detail-card-image"
                    />
                  </div>
                  <div class="card-names">
                    <h2 class="card-name-cn">{{ selectedCardDetail.name }}</h2>
                    <h3 class="card-name-en">{{ selectedCardDetail.english }}</h3>
                  </div>
                </div>

                <!-- 核心含义 -->
                <div class="meaning-section">
                  <h4 class="section-title">核心含义</h4>
                  <p class="core-meaning">{{ selectedCardDetail.core_meaning }}</p>
                </div>

                <!-- 正位含义 -->
                <div class="meaning-section upright-section">
                  <h4 class="section-title">正位含义</h4>
                  <div class="keywords">
                <span v-for="keyword in selectedCardDetail.upright.keywords" :key="keyword" class="keyword">
                  {{ keyword }}
                </span>
                  </div>
                  <p class="description">{{ selectedCardDetail.upright.description }}</p>
                </div>

                <!-- 逆位含义 -->
                <div class="meaning-section reversed-section">
                  <h4 class="section-title">逆位含义</h4>
                  <div class="keywords">
                <span v-for="keyword in selectedCardDetail.reversed.keywords" :key="keyword" class="keyword reversed-keyword">
                  {{ keyword }}
                </span>
                  </div>
                  <p class="description">{{ selectedCardDetail.reversed.description }}</p>
                </div>

                <!-- 故事背景 -->
                <div class="meaning-section">
                  <h4 class="section-title">故事背景</h4>
                  <p class="story-text">{{ selectedCardDetail.story }}</p>
                </div>

                <!-- 现实映射 -->
                <div class="meaning-section">
                  <h4 class="section-title">现实映射</h4>
                  <p class="mapping-text">{{ selectedCardDetail.possible_real_world_mapping }}</p>
                </div>

                <!-- 潜在风险 -->
                <div class="meaning-section risk-section">
                  <h4 class="section-title">潜在风险</h4>
                  <p class="risk-text">{{ selectedCardDetail.potential_risks }}</p>
                </div>

                <!-- 象征元素 -->
                <div class="meaning-section">
                  <h4 class="section-title">象征元素</h4>
                  <div class="symbolic-elements">
                    <div class="element-group">
                      <span class="element-label">人物：</span>
                      <span class="element-content">{{ selectedCardDetail.symbolic_elements.characters.join('、') }}</span>
                    </div>
                    <div class="element-group">
                      <span class="element-label">道具：</span>
                      <span class="element-content">{{ selectedCardDetail.symbolic_elements.props.join('、') }}</span>
                    </div>
                    <div class="element-group">
                      <span class="element-label">环境：</span>
                      <span class="element-content">{{ selectedCardDetail.symbolic_elements.environment.join('、') }}</span>
                    </div>
                    <div class="element-group">
                      <span class="element-label">时间：</span>
                      <span class="element-content">{{ selectedCardDetail.symbolic_elements.time_hint }}</span>
                    </div>
                    <div class="element-group">
                      <span class="element-label">方向：</span>
                      <span class="element-content">{{ selectedCardDetail.symbolic_elements.direction }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- 抽牌结果详情模态框 -->
    <div v-if="showDrawnCardDetailModal" class="card-view-modal-overlay" @click.self="closeDrawnCardDetail">
      <div class="card-view-modal-content drawn-card-detail-modal">
        <!-- 头部 -->
        <div class="card-view-header">
          <h3 v-if="selectedCardDetail">
            {{ selectedCardDetail.name }} - {{ selectedCardDetail.english }}
          </h3>
          <button class="close-btn" @click="closeDrawnCardDetail">×</button>
        </div>

        <!-- 详情内容 -->
        <div class="card-view-body" v-if="selectedCardDetail">
          <div class="card-detail-panel drawn-card-detail-panel">
            <div class="detail-panel-content">
              <!-- 卡牌基本信息 -->
              <div class="card-basic-info">
                <div class="card-image-large">
                  <img
                    :src="renderIMG(selectedCardDetail.id)"
                    :alt="selectedCardDetail.name"
                    class="detail-card-image"
                  />
                </div>
                <div class="card-names">
                  <h2 class="card-name-cn">{{ selectedCardDetail.name }}</h2>
                  <h3 class="card-name-en">{{ selectedCardDetail.english }}</h3>
                </div>
              </div>

              <!-- 核心含义 -->
              <div class="meaning-section">
                <h4 class="section-title">核心含义</h4>
                <p class="core-meaning">{{ selectedCardDetail.core_meaning }}</p>
              </div>

              <!-- 正位含义 -->
              <div class="meaning-section upright-section">
                <h4 class="section-title">正位含义</h4>
                <div class="keywords">
              <span v-for="keyword in selectedCardDetail.upright.keywords" :key="keyword" class="keyword">
                {{ keyword }}
              </span>
                </div>
                <p class="description">{{ selectedCardDetail.upright.description }}</p>
              </div>

              <!-- 逆位含义 -->
              <div class="meaning-section reversed-section">
                <h4 class="section-title">逆位含义</h4>
                <div class="keywords">
              <span v-for="keyword in selectedCardDetail.reversed.keywords" :key="keyword" class="keyword reversed-keyword">
                {{ keyword }}
              </span>
                </div>
                <p class="description">{{ selectedCardDetail.reversed.description }}</p>
              </div>

              <!-- 故事背景 -->
              <div class="meaning-section">
                <h4 class="section-title">故事背景</h4>
                <p class="story-text">{{ selectedCardDetail.story }}</p>
              </div>

              <!-- 现实映射 -->
              <div class="meaning-section">
                <h4 class="section-title">现实映射</h4>
                <p class="mapping-text">{{ selectedCardDetail.possible_real_world_mapping }}</p>
              </div>

              <!-- 潜在风险 -->
              <div class="meaning-section risk-section">
                <h4 class="section-title">潜在风险</h4>
                <p class="risk-text">{{ selectedCardDetail.potential_risks }}</p>
              </div>

              <!-- 象征元素 -->
              <div class="meaning-section">
                <h4 class="section-title">象征元素</h4>
                <div class="symbolic-elements">
                  <div class="element-group">
                    <span class="element-label">人物：</span>
                    <span class="element-content">{{ selectedCardDetail.symbolic_elements.characters.join('、') }}</span>
                  </div>
                  <div class="element-group">
                    <span class="element-label">道具：</span>
                    <span class="element-content">{{ selectedCardDetail.symbolic_elements.props.join('、') }}</span>
                  </div>
                  <div class="element-group">
                    <span class="element-label">环境：</span>
                    <span class="element-content">{{ selectedCardDetail.symbolic_elements.environment.join('、') }}</span>
                  </div>
                  <div class="element-group">
                    <span class="element-label">时间：</span>
                    <span class="element-content">{{ selectedCardDetail.symbolic_elements.time_hint }}</span>
                  </div>
                  <div class="element-group">
                    <span class="element-label">方向：</span>
                    <span class="element-content">{{ selectedCardDetail.symbolic_elements.direction }}</span>
                  </div>
                </div>
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
import tarotDecks from '../../data/tarot-decks.json';







// 在现有 import 后添加
import cardDetails from '../../data/pai.json'

// 在现有类型定义后添加
// type CardDetail = {
//   id: number
//   name: string
//   english: string
//   upright: {
//     keywords: string[]
//     description: string
//   }
//   reversed: {
//     keywords: string[]
//     description: string
//   }
//   story: string
//   core_meaning: string
//   potential_risks: string
//   possible_real_world_mapping: string
//   symbolic_elements: {
//     characters: string[]
//     props: string[]
//     environment: string[]
//     time_hint: string
//     direction: string
//   }
//   symbolic_attributes: {
//     interactions: string[]
//     potential_branches: string[]
//   }
// }

type CardDetail = {
  id: number
  name: string
  english: string
  upright: {
    keywords: string[]
    description: string
  }
  reversed: {
    keywords: string[]
    description: string
  }
  story: string
  core_meaning: string
  potential_risks: string
  possible_real_world_mapping: string
  symbolic_elements: {
    characters: string[]
    props: string[]
    environment: string[]
    time_hint: string
    direction: string
  }
  symbolic_attributes: {
    interactions: string[]
    potential_branches: string[]
  }
  element_relations?: {  // 可选字段
    element: string
    generates: string[]
    overcomes: string[]
    generated_by: string[]
    overcome_by: string[]
  }
  relative_effects?: any  // 可选字段
}




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
  //cardNames?: Record<number, string>
  cardNames?: Record<string, string>  // 改为 string 键
}

// 在 script setup 顶部添加更严格的类型定义
type CardInfo = {
  no: number
  name: string
  type?: 'guide' | 'spread'
  isReversed: boolean
}

// type CardResult = {
//   no: number
//   name: string
//   type?: 'guide' | 'spread'
//   isReversed: boolean
// }

type ConversationMessage = {
  role: 'user' | 'assistant'
  content: string
}

type CustomSpread = Spread & {
  isCustom: boolean
  createdAt: string
}

type CardResult = {
  no: number
  name: string
  type?: 'guide' | 'spread'
  isReversed: boolean
  cardAnalysis?: any // 添加这一行
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
// 在现有的状态变量附近添加
const isWaitingForAnalysis = ref(false) // 是否正在等待AI分析

const showCardViewModal = ref(false)
const selectedViewDeck = ref<string>('')
const showDeckSelector = ref(true)
const isOpenCardMode = ref(false)



// 在现有的 ref 声明附近添加
const showAIData = ref(false)
const isCopying = ref(false)
const copySuccess = ref(false)
// 在现有的 ref 声明附近添加
// 控制抽牌详情展示区域的显示/隐藏
const showDivinationDetails = ref(false) // 默认显示


// 格式化当前时间
const formatCurrentTime = computed(() => {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
})

// 添加格式化AI输入数据的计算属性
// const formatAIInputData = computed(() => {
//   if (!resStatus.value || cardResult.value.length === 0) return ''
//
//   const aiInputData = {
//     question: textValue.value || '请为我进行塔罗占卜',
//     deck: {
//       key: selectedDeck.value?.key || '',
//       name: selectedDeck.value?.name || '标准塔罗牌'
//     },
//     spread: {
//       key: selectedSpread.value?.key || '',
//       name: selectedSpread.value?.name || '标准牌阵',
//       desc: selectedSpread.value?.desc || '',
//       positions: selectedSpread.value?.positions || []
//     },
//     cards: cardResult.value.map((card, index) => ({
//       index: index + 1,
//       no: card.no,
//       name: card.name,
//       type: card.type,
//       isReversed: card.isReversed,
//       position: card.type === 'spread'
//         ? selectedSpread.value?.positions?.[spreadCards.value.findIndex(c => c.no === card.no)] || `第${index + 1}位`
//         : '指示牌'
//     })),
//     guideCardsCount: guideCards.value.length,
//     spreadCardsCount: spreadCards.value.length,
//     totalCards: cardResult.value.length
//   }
//
//   return JSON.stringify(aiInputData, null, 2)
// })

// const formatAIInputData = computed(() => {
//   if (!resStatus.value || cardResult.value.length === 0) return ''
//
//   const frontendToApiData = {
//     text: textValue.value || '请为我进行塔罗占卜',
//     pms: cardResult.value.map(card => ({
//       no: card.no,
//       name: card.name,
//       type: card.type,
//       isReversed: card.isReversed,
//       cardAnalysis: card.cardAnalysis ? {
//         symbols: card.cardAnalysis.symbols,
//         actions: card.cardAnalysis.actions,
//         story_hint: card.cardAnalysis.story_hint,
//         branches: card.cardAnalysis.branches
//       } : null
//     })),
//     spread: {
//       key: selectedSpread.value?.key || '',
//       name: selectedSpread.value?.name || '标准牌阵',
//       desc: selectedSpread.value?.desc || '',
//       positions: selectedSpread.value?.positions || []
//     },
//     deck: {
//       key: selectedDeck.value?.key || '',
//       name: selectedDeck.value?.name || '标准塔罗牌'
//     }
//   }
//
//   return JSON.stringify(frontendToApiData, null, 2)
// })


const formatAIInputData = computed(() => {
  if (!resStatus.value || cardResult.value.length === 0) return ''

  const frontendToApiData = {
    text: textValue.value || '请为我进行塔罗占卜',
    pms: cardResult.value.map(card => {
      const cardData = {
        no: card.no,
        name: card.name,
        type: card.type,
        isReversed: card.isReversed,
        cardAnalysis: card.cardAnalysis ? {
          symbols: card.cardAnalysis.symbols,
          actions: card.cardAnalysis.actions,
          story_hint: card.cardAnalysis.story_hint,
          branches: card.cardAnalysis.branches,
          possible_real_world_mapping: card.cardAnalysis.possible_real_world_mapping // 新增
        } : null
      }

      // 如果有 element_relations 且不为 null，则添加
      if (card.cardAnalysis?.element_relations) {
        cardData.cardAnalysis.element_relations = card.cardAnalysis.element_relations
      }

      return cardData
    }),
    spread: {
      key: selectedSpread.value?.key || '',
      name: selectedSpread.value?.name || '标准牌阵',
      desc: selectedSpread.value?.desc || '',
      positions: selectedSpread.value?.positions || []
    },
    deck: {
      key: selectedDeck.value?.key || '',
      name: selectedDeck.value?.name || '标准塔罗牌'
    }
  }

  return JSON.stringify(frontendToApiData, null, 2)
})


// 复制功能函数
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    return success
  }
}

const showCopyFeedback = () => {
  copySuccess.value = true
  setTimeout(() => {
    copySuccess.value = false
  }, 2000)
}

// 复制基本信息
const copyBasicInfo = async () => {
  const basicInfo = `塔罗占卜基本信息
占卜问题：${textValue.value || '无具体问题'}
使用牌组：${selectedDeck.value?.name || '标准塔罗牌'}
选择牌阵：${selectedSpread.value?.name || '标准牌阵'}
占卜时间：${formatCurrentTime.value}`

  const success = await copyToClipboard(basicInfo)
  if (success) {
    showCopyFeedback()
  }
}

// 复制指示牌信息
const copyGuideCards = async () => {
  if (guideCards.value.length === 0) return

  const guideCardsText = `指示牌抽牌结果：
${guideCards.value.map((card, index) =>
    `${index + 1}. ${card.name}${card.isReversed ? '（逆位）' : '（正位）'}`
  ).join('\n')}`

  const success = await copyToClipboard(guideCardsText)
  if (success) {
    showCopyFeedback()
  }
}

// 复制牌阵牌信息
const copySpreadCards = async () => {
  if (spreadCards.value.length === 0) return

  const spreadCardsText = `${selectedSpread.value?.name || '标准牌阵'}牌阵抽牌结果：
${spreadCards.value.map((card, index) => {
    const position = selectedSpread.value?.positions?.[index] || `第${index + 1}位`
    return `${index + 1}. ${position}：${card.name}${card.isReversed ? '（逆位）' : '（正位）'}`
  }).join('\n')}`

  const success = await copyToClipboard(spreadCardsText)
  if (success) {
    showCopyFeedback()
  }
}

// 复制AI数据
const copyAIData = async () => {
  const success = await copyToClipboard(formatAIInputData.value)
  if (success) {
    showCopyFeedback()
  }
}

// 复制全部详情
const copyAllDetails = async () => {
  isCopying.value = true

  const allDetails = `塔罗占卜完整记录
===================

【基本信息】
占卜问题：${textValue.value || '无具体问题'}
使用牌组：${selectedDeck.value?.name || '标准塔罗牌'}
选择牌阵：${selectedSpread.value?.name || '标准牌阵'}
占卜时间：${formatCurrentTime.value}

${guideCards.value.length > 0 ? `【指示牌】
${guideCards.value.map((card, index) =>
    `${index + 1}. ${card.name}${card.isReversed ? '（逆位）' : '（正位）'}`
  ).join('\n')}

` : ''}【牌阵牌】
${spreadCards.value.map((card, index) => {
    const position = selectedSpread.value?.positions?.[index] || `第${index + 1}位`
    return `${index + 1}. ${position}：${card.name}${card.isReversed ? '（逆位）' : '（正位）'}`
  }).join('\n')}

【AI分析结果】
${firstDivinationResult.value ? firstDivinationResult.value.replace(/<[^>]*>/g, '') : '分析中...'}`

  const success = await copyToClipboard(allDetails)
  isCopying.value = false

  if (success) {
    showCopyFeedback()
  }
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
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})





let typedInstance: Typed | null = null

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
const needReversed = ref(false)
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


// const initShuffledDeck = () => {
//   const deckCount = selectedDeck.value?.cardCount ?? 78
//   const deck: CardResult[] = Array.from({ length: deckCount }, (_, i) => ({
//     no: i,
//     name: String(selectedDeck.value?.cardNames?.[i] ?? `第${i}张`),
//     isReversed: false,
//     type: undefined // 添加 type 字段
//   }))
//
//   // 洗牌
//   for (let i = deck.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1))
//     ;[deck[i], deck[j]] = [deck[j], deck[i]]
//   }
//   shuffledDeck.value = deck
//
//   // 重置逆位状态
//   cardReversedStates.value = {}
// }

const initShuffledDeck = () => {
  const deckCount = selectedDeck.value?.cardCount ?? 78
  const start = selectedDeck.value?.start ?? 0
  const deck: CardResult[] = Array.from({ length: deckCount }, (_, i) => {
    const cardIndex = i + start  // 🔧 修正：让索引从 start 开始
    return {
      no: cardIndex,
      name: selectedDeck.value?.cardNames?.[cardIndex] ?? `第${cardIndex}张`,
      isReversed: false
    }
  })

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

// 在其他 ref 定义附近添加这一行
const firstDivinationResult = ref('')


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
// const resetFn = () => {
//   selectCardArr.value = []
//   cardResult.value = []
//   resStatus.value = false
//   loadingStatus.value = false
//   isSpreadConfirmed.value = false
//   clickedSpread.value = null
//   needReversed.value = true
//   selectedDeckKey.value = ''
//   selectedSpreadKey.value = ''
//   needGuideCards.value = false
//   guideCardCount.value = 1
//   isOpenCardMode.value = false
//   cardReversedStates.value = {}
//   customSpreads.value = []
//   showCustomSpreadModal.value = false
//   formErrors.value = {}
//   textValue.value = ''
//   if (typedInstance) {
//     typedInstance.destroy();
//     typedInstance = null
//   }
//   initShuffledDeck()
// }

const resetFn = () => {
  selectCardArr.value = []
  cardResult.value = []
  resStatus.value = false
  loadingStatus.value = false
  isWaitingForAnalysis.value = false // 添加这一行
  isSpreadConfirmed.value = false
  clickedSpread.value = null
  needReversed.value = false
  selectedDeckKey.value = ''
  selectedSpreadKey.value = ''
  needGuideCards.value = false
  guideCardCount.value = 1
  isOpenCardMode.value = false
  cardReversedStates.value = {}
  customSpreads.value = []
  showCustomSpreadModal.value = false
  formErrors.value = {}
  textValue.value = ''


  // 重置查看牌面相关状态
  showCardViewModal.value = false
  selectedViewDeck.value = ''
  showDeckSelector.value = true
  showCardDetail.value = false
  selectedCardDetail.value = null

  // 重置抽牌详情模态框状态
  showDrawnCardDetailModal.value = false




  firstDivinationResult.value = '' // 添加这一行
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

// const renderIMG = (no: number): string => {
//   const path = selectedDeck.value?.imagePath ?? 'cards/card/'
//   const start = selectedDeck.value?.start ?? 0
//   const fileNo = no + start
//   return `${base}${path}${fileNo}.jpg`
// }
const renderIMG = (no: number): string => {
  const path = selectedDeck.value?.imagePath ?? 'cards/card/'
  return `${base}${path}${no}.jpg`  // 🔧 直接使用 no，因为现在 no 已经是正确的文件编号
}


const parseApiResponse = (responseText: string): string => {
  console.log('=== parseApiResponse 开始 ===')
  console.log('输入文本长度:', responseText.length)
  console.log('输入文本前500字符:', responseText.substring(0, Math.min(responseText.length, 500))) // 打印前500字符

  try {
    const jsonData = JSON.parse(responseText)
    console.log('JSON 解析成功')
    console.log('数据结构键:', Object.keys(jsonData))

    // 直接返回content字段(如果存在)
    if (jsonData.content) {
      console.log('找到直接 content 字段')
      return jsonData.content
    }

    // 处理智谱API的嵌套结构
    if (jsonData.choices &&
      jsonData.choices[0] &&
      jsonData.choices[0].message &&
      jsonData.choices[0].message.content) {
      console.log('找到智谱 API 嵌套结构的 content')
      const content = jsonData.choices[0].message.content
      console.log('提取的 content 长度:', content.length)
      return content
    }

    // 调试输出完整结构
    console.log('未找到预期的 content 结构')
    console.log('完整数据结构:', JSON.stringify(jsonData, null, 2))
    console.warn('parseApiResponse: 未能提取到有效内容，返回空字符串。原始响应:', responseText); // 警告并打印原始响应
    return '' // 明确返回空字符串
  } catch (e) {
    console.error('JSON 解析失败:', e)
    console.log('尝试作为纯文本处理')
    console.warn('parseApiResponse: JSON 解析失败，返回原始文本。错误:', e, '原始响应:', responseText); // 警告并打印原始响应
  }

  console.log('返回原始文本')
  return responseText
}




// const getRes = async () => {
//   if (!selectedSpread.value) return
//
//   console.log('=== 开始占卜流程 ===')
//   loadingStatus.value = true
//   //resStatus.value = false; // 确保在开始新占卜时隐藏旧结果
//
//   // 生成抽牌结果
//   if (isOpenCardMode.value) {
//     cardResult.value = selectCardArr.value.map((cardNo, index) => {
//       const cardInfo = displayDeck.value.find(card => card.no === cardNo)
//       return {
//         no: cardNo,
//         name: String(cardInfo?.name || `第${cardNo + 1}张`),
//         type: needGuideCards.value && index < guideCardCount.value ? 'guide' : 'spread',
//         isReversed: Boolean(cardReversedStates.value[cardNo])
//       } as CardResult
//     })
//   } else {
//     cardResult.value = selectCardArr.value.map((cardNo, index) => {
//       const cardInfo = shuffledDeck.value.find(card => card.no === cardNo)
//       return {
//         no: cardNo,
//         name: String(cardInfo?.name || selectedDeck.value?.cardNames?.[cardNo] || `第${cardNo + 1}张`),
//         type: needGuideCards.value && index < guideCardCount.value ? 'guide' : 'spread',
//         isReversed: needReversed.value ? Math.random() > 0.5 : false
//       } as CardResult
//     })
//   }
//
//   vh.showLoading()
//
//   try {
//     const res = await fetch('/api', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         text: textValue.value,
//         pms: cardResult.value,
//         spread: {
//           key: selectedSpread.value.key,
//           name: selectedSpread.value.name,
//           count: selectedSpread.value.count,
//           positions: selectedSpread.value.positions ?? []
//         },
//         deck: {
//           key: selectedDeck.value?.key ?? '',
//           name: selectedDeck.value?.name ?? ''
//         }
//       })
//     })
//
//     if (!res.ok) {
//       const errorData = await res.json(); // 尝试解析错误响应
//       console.error('API 错误响应数据:', errorData);
//       throw new Error(`API response was not ok: ${res.statusText} - ${errorData.details || '未知错误'}`);
//     }
//
//     const resText = await res.text()
//     console.log('API 原始响应文本:', resText); // 打印原始响应文本
//     const content = parseApiResponse(resText)
//     console.log('parseApiResponse 提取的内容:', content); // 打印提取的内容
//
//     if (!content || content.length === 0) {
//       throw new Error('未能提取到有效内容');
//     }
//
//     const html = await parseMdToHtml(content)
//     console.log('Markdown 转换为 HTML:', html); // 打印转换后的HTML
//
//     // 先设置结果内容
//     firstDivinationResult.value = html
//     console.log('firstDivinationResult.value 已设置:', firstDivinationResult.value.length > 0);
//
//     // 确保 DOM 更新
//     await nextTick();
//     console.log('DOM 已更新 (nextTick 1)');
//
//     resStatus.value = true // 设置为true，显示结果页面
//     console.log('resStatus.value 已设置为 true');
//
//     // 再次等待 DOM 更新，确保 v-else-if 渲染
//     await nextTick();
//     console.log('DOM 已更新 (nextTick 2)');
//
//     console.log('=== 占卜成功完成 ===')
//
//   } catch (error) {
//     console.error('=== 占卜请求失败，进入 catch 块 ===', error)
//     resStatus.value = false
//     firstDivinationResult.value = ''
//   } finally {
//     vh.hideLoading()
//     loadingStatus.value = false
//     console.log('=== 占卜流程结束，finally 块执行 ===')
//     console.log('最终 loadingStatus:', loadingStatus.value, '最终 resStatus:', resStatus.value);
//   }
// }

const getRes = async () => {
  if (!selectedSpread.value) return

  console.log('=== 开始占卜流程 ===')
  loadingStatus.value = true
  isWaitingForAnalysis.value = true // 开始等待AI分析

  // 生成抽牌结果 - 立即显示
  if (isOpenCardMode.value) {
    cardResult.value = selectCardArr.value.map((cardNo, index) => {
      const cardInfo = displayDeck.value.find(card => card.no === cardNo)
      const cardAnalysis = generateCardAnalysis(cardNo)
      return {
        no: cardNo,
        name: String(cardInfo?.name || `第${cardNo + 1}张`),
        type: needGuideCards.value && index < guideCardCount.value ? 'guide' : 'spread',
        isReversed: Boolean(cardReversedStates.value[cardNo]),
        cardAnalysis: cardAnalysis // 添加这一行
      } as CardResult
    })
  } else {
    cardResult.value = selectCardArr.value.map((cardNo, index) => {
      const cardInfo = shuffledDeck.value.find(card => card.no === cardNo)
      const cardAnalysis = generateCardAnalysis(cardNo)
      return {
        no: cardNo,
        name: String(cardInfo?.name || selectedDeck.value?.cardNames?.[cardNo] || `第${cardNo + 1}张`),
        type: needGuideCards.value && index < guideCardCount.value ? 'guide' : 'spread',
        isReversed: needReversed.value ? Math.random() > 0.5 : false,
        cardAnalysis: cardAnalysis // 添加这一行
      } as CardResult
    })
  }

  // 立即显示抽牌结果
  resStatus.value = true
  loadingStatus.value = false

  // 清空之前的分析结果
  firstDivinationResult.value = ''

  try {
    // const res = await fetch('/api', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     text: textValue.value,
    //     pms: cardResult.value,
    //     spread: {
    //       key: selectedSpread.value.key,
    //       name: selectedSpread.value.name,
    //       count: selectedSpread.value.count,
    //       positions: selectedSpread.value.positions ?? []
    //     },
    //     deck: {
    //       key: selectedDeck.value?.key ?? '',
    //       name: selectedDeck.value?.name ?? ''
    //     }
    //   })
    // })
    // 在 getRes 函数中，找到 fetch 请求部分，修改 body 数据
    // 在 getRes 函数中，找到 fetch 请求部分，修改 body 数据
    const res = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: textValue.value,
        pms: cardResult.value.map(card => {
          const cardData = {
            no: card.no,
            name: card.name,
            type: card.type,
            isReversed: card.isReversed
          }

          // 如果有 cardAnalysis，则添加相关字段
          if (card.cardAnalysis) {
            cardData.cardAnalysis = {
              symbols: card.cardAnalysis.symbols,
              actions: card.cardAnalysis.actions,
              story_hint: card.cardAnalysis.story_hint,
              branches: card.cardAnalysis.branches,
              possible_real_world_mapping: card.cardAnalysis.possible_real_world_mapping
            }

            // 只有当 element_relations 存在时才添加
            if (card.cardAnalysis.element_relations) {
              cardData.cardAnalysis.element_relations = card.cardAnalysis.element_relations
            }
          }

          return cardData
        }),
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



    if (!res.ok) {
      const errorData = await res.json()
      console.error('API 错误响应数据:', errorData)
      throw new Error(`API response was not ok: ${res.statusText} - ${errorData.details || '未知错误'}`)
    }

    const resText = await res.text()
    console.log('API 原始响应文本:', resText)
    const content = parseApiResponse(resText)
    console.log('parseApiResponse 提取的内容:', content)

    if (!content || content.length === 0) {
      throw new Error('未能提取到有效内容')
    }

    const html = await parseMdToHtml(content)
    console.log('Markdown 转换为 HTML:', html)

    // 设置分析结果
    firstDivinationResult.value = html
    console.log('firstDivinationResult.value 已设置:', firstDivinationResult.value.length > 0)

    await nextTick()
    console.log('DOM 已更新')

    console.log('=== 占卜成功完成 ===')

  } catch (error) {
    console.error('=== 占卜请求失败，进入 catch 块 ===', error)
    firstDivinationResult.value = '<p style="color: #e74c3c;">占卜分析失败，请重试</p>'
  } finally {
    isWaitingForAnalysis.value = false // 结束等待
    console.log('=== 占卜流程结束，finally 块执行 ===')
    console.log('最终 isWaitingForAnalysis:', isWaitingForAnalysis.value, '最终 resStatus:', resStatus.value)
  }
}


// 查看牌面相关
const openCardViewModal = () => {
  showCardViewModal.value = true
  showDeckSelector.value = true
  selectedViewDeck.value = ''
}

// const closeCardViewModal = () => {
//   showCardViewModal.value = false
//   selectedViewDeck.value = ''
//   showDeckSelector.value = true
// }


const closeCardViewModal = () => {
  showCardViewModal.value = false
  selectedViewDeck.value = ''
  showDeckSelector.value = true
  // 新增：重置详情面板状态
  showCardDetail.value = false
  selectedCardDetail.value = null
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

// 在现有的查看牌面相关状态后添加
const selectedCardDetail = ref<CardDetail | null>(null)
const showCardDetail = ref(false)


// 在 selectCardDetail 函数后面添加（大约在第1800行左右）

// 显示抽中卡牌的详情
// const showDrawnCardDetail = (drawnCard: CardResult) => {
//   console.log('查看抽中卡牌详情:', drawnCard)
//
//   // 获取当前使用的牌组key
//   const currentDeckKey = selectedDeck.value?.key
//
//   if (!currentDeckKey) {
//     console.error('无法确定当前牌组')
//     return
//   }
//
//   // 从 pai.json 中查找详细信息
//   const deckDetails = (allCardDetails as CardDetailsData)[currentDeckKey]
//
//   if (!deckDetails) {
//     console.error(`未找到牌组 ${currentDeckKey} 的详情数据`)
//     return
//   }
//
//   // 查找对应的卡牌详情
//   const cardDetail = deckDetails.find(card => card.id === drawnCard.no)
//
//   if (cardDetail) {
//     selectedCardDetail.value = cardDetail
//     showDrawnCardDetailModal.value = true
//   } else {
//     console.error(`未找到卡牌 ${drawnCard.no} 的详情信息`)
//   }
// }

// 关闭抽牌详情模态框
// const closeDrawnCardDetail = () => {
//   showDrawnCardDetailModal.value = false
//   selectedCardDetail.value = null
// }
// 显示抽中卡牌的详情（保持不变）
const showDrawnCardDetail = (drawnCard: CardResult) => {
  console.log('查看抽中卡牌详情:', drawnCard)

  const currentDeckKey = selectedDeck.value?.key

  if (!currentDeckKey) {
    console.error('无法确定当前牌组')
    return
  }

  const deckDetails = (allCardDetails as CardDetailsData)[currentDeckKey]

  if (!deckDetails) {
    console.error(`未找到牌组 ${currentDeckKey} 的详情数据`)
    return
  }

  const cardDetail = deckDetails.find(card => card.id === drawnCard.no)

  if (cardDetail) {
    selectedCardDetail.value = cardDetail
    showDrawnCardDetailModal.value = true // 只使用新的模态框状态
  } else {
    console.error(`未找到卡牌 ${drawnCard.no} 的详情信息`)
  }
}



// 关闭抽牌详情模态框（修改版）
const closeDrawnCardDetail = () => {
  showDrawnCardDetailModal.value = false
  // 注意：不要重置 selectedCardDetail.value，因为查看牌面功能可能还在使用
  // selectedCardDetail.value = null // 删除这行
}


// 选择卡牌详情
// const selectCardDetail = (cardNo: number) => {
//   const detail = cardDetails.find(card => card.id === cardNo)
//   if (detail) {
//     selectedCardDetail.value = detail
//     showCardDetail.value = true
//   }
// }

// 修改导入和类型定义
import allCardDetails from '../../data/pai.json'

// 添加类型定义
type CardDetailsData = Record<string, CardDetail[]>

const selectCardDetail = (cardNo: number) => {
  if (!selectedViewDeck.value) return

  // 使用牌组的key作为标识符
  const deckKey = selectedViewDeck.value
  const deckDetails = (allCardDetails as CardDetailsData)[deckKey]

  if (!deckDetails) {
    console.warn(`未找到牌组 ${deckKey} 的详情数据`)
    console.log('可用的牌组标识:', Object.keys(allCardDetails))
    return
  }

  const detail = deckDetails.find(card => card.id === cardNo)
  if (detail) {
    selectedCardDetail.value = detail
    showCardDetail.value = true
  } else {
    console.warn(`在牌组 ${deckKey} 中未找到卡牌 ${cardNo} 的详情信息`)
  }
}



// 生成卡牌分析数据的函数
// const generateCardAnalysis = (cardNo: number): any => {
//   const currentDeckKey = selectedDeck.value?.key
//
//   if (!currentDeckKey) {
//     console.error('无法确定当前牌组')
//     return null
//   }
//
//   const deckDetails = (allCardDetails as CardDetailsData)[currentDeckKey]
//
//   if (!deckDetails) {
//     console.error(`未找到牌组 ${currentDeckKey} 的详情数据`)
//     return null
//   }
//
//   const cardDetail = deckDetails.find(card => card.id === cardNo)
//
//   if (!cardDetail) {
//     console.error(`未找到卡牌 ${cardNo} 的详情信息`)
//     // 返回默认数据而不是 null
//     return {
//       symbols: {
//         characters: ["未知人物"],
//         props: ["未知道具"],
//         environment: ["未知环境"],
//         time_hint: "未知时间",
//         direction: "未知方向"
//       },
//       actions: ["未知行动"],
//       story_hint: "无可用故事信息",
//       branches: ["需要更多信息"]
//     }
//   }
//
//   // 根据 cardDetail 生成 cardAnalysis
//   // return {
//   //   symbols: {
//   //     characters: cardDetail.symbolic_elements.characters,
//   //     props: cardDetail.symbolic_elements.props,
//   //     environment: cardDetail.symbolic_elements.environment,
//   //     time_hint: cardDetail.symbolic_elements.time_hint,
//   //     direction: cardDetail.symbolic_elements.direction
//   //   },
//   //   actions: cardDetail.symbolic_attributes.interactions,
//   //   story_hint: cardDetail.story,
//   //   branches: cardDetail.symbolic_attributes.potential_branches
//   // }
//   const analysis = {
//     symbols: {
//       characters: cardDetail.symbolic_elements.characters || ["未知人物"],
//       props: cardDetail.symbolic_elements.props || ["未知道具"],
//       environment: cardDetail.symbolic_elements.environment || ["未知环境"],
//       time_hint: cardDetail.symbolic_elements.time_hint || "未知时间",
//       direction: cardDetail.symbolic_elements.direction || "未知方向"
//     },
//     actions: cardDetail.symbolic_attributes.interactions || ["未知行动"],
//     story_hint: cardDetail.story || "无可用故事信息",
//     branches: cardDetail.symbolic_attributes.potential_branches || ["需要更多信息"]
//   }
//   console.log(`卡牌 ${cardNo} 的分析数据:`, analysis)
//   return analysis
// }
// 找到 generateCardAnalysis 函数（大约在第1600行左右），修改返回的数据结构
const generateCardAnalysis = (cardNo: number): any => {
  const currentDeckKey = selectedDeck.value?.key

  if (!currentDeckKey) {
    console.error('无法确定当前牌组')
    return null
  }

  const deckDetails = (allCardDetails as CardDetailsData)[currentDeckKey]

  if (!deckDetails) {
    console.error(`未找到牌组 ${currentDeckKey} 的详情数据`)
    return null
  }

  const cardDetail = deckDetails.find(card => card.id === cardNo)

  if (!cardDetail) {
    console.error(`未找到卡牌 ${cardNo} 的详情信息`)
    // 返回默认数据而不是 null
    return {
      symbols: {
        characters: ["未知人物"],
        props: ["未知道具"],
        environment: ["未知环境"],
        time_hint: "未知时间",
        direction: "未知方向"
      },
      actions: ["未知行动"],
      story_hint: "无可用故事信息",
      branches: ["需要更多信息"],
      possible_real_world_mapping: "无可用现实映射信息"
      // 注意：这里不设置 element_relations，因为没有数据时不应该传递
    }
  }

  const analysis = {
    symbols: {
      characters: cardDetail.symbolic_elements.characters || ["未知人物"],
      props: cardDetail.symbolic_elements.props || ["未知道具"],
      environment: cardDetail.symbolic_elements.environment || ["未知环境"],
      time_hint: cardDetail.symbolic_elements.time_hint || "未知时间",
      direction: cardDetail.symbolic_elements.direction || "未知方向"
    },
    actions: cardDetail.symbolic_attributes.interactions || ["未知行动"],
    story_hint: cardDetail.story || "无可用故事信息",
    branches: cardDetail.symbolic_attributes.potential_branches || ["需要更多信息"],
    possible_real_world_mapping: cardDetail.possible_real_world_mapping || "无可用现实映射信息"
  }

  // 只有当 element_relations 存在时才添加到分析数据中
  if (cardDetail.element_relations) {
    analysis.element_relations = cardDetail.element_relations
  }

  console.log(`卡牌 ${cardNo} 的分析数据:`, analysis)
  return analysis
}


// // 在现有的 ref 声明附近添加（大约在第85行左右，showCardDetail 附近）
// const showCardDetail = ref(false)
// const selectedCardDetail = ref<CardDetail | null>(null)

// 新增：抽牌结果详情模态框状态
const showDrawnCardDetailModal = ref(false)


// 关闭卡牌详情
const closeCardDetail = () => {
  showCardDetail.value = false
  selectedCardDetail.value = null
}

// 获取卡牌图片路径
const getCardImagePath = (cardId: number): string => {
  const deck = decks.value.find(d => d.key === selectedViewDeck.value)
  if (!deck) return ''

  const fileNo = cardId + (deck.start ?? 0)
  return `${base}${deck.imagePath}${fileNo}.jpg`
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






.card-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  color: #ffffff; /* 改为白色 */
  padding: 8px 4px 4px;
  font-size: 11px;
  text-align: center;
  border-radius: 0 0 4px 4px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8); /* 添加文字阴影 */
}

.card-name {
  font-weight: bold;
  margin-bottom: 2px;
  font-size: 12px;
  line-height: 1.2;
  color: #286440; /* 改为白色 */
}

.card-number {
  font-size: 9px;
  opacity: 0.9;
  color: #ffffff; /* 改为白色 */
}

/* 卡牌信息外部显示 */
.card-info-external {
  position: absolute;
  bottom: 100px; /* 移到卡牌下方 */
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  color: #2c3e50;
  padding: 4px 8px;
  font-size: 11px;
  text-align: center;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  border: 1px solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px); /* 添加模糊效果增强可读性 */
}

.card-name {
  font-weight: bold;
  margin-bottom: 1px;
  font-size: 11px;
  line-height: 1.2;
  color: #2c3e50;
}

.card-number {
  font-size: 9px;
  color: #5a6c7d;
}

/* 深色模式适配 */
.dark-mode .card-info-external {
  background: rgba(45, 45, 45, 0.95);
  color: #e8e8e8;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark-mode .card-name {
  color: #ffffff;
}

.dark-mode .card-number {
  color: #b0b0b0;
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



/* 结果容器样式 */
.result-container {
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

/* 重新定义指示牌和牌阵区域样式 */
.result-container .guide-cards-section,
.result-container .spread-cards-section {
  margin-bottom: 32px;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
}

.result-container .guide-cards-section {
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  border-color: #3498db;
}

.result-container .spread-cards-section {
  background: linear-gradient(135deg, #fff8f0 0%, #ffe6d9 100%);
  border-color: #f39c12;
}

.result-container .cards-section-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid currentColor;
}

/* 卡牌展示网格 */
.cards-display {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.card-display-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 140px;
  min-width: 120px;
}

.card-wrapper {
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.card-wrapper:hover {
  transform: translateY(-2px);
}

.result-card-image {
  width: 100%;
  max-width: 120px;
  height: auto;
  display: block;
}

.card-reversed {
  transform: rotate(180deg);
}

.card-info-text {
  text-align: center;
  line-height: 1.4;
}

.card-position {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
  margin-bottom: 4px;
}

.card-name-text {
  font-size: 0.9rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 2px;
}

.reverse-indicator {
  font-size: 0.8rem;
  color: #e74c3c;
  font-weight: bold;
}

/* 占卜结果区域 */
.divination-result {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border-left: 4px solid #f39c12;
}

.result-title {
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 16px;
  font-weight: bold;
}

.result-content {
  line-height: 1.7;
  color: #34495e;
  font-size: 1rem;
}

/* 重新开始按钮区域 */
.result-actions {
  text-align: center;
  padding: 20px 0;
}

.restart-btn {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}

.restart-btn:hover {
  background: linear-gradient(135deg, #c0392b 0%, #a93226 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

/* 深色模式适配 */
.dark-mode .result-container {
  background: #2d2d2d;
  color: #e0e0e0;
}

.dark-mode .result-container .guide-cards-section {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  border-color: #3b82f6;
}

.dark-mode .result-container .spread-cards-section {
  background: linear-gradient(135deg, #92400e 0%, #a16207 100%);
  border-color: #f59e0b;
}

.dark-mode .result-container .cards-section-title {
  color: #f1f5f9;
}

.dark-mode .card-position {
  color: #cbd5e1;
}

.dark-mode .card-name-text {
  color: #f1f5f9;
}

.dark-mode .divination-result {
  background: #374151;
  border-left-color: #f59e0b;
}

.dark-mode .result-title {
  color: #f1f5f9;
}

.dark-mode .result-content {
  color: #d1d5db;
}

/* 分析加载状态样式 */
.analysis-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f39c12;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #666;
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
}

.no-result {
  text-align: center;
  padding: 20px;
  color: #999;
  font-style: italic;
}

/* 深色模式适配 */
.dark-mode .loading-spinner {
  border-color: #444;
  border-top-color: #f39c12;
}

.dark-mode .loading-text {
  color: #ccc;
}

.dark-mode .no-result {
  color: #888;
}


/* 新增的复制按钮相关样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.subsection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.subsection-title {
  font-size: 1rem;
  font-weight: bold;
  color: #343a40;
  margin: 0;
}

.copy-all-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.copy-all-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #218838 0%, #1ea085 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.copy-all-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.copy-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 32px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-btn:hover {
  background: #5a6268;
  transform: scale(1.05);
}

.copy-btn:active {
  transform: scale(0.95);
}

/* 深色模式适配 */
.dark-mode .copy-all-btn {
  background: linear-gradient(135deg, #198754 0%, #0d6efd 100%);
}

.dark-mode .copy-all-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #157347 0%, #0b5ed7 100%);
}

.dark-mode .copy-btn {
  background: #495057;
}

.dark-mode .copy-btn:hover {
  background: #6c757d;
}

.dark-mode .subsection-title {
  color: #f8f9fa;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .copy-all-btn {
    width: 100%;
  }

  .subsection-header {
    gap: 8px;
  }
}




/* ===========================================
   卡牌详情面板样式
   =========================================== */

/* 修改模态框布局以支持详情模式 */
.card-view-modal-content.detail-mode {
  max-width: 1400px;
  width: 95vw;
}

.card-view-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cards-main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.cards-grid-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
}

.cards-grid-section.compressed {
  flex: 0 0 60%;
}

.cards-grid-section .cards-grid {
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
}

.card-grid-item.active {
  border-color: #f39c12 !important;
  box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.3) !important;
  transform: translateY(-2px);
}

/* 详情面板 */
.card-detail-panel {
  flex: 0 0 40%;
  background: #f8f9fa;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.detail-panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  background: #fff;
}

.close-detail-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-detail-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.detail-panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 卡牌基本信息 */
.card-basic-info {
  text-align: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-image-large {
  margin-bottom: 16px;
}

.detail-card-image {
  width: 120px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card-names {
  text-align: center;
}

.card-name-cn {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.card-name-en {
  font-size: 1.1rem;
  color: #7f8c8d;
  font-style: italic;
  margin: 0;
  font-weight: normal;
}

/* 含义区块 */
.meaning-section {
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 12px 0;
  padding-bottom: 6px;
  border-bottom: 2px solid #ecf0f1;
}

.upright-section .section-title {
  color: #27ae60;
  border-bottom-color: #27ae60;
}

.reversed-section .section-title {
  color: #e74c3c;
  border-bottom-color: #e74c3c;
}

.risk-section .section-title {
  color: #f39c12;
  border-bottom-color: #f39c12;
}

/* 关键词 */
.keywords {
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword {
  background: #3498db;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
}

.reversed-keyword {
  background: #e74c3c;
}

/* 描述文本 */
.description,
.core-meaning,
.story-text,
.mapping-text,
.risk-text {
  line-height: 1.6;
  color: #34495e;
  margin: 0;
  font-size: 0.9rem;
}

/* 象征元素 */
.symbolic-elements {
  font-size: 0.9rem;
}

.element-group {
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
}

.element-label {
  font-weight: bold;
  color: #2c3e50;
  min-width: 50px;
  flex-shrink: 0;
}

.element-content {
  color: #34495e;
  line-height: 1.4;
}

/* 深色模式适配 */
.dark-mode .card-detail-panel {
  background: #1a1a1a;
  border-left-color: #444;
}

.dark-mode .detail-panel-header {
  background: #2d2d2d;
  border-bottom-color: #444;
}

.dark-mode .close-detail-btn {
  color: #ccc;
}

.dark-mode .close-detail-btn:hover {
  background: #444;
  color: #fff;
}

.dark-mode .card-basic-info,
.dark-mode .meaning-section {
  background: #2d2d2d;
  color: #e0e0e0;
}

.dark-mode .card-name-cn {
  color: #f1f5f9;
}

.dark-mode .card-name-en {
  color: #cbd5e1;
}

.dark-mode .section-title {
  color: #f1f5f9;
  border-bottom-color: #444;
}

.dark-mode .upright-section .section-title {
  color: #2ecc71;
  border-bottom-color: #2ecc71;
}

.dark-mode .reversed-section .section-title {
  color: #e74c3c;
  border-bottom-color: #e74c3c;
}

.dark-mode .risk-section .section-title {
  color: #f39c12;
  border-bottom-color: #f39c12;
}

.dark-mode .description,
.dark-mode .core-meaning,
.dark-mode .story-text,
.dark-mode .mapping-text,
.dark-mode .risk-text {
  color: #d1d5db;
}

.dark-mode .element-label {
  color: #f1f5f9;
}

.dark-mode .element-content {
  color: #d1d5db;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cards-main-container {
    flex-direction: column;
  }

  .cards-grid-section {
    flex: none !important;
    height: 40vh;
  }

  .cards-grid-section.compressed {
    flex: none !important;
  }

  .card-detail-panel {
    flex: 1 !important;
    border-left: none;
    border-top: 1px solid #e0e0e0;
  }

  .detail-card-image {
    width: 100px;
  }

  .card-name-cn {
    font-size: 1.3rem;
  }

  .card-name-en {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .detail-panel-content {
    padding: 12px;
  }

  .card-basic-info {
    padding: 16px;
  }

  .meaning-section {
    padding: 12px;
  }

  .detail-card-image {
    width: 80px;
  }
}


/* ===========================================
   抽牌结果详情样式
   =========================================== */

/* 可点击卡牌样式 */
.clickable-card-wrapper {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
}

.clickable-card-wrapper:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.clickable-card {
  transition: all 0.3s ease;
}

.clickable-card:hover {
  filter: brightness(1.1);
}

/* 点击提示 */
.click-hint {
  font-size: 0.75rem;
  color: #666;
  margin-top: 6px;
  opacity: 0.7;
  transition: all 0.2s ease;
  font-weight: 500;
}

.clickable-card-wrapper:hover .click-hint {
  opacity: 1;
  color: #f39c12;
  transform: translateY(-1px);
}

/* 抽牌详情模态框特殊样式 */
.drawn-card-detail-modal {
  max-width: 800px;
  width: 90vw;
  max-height: 85vh;
}

.drawn-card-detail-panel {
  flex: 1;
  border-left: none;
  background: #f8f9fa;
}

/* 深色模式适配 */
.dark-mode .click-hint {
  color: #ccc;
}

.dark-mode .clickable-card-wrapper:hover .click-hint {
  color: #f39c12;
}

.dark-mode .drawn-card-detail-panel {
  background: #1a1a1a;
}

.dark-mode .clickable-card-wrapper:hover {
  box-shadow: 0 8px 25px rgba(255,255,255,0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .drawn-card-detail-modal {
    width: 95vw;
    max-height: 90vh;
  }

  .clickable-card-wrapper:hover {
    transform: translateY(-2px) scale(1.01);
  }
}

@media (max-width: 480px) {
  .click-hint {
    font-size: 0.7rem;
  }

  .drawn-card-detail-modal {
    width: 98vw;
  }
}



</style>
