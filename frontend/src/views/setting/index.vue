<template>
  <section class="page" data-module="setting">
    <header class="page-head">
      <div>
        <h2>系统设置管理</h2>
        <p class="page-desc">维护系统参数，围绕参数编码、参数名称、参数值、参数类型做登记、筛选与状态流转。</p>
      </div>
      <div class="page-actions">
        <button class="btn primary" type="button" @click="openCreate">登记系统参数</button>
        <button class="btn" type="button" @click="exportRows">导出系统设置清单</button>
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
          <td :colspan="columns.length + 1" class="empty-state">暂无系统设置数据，可先登记系统参数</td>
        </tr>
      </tbody>
    </table>

    <footer class="page-foot">
      <span>共 {{ total }} 条系统设置记录</span>
      <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { useModulePage } from '@/composables/useModulePage'

const columns = ["参数编码", "参数名称", "参数值", "参数类型", "生效范围", "修改人"]
const actions = ["修改参数", "回滚参数", "生效参数"]
const statuses = ["已生效", "待生效", "已回滚"]
const stats = [{"label": "生效参数", "value": 0}, {"label": "待生效参数", "value": 0}, {"label": "本周变更次数", "value": 0}]

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
  endpoint: '/api/setting',
  loadFailedMessage: '系统参数列表读取失败',
  loadErrorMessage: '系统设置列表读取失败',
  actionFailedMessage: '系统设置动作未生效，请稍后重试',
  actionErrorMessage: '系统设置操作失败',
  notReadyMessage: '系统参数登记入口尚未接入审批流',
})
</script>
