<template>
  <section class="page" data-module="customer">
    <header class="page-head">
      <div>
        <h2>客户管理管理</h2>
        <p class="page-desc">维护客户档案，围绕客户编码、客户名称、客户类型、联系人做登记、筛选与状态流转。</p>
      </div>
      <div class="page-actions">
        <button class="btn primary" type="button" @click="openCreate">登记客户档案</button>
        <button class="btn" type="button" @click="exportRows">导出客户管理清单</button>
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
          <td :colspan="columns.length + 1" class="empty-state">暂无客户管理数据，可先登记客户档案</td>
        </tr>
      </tbody>
    </table>

    <footer class="page-foot">
      <span>共 {{ total }} 条客户管理记录</span>
      <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { useModulePage } from '@/composables/useModulePage'

const columns = ["客户编码", "客户名称", "客户类型", "联系人", "联系电话", "结算方式", "合作状态"]
const actions = ["审核客户", "暂停合作", "终止合作"]
const statuses = ["待审核", "合作中", "已暂停", "已终止"]
const stats = [{"label": "合作客户", "value": 0}, {"label": "待审核客户", "value": 0}, {"label": "本月新增客户", "value": 0}]

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
  endpoint: '/api/customer',
  loadFailedMessage: '客户档案列表读取失败',
  loadErrorMessage: '客户管理列表读取失败',
  actionFailedMessage: '客户管理动作未生效，请稍后重试',
  actionErrorMessage: '客户管理操作失败',
  notReadyMessage: '客户档案登记入口尚未接入审批流',
})
</script>
