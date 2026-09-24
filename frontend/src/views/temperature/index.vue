<template>
  <section class="page" data-module="temperature">
    <header class="page-head">
      <div>
        <h2>温控监控管理</h2>
        <p class="page-desc">维护温控记录，围绕记录编号、关联运单、测点编号、实时温度做登记、筛选与状态流转。</p>
      </div>
      <div class="page-actions">
        <button class="btn primary" type="button" @click="openCreate">登记温控记录</button>
        <button class="btn" type="button" @click="exportRows">导出温控监控清单</button>
      </div>
    </header>

    <div class="stat-row">
      <article v-for="item in stats" :key="item.label" class="stat-card">
        <span class="stat-label">{{ item.label }}</span>
        <strong class="stat-value">{{ item.value }}</strong>
      </article>
    </div>

    <form class="filter-bar" @submit.prevent="reload">
      <label v-for="field in filterFields" :key="field" class="filter-item">
        <span>{{ field }}</span>
        <input v-model="filters[field]" :placeholder="`按${field}检索`" />
      </label>
      <button class="btn" type="submit">查询</button>
      <button class="btn ghost" type="button" @click="resetFilters">重置条件</button>
    </form>

    <table class="data-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column">{{ column }}</th>
          <th>可执行动作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="String(row.id)">
          <td v-for="column in columns" :key="column">{{ row[column] ?? '—' }}</td>
          <td class="row-actions">
            <button
              v-for="action in actions"
              :key="action"
              class="link"
              type="button"
              @click="runAction(action, row)"
            >
              {{ action }}
            </button>
          </td>
        </tr>
        <tr v-if="!rows.length">
          <td :colspan="columns.length + 1" class="empty-state">暂无温控监控数据，可先登记温控记录</td>
        </tr>
      </tbody>
    </table>

    <footer class="page-foot">
      <span>共 {{ total }} 条温控监控记录</span>
      <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { useListPage } from '@/api/listPage'

const ENDPOINT = '/api/temperature'
const columns = ["记录编号", "关联运单", "测点编号", "实时温度", "温度上限", "温度下限", "采集时间"]
const actions = ["确认记录", "标记超限", "重新采集"]
const statuses = ["正常", "偏高", "偏低", "已离线"]
const stats = [{"label": "今日采集测点", "value": 0}, {"label": "超限测点", "value": 0}, {"label": "离线测点", "value": 0}]

const {
  rows,
  total,
  errorMessage,
  filters,
  reload,
  runAction,
  resetFilters,
  exportRows,
  openCreate,
} = useListPage(ENDPOINT, {
  createHint: '温控记录登记入口尚未接入审批流',
  actionFailed: '温控监控动作未生效，请稍后重试',
  actionFallback: '温控监控操作失败',
  loadFailed: '温控记录列表读取失败',
  loadFallback: '温控监控列表读取失败',
})

const filterFields = columns.slice(0, 3)
</script>
