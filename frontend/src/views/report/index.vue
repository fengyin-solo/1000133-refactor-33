<template>
  <section class="page" data-module="report">
    <header class="page-head">
      <div>
        <h2>报表导出管理</h2>
        <p class="page-desc">维护报表任务，围绕报表名称、统计范围、统计周期、导出格式做登记、筛选与状态流转。</p>
      </div>
      <div class="page-actions">
        <button class="btn primary" type="button" @click="openCreate">登记报表任务</button>
        <button class="btn" type="button" @click="exportRows">导出报表导出清单</button>
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
          <td :colspan="columns.length + 1" class="empty-state">暂无报表导出数据，可先登记报表任务</td>
        </tr>
      </tbody>
    </table>

    <footer class="page-foot">
      <span>共 {{ total }} 条报表导出记录</span>
      <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { useListPage } from '@/api/listPage'

const ENDPOINT = '/api/report'
const columns = ["报表名称", "统计范围", "统计周期", "导出格式", "任务状态", "生成时间"]
const actions = ["生成报表", "重试任务", "下载报表"]
const statuses = ["排队中", "生成中", "已完成", "已失败"]
const stats = [{"label": "排队任务", "value": 0}, {"label": "生成中任务", "value": 0}, {"label": "失败任务", "value": 0}]

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
  createHint: '报表任务登记入口尚未接入审批流',
  actionFailed: '报表导出动作未生效，请稍后重试',
  actionFallback: '报表导出操作失败',
  loadFailed: '报表任务列表读取失败',
  loadFallback: '报表导出列表读取失败',
})

const filterFields = columns.slice(0, 3)
</script>
