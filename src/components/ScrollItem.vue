<script setup lang='ts'>
import { defineProps } from 'vue'
interface Item {
  avatar: string,
  content: string,
  time: string
}

defineProps<{itemData: Item}>()
</script>
  
<template>
<div class="chat-item">
    <img class="avatar" :src="itemData.avatar" />
    <div class="bubble">
        <p>{{itemData.content}}</p>
        <div class="meta">
            <time class="posted-date">{{itemData.time}}</time>
        </div>
    </div>
</div>
</template>
<style lang="less" scoped>
.chat-item {
  display: flex;
  padding: 10px 0;
  width: 100%;
  contain: layout;
  will-change: transform;
  p {
      margin: 0;
      word-wrap: break-word;
      font-size: 13px;
  }
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 500px;
  margin-left: 20px;
  margin-right: 6px;
  min-width: 48px;
}
.bubble {
  padding: 7px 10px;
  color: #333;
  background: #fff;
  box-shadow: 0 3px 2px rgba(0,0,0,0.1);
  position: relative;
  max-width: 420px;
  min-width: 80px;
  margin: 0 5px;
}
.meta {
  font-size: 0.8rem;
  color: #999;
  margin-top: 3px;
}
</style>