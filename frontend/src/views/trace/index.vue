<template>
  <section class="page" data-module="trace">
    <header class="page-head">
      <div>
        <h2>批次追溯管理</h2>
        <p class="page-desc">维护追溯记录，围绕追溯码、货物名称、生产批次、上游供应商做登记、筛选与状态流转。</p>
      </div>
      <div class="page-actions">
        <button class="btn primary" type="button" @click="openCreate">登记追溯记录</button>
        <button class="btn" type="button" @click="exportRows">导出批次追溯清单</button>
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
          <td :colspan="columns.length + 1" class="empty-state">暂无批次追溯数据，可先登记追溯记录</td>
        </tr>
      </tbody>
    </table>

    <footer class="page-foot">
      <span>共 {{ total }} 条批次追溯记录</span>
      <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { useListPage } from '@/api/listPage'

const ENDPOINT = '/api/trace'
const columns = ["追溯码", "货物名称", "生产批次", "上游供应商", "入库单号", "全程温度区间", "追溯状态"]
const actions = ["关联上游", "发布追溯", "撤回追溯"]
const statuses = ["待关联", "已关联", "已发布", "已撤回"]
const stats = [{"label": "追溯码总量", "value": 0}, {"label": "待关联追溯", "value": 0}, {"label": "已发布追溯", "value": 0}]

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
  createHint: '追溯记录登记入口尚未接入审批流',
  actionFailed: '批次追溯动作未生效，请稍后重试',
  actionFallback: '批次追溯操作失败',
  loadFailed: '追溯记录列表读取失败',
  loadFallback: '批次追溯列表读取失败',
})

const filterFields = columns.slice(0, 3)
</script>
