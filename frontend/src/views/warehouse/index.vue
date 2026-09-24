<template>
  <section class="page" data-module="warehouse">
    <header class="page-head">
      <div>
        <h2>冷库管理管理</h2>
        <p class="page-desc">维护冷库档案，围绕冷库编码、冷库名称、库区温区、设定温度做登记、筛选与状态流转。</p>
      </div>
      <div class="page-actions">
        <button class="btn primary" type="button" @click="openCreate">登记冷库档案</button>
        <button class="btn" type="button" @click="exportRows">导出冷库管理清单</button>
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
          <td :colspan="columns.length + 1" class="empty-state">暂无冷库管理数据，可先登记冷库档案</td>
        </tr>
      </tbody>
    </table>

    <footer class="page-foot">
      <span>共 {{ total }} 条冷库管理记录</span>
      <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { useListPage } from '@/api/listPage'

const ENDPOINT = '/api/warehouse'
const columns = ["冷库编码", "冷库名称", "库区温区", "设定温度", "库容吨位", "责任人", "启用状态"]
const actions = ["启用冷库", "安排检修", "停用冷库"]
const statuses = ["已启用", "检修中", "已停用"]
const stats = [{"label": "启用冷库", "value": 0}, {"label": "检修冷库", "value": 0}, {"label": "库容利用率", "value": 0}]

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
  createHint: '冷库档案登记入口尚未接入审批流',
  actionFailed: '冷库管理动作未生效，请稍后重试',
  actionFallback: '冷库管理操作失败',
  loadFailed: '冷库档案列表读取失败',
  loadFallback: '冷库管理列表读取失败',
})

const filterFields = columns.slice(0, 3)
</script>
