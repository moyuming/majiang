<template>
  <div class="app-container">
    <!-- 筒子行 -->
    <div class="mahjong-row">
      <div class="tiles-row">
        <div 
          v-for="(tile, index) in 9" 
          :key="'tong' + index" 
          class="mahjong-tile" 
          data-type="tong" 
          :data-index="index"
          :class="{ 'selected': isSelected('tong', index) }"
          @click="selectTile('tong', index, (index + 1) + '筒')"
        >
          <span class="count" v-if="counts.tong[index] > 0">{{ counts.tong[index] }}</span>
          <div class="tile-content">{{ index + 1 }}筒</div>
        </div>
      </div>
    </div>
    
    <!-- 条子行 -->
    <div class="mahjong-row">
      <div class="tiles-row">
        <div 
          v-for="(tile, index) in 9" 
          :key="'tiao' + index" 
          class="mahjong-tile" 
          data-type="tiao" 
          :data-index="index"
          :class="{ 'selected': isSelected('tiao', index) }"
          @click="selectTile('tiao', index, (index + 1) + '条')"
        >
          <span class="count" v-if="counts.tiao[index] > 0">{{ counts.tiao[index] }}</span>
          <div class="tile-content">{{ index + 1 }}条</div>
        </div>
      </div>
    </div>
    
    <!-- 万子行 -->
    <div class="mahjong-row">
      <div class="tiles-row">
        <div 
          v-for="(tile, index) in 9" 
          :key="'wan' + index" 
          class="mahjong-tile" 
          data-type="wan" 
          :data-index="index"
          :class="{ 'selected': isSelected('wan', index) }"
          @click="selectTile('wan', index, (index + 1) + '万')"
        >
          <span class="count" v-if="counts.wan[index] > 0">{{ counts.wan[index] }}</span>
          <div class="tile-content">{{ index + 1 }}万</div>
        </div>
      </div>
    </div>
    <div class="mahjong-row">
      <div class="tiles-row">
        <div 
          class="mahjong-tile" 
          :class="{ 'selected': currentPosition == 'L' }"
          @click="currentPosition = 'L'"
        >
          <div class="tile-content">{{ positions.L }}</div>
        </div>
        <div 
          class="mahjong-tile" 
          :class="{ 'selected': currentPosition == 'F' }"
          @click="currentPosition = 'F'"
        >
          <div class="tile-content">{{ positions.F }}</div>
        </div>
        <div 
          class="mahjong-tile" 
          :class="{ 'selected': currentPosition == 'R' }"
          @click="currentPosition = 'R'"
        >
          <div class="tile-content">{{ positions.R }}</div>
        </div>
      </div>
    </div>
    <!-- 全局操作区 -->
    <div class="control-panel">
      <div class="global-buttons">
        <button class="reset-btn" @click="resetCounts">重置</button>
        <button v-for="num in 4" :key="num" class="number-btn" @click="updateSelectedCount(num)">{{num}}</button>
        
      </div>
    </div>
  </div>
</template>

<script>
let wakeLock = null;
const setWakeLock = function () {
    if (wakeLock) {
        return;    
    }
    navigator.wakeLock.request('screen').then(result => {
        wakeLock = result;
        // 提示
        console.log('唤醒锁定已激活');
        // 释放的时候也提示下
        wakeLock.addEventListener('release', () => {
            wakeLock = null;
            console.log('唤醒锁定已释放');
        });
    }).catch((err) => {
        console.error(`<span class="red">唤醒锁定失败：${err.message}</span>`);    
    });
};
export default {
  name: 'App',
  data() {
    return {
      counts: {
        // 筒子、条子、万子各9种，初始数量为0
        tong: Array(9).fill(0),
        tiao: Array(9).fill(0),
        wan: Array(9).fill(0)
      },
      positions: {
        L: '',
        R: '',
        F: ''
      },
      currentPosition: '',
      selectedTile: null // 存储选中的牌 {type, index, name}
    }
  },
  mounted() {
    if (navigator.wakeLock) {
        setWakeLock();
        // 选项卡切换到当前页面，如果已经释放了熄屏，再次锁定
        document.addEventListener('visibilitychange', () => {
          if (wakeLock === null && document.visibilityState === 'visible') {
            setWakeLock();
          }
        });
    } else {
        console.error('当前浏览器不支持Screen Wake Lock API！');    
    }
  },
  methods: {
    // 选择牌型
    selectTile(type, index, name) {
      this.selectedTile = { type, index, name }
      if(this.currentPosition){
        this.positions[this.currentPosition] = name
        this.currentPosition = ''
      }
      this.$set(this.counts[type], index, Math.min(4, this.counts[type][index] + 1))
    },
    
    // 检查牌型是否被选中
    isSelected(type, index) {
      return this.selectedTile && this.selectedTile.type === type && this.selectedTile.index === index
    },
    
    // 通过全局按钮更新数量
    updateSelectedCount(number) {
      if (this.selectedTile) {
        const { type, index } = this.selectedTile
        // 确保数量不会超过4（一副麻将中每种牌最多4张）
        const newValue = Math.min(4, number)
        // 使用Vue.set确保响应式更新
        this.$set(this.counts[type], index, newValue)
        
        // 添加短暂的视觉反馈
        // const tileClass = `.mahjong-tile[data-type="${type}"][data-index="${index}"]`
        // const tile = document.querySelector(tileClass)
        // if (tile) {
        //   tile.style.transform = 'scale(1.1)'
        //   setTimeout(() => {
        //     tile.style.transform = 'scale(1)'
        //   }, 200)
        // }
      }
    },
    
    // 重置所有记录
    resetCounts() {
      this.counts.tong = Array(9).fill(0)
      this.counts.tiao = Array(9).fill(0)
      this.counts.wan = Array(9).fill(0)
      this.selectedTile = null
      this.positions = {
        L: '',
        R: '',
        F: ''
      }
      this.currentPosition = ''
    }
  }
}
</script>

<style scoped>
.app-container {
  padding-top: 30px;
  width: 800px;
  transform: rotate(90deg);
  transform-origin: 186px 186px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

h2 {
  color: #555;
  font-size: 18px;
}

h3 {
  color: #666;
  margin: 10px 0;
  font-size: 16px;
}

/* 控制面板样式 */
.control-panel {
  
}

.global-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 15px 0;
}

.number-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 24px;
  transition: background-color 0.3s;
}

.number-btn:hover {
  background-color: #45a049;
}

.selected-info {
  margin: 15px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* 行样式 */
.mahjong-row {
  margin-bottom: 5px;
}

.tiles-row {
  display: flex;
  gap: 10px;
  flex: 1;
  flex-wrap: nowrap;
  justify-content: center;
}

/* 牌型样式 */
.mahjong-tile {
  position: relative;
  background-color: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  width: 70px;
  height: 54px;
}

.mahjong-tile:hover {
  background-color: #e8e8e8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.mahjong-tile.selected {
  background-color: #fff9c4;
  border-color: #ffc107;
  box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.3);
}

.count {
  position: absolute;
  top: -20px;
  right: 25px;
  background-color: #fff;
  color: #ff4444;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 28px;
  z-index: 10;
}

.tile-content {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 10px 0;
}

/* 重置按钮样式 */
.reset-btn {
  margin-top: 15px;
  padding: 12px 30px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.reset-btn:hover {
  background-color: #e68900;
}


</style>
