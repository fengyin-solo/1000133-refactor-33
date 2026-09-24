<template>
  <section class="page" data-module="maint">
    <header class="page-head">
      <div>
        <h2>维保工单管理</h2>
        <p class="page-desc">维护维保工单，围绕工单编号、关联设备、故障现象、紧急程度做登记、筛选与状态流转。</p>
      </div>
      <div class="page-actions">
        <button class="btn primary" type="button" @click="openCreate">登记维保工单</button>
        <button class="btn" type="button" @click="exportRows">导出维保工单清单</button>
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
          <td :colspan="columns.length + 1" class="empty-state">暂无维保工单数据，可先登记维保工单</td>
        </tr>
      </tbody>
    </table>

    <footer class="page-foot">
      <span>共 {{ total }} 条维保工单记录</span>
      <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { useModulePage } from '@/composables/useModulePage'

const columns = ["工单编号", "关联设备", "故障现象", "紧急程度", "报修人", "受理班组", "期望完成时间"]
const actions = ["受理工单", "派工处理", "关闭工单"]
const statuses = ["待受理", "处理中", "待验收", "已关闭"]
const stats = [{"label": "待受理工单", "value": 0}, {"label": "超时工单", "value": 0}, {"label": "平均处理时长", "value": 0}]

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
  endpoint: '/api/maint',
  loadFailedMessage: '维保工单列表读取失败',
  loadErrorMessage: '维保工单列表读取失败',
  actionFailedMessage: '维保工单动作未生效，请稍后重试',
  actionErrorMessage: '维保工单操作失败',
  notReadyMessage: '维保工单登记入口尚未接入审批流',
})
</script>
