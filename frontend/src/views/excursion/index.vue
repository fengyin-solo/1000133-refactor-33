<template>
  <section class="page" data-module="excursion">
    <header class="page-head">
      <div>
        <h2>温度异常管理</h2>
        <p class="page-desc">维护温度异常事件，围绕事件编号、关联运单、异常类型、超限时长做登记、筛选与状态流转。</p>
      </div>
      <div class="page-actions">
        <button class="btn primary" type="button" @click="openCreate">登记温度异常事件</button>
        <button class="btn" type="button" @click="exportRows">导出温度异常清单</button>
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
          <td :colspan="columns.length + 1" class="empty-state">暂无温度异常数据，可先登记温度异常事件</td>
        </tr>
      </tbody>
    </table>

    <footer class="page-foot">
      <span>共 {{ total }} 条温度异常记录</span>
      <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { useModulePage } from '@/composables/useModulePage'

const columns = ["事件编号", "关联运单", "异常类型", "超限时长", "最高温度", "发生时间", "处置人"]
const actions = ["受理事件", "提交处置", "忽略事件"]
const statuses = ["待处置", "处置中", "已闭环", "已忽略"]
const stats = [{"label": "待处置事件", "value": 0}, {"label": "超限时长合计", "value": 0}, {"label": "今日闭环数", "value": 0}]

const {
  rows,
  total,
  errorMessage,
  filters,
  filterFields,
  resetFilters,
  exportRows,
  openCreate,
  runAction,
  reload,
} = useModulePage({
  columns,
  endpoint: '/api/excursion',
  loadFailedMessage: '温度异常事件列表读取失败',
  loadErrorMessage: '温度异常列表读取失败',
  actionFailedMessage: '温度异常动作未生效，请稍后重试',
  actionErrorMessage: '温度异常操作失败',
  notReadyMessage: '温度异常事件登记入口尚未接入审批流',
})
</script>
