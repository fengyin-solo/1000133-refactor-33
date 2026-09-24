<template>
  <section class="page" data-module="device">
    <header class="page-head">
      <div>
        <h2>温控设备管理</h2>
        <p class="page-desc">维护温控设备，围绕设备编号、设备名称、设备型号、安装位置做登记、筛选与状态流转。</p>
      </div>
      <div class="page-actions">
        <button class="btn primary" type="button" @click="openCreate">登记温控设备</button>
        <button class="btn" type="button" @click="exportRows">导出温控设备清单</button>
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
          <td :colspan="columns.length + 1" class="empty-state">暂无温控设备数据，可先登记温控设备</td>
        </tr>
      </tbody>
    </table>

    <footer class="page-foot">
      <span>共 {{ total }} 条温控设备记录</span>
      <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { useModulePage } from '@/composables/useModulePage'

const columns = ["设备编号", "设备名称", "设备型号", "安装位置", "采集精度", "校准到期日", "责任人"]
const actions = ["登记设备", "提交校准", "报废设备"]
const statuses = ["在用", "待校准", "故障", "已报废"]
const stats = [{"label": "在册设备", "value": 0}, {"label": "待校准设备", "value": 0}, {"label": "故障设备", "value": 0}]

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
  endpoint: '/api/device',
  loadFailedMessage: '温控设备列表读取失败',
  loadErrorMessage: '温控设备列表读取失败',
  actionFailedMessage: '温控设备动作未生效，请稍后重试',
  actionErrorMessage: '温控设备操作失败',
  notReadyMessage: '温控设备登记入口尚未接入审批流',
})
</script>
