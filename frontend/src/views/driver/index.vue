<template>
  <section class="page" data-module="driver">
    <header class="page-head">
      <div>
        <h2>司机管理管理</h2>
        <p class="page-desc">维护司机档案，围绕司机工号、司机姓名、联系电话、驾驶证号做登记、筛选与状态流转。</p>
      </div>
      <div class="page-actions">
        <button class="btn primary" type="button" @click="openCreate">登记司机档案</button>
        <button class="btn" type="button" @click="exportRows">导出司机管理清单</button>
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
          <td :colspan="columns.length + 1" class="empty-state">暂无司机管理数据，可先登记司机档案</td>
        </tr>
      </tbody>
    </table>

    <footer class="page-foot">
      <span>共 {{ total }} 条司机管理记录</span>
      <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { useModulePage } from '@/composables/useModulePage'

const columns = ["司机工号", "司机姓名", "联系电话", "驾驶证号", "从业资格证号", "所属车队", "在途状态"]
const actions = ["安排上岗", "排班休息", "办理离职"]
const statuses = ["待上岗", "在岗", "休息中", "已离职"]
const stats = [{"label": "在岗司机", "value": 0}, {"label": "休息司机", "value": 0}, {"label": "证照即将到期", "value": 0}]

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
  endpoint: '/api/driver',
  loadFailedMessage: '司机档案列表读取失败',
  loadErrorMessage: '司机管理列表读取失败',
  actionFailedMessage: '司机管理动作未生效，请稍后重试',
  actionErrorMessage: '司机管理操作失败',
  notReadyMessage: '司机档案登记入口尚未接入审批流',
})
</script>
