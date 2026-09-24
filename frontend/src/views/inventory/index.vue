<template>
  <section class="page" data-module="inventory">
    <header class="page-head">
      <div>
        <h2>库存管理管理</h2>
        <p class="page-desc">维护库存批次，围绕库存编码、货物名称、批次号、库位编号做登记、筛选与状态流转。</p>
      </div>
      <div class="page-actions">
        <button class="btn primary" type="button" @click="openCreate">登记库存批次</button>
        <button class="btn" type="button" @click="exportRows">导出库存管理清单</button>
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
          <td :colspan="columns.length + 1" class="empty-state">暂无库存管理数据，可先登记库存批次</td>
        </tr>
      </tbody>
    </table>

    <footer class="page-foot">
      <span>共 {{ total }} 条库存管理记录</span>
      <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { useListPage } from '@/api/listPage'

const ENDPOINT = '/api/inventory'
const columns = ["库存编码", "货物名称", "批次号", "库位编号", "在库数量", "锁定量", "保质期至", "入库日期"]
const actions = ["冻结库存", "解冻库存", "盘点修正"]
const statuses = ["正常", "临近保质期", "已冻结", "已清空"]
const stats = [{"label": "在库批次", "value": 0}, {"label": "临期批次", "value": 0}, {"label": "冻结数量", "value": 0}]

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
  createHint: '库存批次登记入口尚未接入审批流',
  actionFailed: '库存管理动作未生效，请稍后重试',
  actionFallback: '库存管理操作失败',
  loadFailed: '库存批次列表读取失败',
  loadFallback: '库存管理列表读取失败',
})

const filterFields = columns.slice(0, 3)
</script>
