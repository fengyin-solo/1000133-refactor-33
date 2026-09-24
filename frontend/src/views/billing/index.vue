<template>
  <section class="page" data-module="billing">
    <header class="page-head">
      <div>
        <h2>计费结算管理</h2>
        <p class="page-desc">维护计费单，围绕计费单号、客户名称、计费周期、运输里程做登记、筛选与状态流转。</p>
      </div>
      <div class="page-actions">
        <button class="btn primary" type="button" @click="openCreate">登记计费单</button>
        <button class="btn" type="button" @click="exportRows">导出计费结算清单</button>
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
          <td :colspan="columns.length + 1" class="empty-state">暂无计费结算数据，可先登记计费单</td>
        </tr>
      </tbody>
    </table>

    <footer class="page-foot">
      <span>共 {{ total }} 条计费结算记录</span>
      <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { useListPage } from '@/api/listPage'

const ENDPOINT = '/api/billing'
const columns = ["计费单号", "客户名称", "计费周期", "运输里程", "计费金额", "计费规则", "结算状态"]
const actions = ["生成账单", "确认对账", "开具发票"]
const statuses = ["待核算", "已核算", "已对账", "已开票"]
const stats = [{"label": "待核算账单", "value": 0}, {"label": "本月应收金额", "value": 0}, {"label": "已开票金额", "value": 0}]

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
  createHint: '计费单登记入口尚未接入审批流',
  actionFailed: '计费结算动作未生效，请稍后重试',
  actionFallback: '计费结算操作失败',
  loadFailed: '计费单列表读取失败',
  loadFallback: '计费结算列表读取失败',
})

const filterFields = columns.slice(0, 3)
</script>
